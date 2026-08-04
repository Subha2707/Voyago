import RouteEstimate from '../models/RouteEstimate.js';

/**
 * Route Planner for Voyago.
 *
 * Decides which transport modes (flight / train / bus) are actually possible for
 * a given source â†’ destination pair and, when there is no direct connection,
 * builds a detailed multi-leg journey plan (e.g. Kolkata â†’ Manali = fly/train to
 * Delhi, then road to Manali) with per-leg cost and duration. All money in INR,
 * per person, one way per leg.
 */

// â”€â”€ Reference data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HUBS = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore'];

// Destinations that have no reliable commercial airport â†’ the flight leg must end
// at a gateway hub and finish by road.
const NO_DIRECT_FLIGHT = new Set([
  'manali', 'shimla', 'dharamshala', 'mcleod ganj', 'dalhousie', 'leh', 'ladakh',
  'kargil', 'spiti valley', 'spiti', 'gulmarg', 'pahalgam', 'sonamarg',
  'nainital', 'mussoorie', 'rishikesh', 'coorg', 'madikeri', 'munnar', 'thekkady',
  'wayanad', 'ooty', 'coonoor', 'kodaikanal', 'hampi', 'gangtok', 'darjeeling',
  'tawang', 'kaziranga', 'shillong', 'aizawl', 'imphal', 'agartala', 'daman',
  'diu', 'mount abu', 'rann of kutch', 'kutch', 'jog falls', 'agumbe',
  'chopta', 'auli', 'andaman islands', 'port blair', 'lakshadweep',
  'spiti', 'siliguri', 'dehradun', 'haridwar', 'bodh gaya', 'puri', 'konark',
  'rajgir', 'dholavira', 'ziro', 'dawki', 'meghalaya',
]);

// Destinations that have no railway station â†’ the train leg must end at a rail
// hub and finish by road.
const NO_RAIL = new Set([
  'manali', 'leh', 'ladakh', 'kargil', 'spiti valley', 'spiti', 'coorg',
  'madikeri', 'munnar', 'thekkady', 'wayanad', 'gangtok', 'tawang', 'kaziranga',
  'hampi', 'daman', 'diu', 'mount abu', 'rann of kutch', 'kutch', 'jog falls',
  'agumbe', 'chopta', 'auli', 'andaman islands', 'port blair', 'lakshadweep',
  'dalhousie', 'mcleod ganj', 'shillong', 'aizawl', 'imphal', 'agartala',
  'dholavira', 'ziro', 'dawki', 'meghalaya',
]);

// Destinations reachable only by air (or sea) â†’ bus/train impossible.
const ISLAND = new Set(['andaman islands', 'port blair', 'lakshadweep']);

// Gateway hub used for the final road/rail leg for destinations without a direct
// flight or rail connection.
const GATEWAYS = {
  manali: 'Delhi', shimla: 'Delhi', dharamshala: 'Delhi', 'mcleod ganj': 'Delhi',
  dalhousie: 'Delhi', leh: 'Delhi', ladakh: 'Delhi', kargil: 'Delhi',
  'spiti valley': 'Delhi', spiti: 'Delhi', gulmarg: 'Delhi', pahalgam: 'Delhi',
  sonamarg: 'Delhi', nainital: 'Delhi', mussoorie: 'Delhi', rishikesh: 'Delhi',
  haridwar: 'Delhi', dehradun: 'Delhi', 'bodh gaya': 'Kolkata', rajgir: 'Kolkata',
  puri: 'Kolkata', konark: 'Kolkata', darjeeling: 'Kolkata', gangtok: 'Kolkata',
  siliguri: 'Kolkata', kaziranga: 'Kolkata', tawang: 'Kolkata', shillong: 'Kolkata',
  guwahati: 'Kolkata', agartala: 'Kolkata', aizawl: 'Kolkata', imphal: 'Kolkata',
  coorg: 'Bangalore', madikeri: 'Bangalore', ooty: 'Bangalore', coonoor: 'Bangalore',
  kodaikanal: 'Bangalore', munnar: 'Bangalore', thekkady: 'Bangalore',
  wayanad: 'Bangalore', alleppey: 'Bangalore', hampi: 'Bangalore', 'jog falls': 'Bangalore',
  agumbe: 'Bangalore', 'rann of kutch': 'Mumbai', kutch: 'Mumbai', dwarka: 'Mumbai',
  somnath: 'Mumbai', diu: 'Mumbai', daman: 'Mumbai', 'mount abu': 'Mumbai',
  'andaman islands': 'Chennai', 'port blair': 'Chennai', lakshadweep: 'Bangalore',
};

// International destinations reachable overland (road/rail + border crossing).
const OVERLAND_INTL = {
  kathmandu: { via: 'Delhi', finalMode: 'bus' },
  pokhara: { via: 'Delhi', finalMode: 'bus' },
  bhaktapur: { via: 'Delhi', finalMode: 'bus' },
  thimphu: { via: 'Delhi', finalMode: 'bus' },
  paro: { via: 'Delhi', finalMode: 'bus' },
  dhaka: { via: 'Kolkata', finalMode: 'bus' },
  chittagong: { via: 'Kolkata', finalMode: 'bus' },
  yangon: { via: 'Kolkata', finalMode: 'bus' },
};

const MODE_LABEL = { flight: 'Flight', train: 'Train', bus: 'Bus' };

const DEFAULT_BOOKING = {
  flight: 'https://www.google.com/flights',
  train: 'https://www.irctc.co.in',
  bus: 'https://www.redbus.in',
};

// Known coordinates for hubs + common gateway/intermediate cities (km estimates).
const KNOWN_COORDS = {
  delhi: { lat: 28.6139, lng: 77.209 },
  mumbai: { lat: 19.076, lng: 72.8777 },
  kolkata: { lat: 22.5726, lng: 88.3639 },
  chennai: { lat: 13.0827, lng: 80.2707 },
  bangalore: { lat: 12.9716, lng: 77.5946 },
  hyderabad: { lat: 17.385, lng: 78.4867 },
  pune: { lat: 18.5204, lng: 73.8567 },
  ahmedabad: { lat: 23.0225, lng: 72.5714 },
  jaipur: { lat: 26.9124, lng: 75.7873 },
  agra: { lat: 27.1767, lng: 78.0081 },
  varanasi: { lat: 25.3176, lng: 82.9739 },
  lucknow: { lat: 26.8467, lng: 80.9462 },
  patna: { lat: 25.5941, lng: 85.1376 },
  bhubaneswar: { lat: 20.2961, lng: 85.8245 },
  chandigarh: { lat: 30.7333, lng: 76.7794 },
  amritsar: { lat: 31.634, lng: 74.8723 },
  goa: { lat: 15.2993, lng: 74.124 },
  kochi: { lat: 9.9312, lng: 76.2673 },
  coimbatore: { lat: 11.0168, lng: 76.9558 },
  madurai: { lat: 9.9252, lng: 78.1198 },
  trichy: { lat: 10.7905, lng: 78.7047 },
  visakhapatnam: { lat: 17.6868, lng: 83.2185 },
  guwahati: { lat: 26.1445, lng: 91.7362 },
  surat: { lat: 21.1702, lng: 72.8311 },
  kanpur: { lat: 26.4499, lng: 80.3319 },
  indore: { lat: 22.7196, lng: 75.8577 },
  bhopal: { lat: 23.2599, lng: 77.4126 },
  nagpur: { lat: 21.1458, lng: 79.0882 },
  udupi: { lat: 13.3409, lng: 74.7421 },
  mangalore: { lat: 12.9141, lng: 74.856 },
  'tirupati': { lat: 13.6288, lng: 79.4192 },
  kakinada: { lat: 16.9891, lng: 82.2475 },
  gwalior: { lat: 26.2183, lng: 78.1828 },
};

// â”€â”€ Helpers â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const norm = (s) => (s || '').toString().trim().toLowerCase().replace(/\s+/g, ' ');

const toRad = (deg) => (deg * Math.PI) / 180;

const haversineKm = (a, b) => {
  if (!a || !b) return null;
  const R = 6371;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return Math.round(2 * R * Math.asin(Math.sqrt(h)));
};

const getCoords = (name, cityDataMap) => {
  const key = norm(name);
  if (KNOWN_COORDS[key]) return KNOWN_COORDS[key];
  const doc = cityDataMap?.[key];
  if (doc?.coordinates?.lat != null && doc?.coordinates?.lng != null) {
    return { lat: doc.coordinates.lat, lng: doc.coordinates.lng };
  }
  return null;
};

const findRoute = (routes, from, to, mode) => {
  const f = norm(from);
  const t = norm(to);
  return (
    routes.find(
      (r) =>
        norm(r.source) === f &&
        norm(r.destination) === t &&
        norm(r.mode) === mode
    ) || null
  );
};

const estimateByMode = (dist, mode) => {
  if (mode === 'flight') {
    return {
      min: Math.round(2200 + dist * 4),
      max: Math.round(4500 + dist * 9),
      durationHrs: Math.max(1, Math.round(dist / 750 + 1.5)),
    };
  }
  if (mode === 'train') {
    return {
      min: Math.round(600 + dist * 1.2),
      max: Math.round(1500 + dist * 2.5),
      durationHrs: Math.max(2, Math.round(dist / 60)),
    };
  }
  return {
    min: Math.round(400 + dist * 1.1),
    max: Math.round(900 + dist * 2),
    durationHrs: Math.max(1, Math.round(dist / 45)),
  };
};

/**
 * Resolve cost/duration for one leg, using the seeded RouteEstimate when
 * available and falling back to a distance-based estimate.
 */
const resolveLeg = (from, to, mode, routes, cityDataMap) => {
  const seeded = findRoute(routes, from, to, mode);
  const leg = {
    from,
    to,
    mode,
    min: 0,
    max: 0,
    durationHrs: 0,
    bookingLink: DEFAULT_BOOKING[mode] || DEFAULT_BOOKING.flight,
    seeded: false,
    note: '',
  };

  if (seeded) {
    leg.min = seeded.avgCostRange.min;
    leg.max = seeded.avgCostRange.max;
    leg.durationHrs = seeded.avgDurationHrs || 0;
    leg.bookingLink = seeded.bookingLink || leg.bookingLink;
    leg.seeded = true;
    return leg;
  }

  const dist = haversineKm(getCoords(from, cityDataMap), getCoords(to, cityDataMap));
  if (dist == null) {
    return null;
  }
  const est = estimateByMode(dist, mode);
  leg.min = est.min;
  leg.max = est.max;
  leg.durationHrs = est.durationHrs;
  leg.note = 'Estimated';
  return leg;
};

// Is a *direct* connection possible geographically (used when no seed exists,
// e.g. non-hub source cities)?
const directFeasibleGeo = ({ source, destination, mode, cityDataMap }) => {
  const destNorm = norm(destination);
  const srcNorm = norm(source);
  const dist = haversineKm(getCoords(source, cityDataMap), getCoords(destination, cityDataMap));
  if (dist == null) return { possible: false, distance: null };

  if (mode === 'flight') {
    if (NO_DIRECT_FLIGHT.has(destNorm) || NO_DIRECT_FLIGHT.has(srcNorm)) {
      return { possible: false, distance: dist };
    }
    return { possible: dist >= 250, distance: dist };
  }
  if (mode === 'train') {
    if (NO_RAIL.has(destNorm) || NO_RAIL.has(srcNorm)) {
      return { possible: false, distance: dist };
    }
    return { possible: dist >= 100, distance: dist };
  }
  // bus
  if (ISLAND.has(destNorm) || ISLAND.has(srcNorm)) {
    return { possible: false, distance: dist };
  }
  return { possible: dist <= 2200, distance: dist };
};

const nearestHubTo = (destination, cityDataMap) => {
  const destCoords = getCoords(destination, cityDataMap);
  if (!destCoords) return 'Delhi';
  let best = 'Delhi';
  let bestDist = Infinity;
  for (const hub of HUBS) {
    const hubCoords = getCoords(hub, cityDataMap);
    const d = haversineKm(destCoords, hubCoords);
    if (d != null && d < bestDist) {
      bestDist = d;
      best = hub;
    }
  }
  return best;
};

const buildPlan = (legs, { direct, note, mode } = {}) => {
  const oneWayMin = legs.reduce((s, l) => s + l.min, 0);
  const oneWayMax = legs.reduce((s, l) => s + l.max, 0);
  const totalDurationHrs = legs.reduce((s, l) => s + (l.durationHrs || 0), 0);
  const bookingLink = legs[0]?.bookingLink || DEFAULT_BOOKING.flight;
  return {
    feasible: true,
    direct,
    mode: mode || legs[legs.length - 1].mode,
    note,
    legs,
    oneWayMin,
    oneWayMax,
    roundTripMin: oneWayMin * 2,
    roundTripMax: oneWayMax * 2,
    totalDurationHrs,
    bookingLink,
  };
};

const singleLeg = (from, to, mode, routes, cityDataMap, direct = true) => {
  const leg = resolveLeg(from, to, mode, routes, cityDataMap);
  if (!leg) return null;
  return buildPlan([leg], { direct, note: 'Direct connection' });
};

// â”€â”€ Main builder â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const buildJourneyPlan = async ({
  source,
  destination,
  mode,
  cityData,
  routes = [],
  cityDataMap = {},
}) => {
  if (!source || !destination || !mode) {
    return { feasible: false, reason: 'source, destination and mode are required.' };
  }
  if (!['flight', 'train', 'bus'].includes(mode)) {
    return { feasible: false, reason: `Unknown transport mode: ${mode}` };
  }

  const srcNorm = norm(source);
  const destNorm = norm(destination);
  if (srcNorm === destNorm) {
    return { feasible: false, reason: 'Departure and destination cannot be the same.' };
  }

  const isIntl = Boolean(cityData?.country && cityData.country !== 'India');
  const island = ISLAND.has(destNorm);

  // â”€â”€ International routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (isIntl) {
    if (mode === 'flight') {
      const direct = singleLeg(source, destination, 'flight', routes, cityDataMap, true);
      if (direct) {
        return { ...direct, note: 'Direct international flight' };
      }
      return {
        feasible: false,
        reason: `Could not determine a flight route from ${source} to ${destination}.`,
      };
    }

    // train / bus
    const ov = OVERLAND_INTL[destNorm];
    if (!ov) {
      return {
        feasible: false,
        reason: `There is no ${MODE_LABEL[mode]} connectivity from ${source} to ${destination}. Only flight is possible for this international route.`,
      };
    }

    const legs = [];
    const via = ov.via;
    if (srcNorm !== norm(via)) {
      const leg1 = resolveLeg(source, via, mode, routes, cityDataMap);
      if (!leg1) {
        return { feasible: false, reason: `Could not determine a ${MODE_LABEL[mode]} route from ${source} to ${via}.` };
      }
      legs.push(leg1);
    }
    const finalMode = ov.finalMode === 'bus' ? 'bus' : mode;
    const leg2 = resolveLeg(via, destination, finalMode, routes, cityDataMap);
    if (!leg2) {
      return { feasible: false, reason: `Could not determine the overland connection into ${destination}.` };
    }
    legs.push(leg2);

    return buildPlan(legs, {
      direct: false,
      mode,
      note: `No direct ${MODE_LABEL[mode]} — travel overland via ${via} (border crossing)`,
    });
  }

  // â”€â”€ Domestic routes â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (island) {
    if (mode === 'flight') {
      const gateway = GATEWAYS[destNorm] || 'Chennai';
      const legs = [];
      if (srcNorm !== norm(gateway)) {
        const leg1 = resolveLeg(source, gateway, 'flight', routes, cityDataMap);
        if (!leg1) {
          return { feasible: false, reason: `Could not determine a flight from ${source} to ${gateway}.` };
        }
        legs.push(leg1);
      }
      const leg2 = resolveLeg(gateway, destination, 'flight', routes, cityDataMap);
      if (!leg2) {
        return { feasible: false, reason: `Could not determine the connecting flight to ${destination}.` };
      }
      legs.push(leg2);
      return buildPlan(legs, {
        direct: false,
        mode: 'flight',
        note: `No direct flight to ${destination} — fly via ${gateway}`,
      });
    }
    return {
      feasible: false,
      reason: `${MODE_LABEL[mode]} is not possible for ${destination}. The islands are accessible only by air (or sea).`,
    };
  }

  // Direct seeded connection (but never for destinations that can't take the
  // mode directly, e.g. a seeded 'flight' to Manali which has no airport)
  const geo = directFeasibleGeo({ source, destination, mode, cityDataMap });
  const direct = findRoute(routes, source, destination, mode);
  if (direct && geo.possible) {
    return singleLeg(source, destination, mode, routes, cityDataMap, true);
  }

  // Geo-estimated direct connection (covers non-seeded source cities)
  if (geo.possible) {
    const directPlan = singleLeg(source, destination, mode, routes, cityDataMap, true);
    if (directPlan) {
      return { ...directPlan, note: 'Direct connection (estimated)' };
    }
  }

  // Multi-leg via a gateway hub
  const gateway = GATEWAYS[destNorm] || nearestHubTo(destination, cityDataMap);
  const legs = [];

  if (srcNorm !== norm(gateway)) {
    let leg1Mode = mode;
    if (mode === 'flight' && NO_DIRECT_FLIGHT.has(srcNorm)) leg1Mode = 'bus';
    if (mode === 'train' && NO_RAIL.has(srcNorm)) leg1Mode = 'bus';
    const leg1 = resolveLeg(source, gateway, leg1Mode, routes, cityDataMap);
    if (!leg1) {
      return {
        feasible: false,
        reason: `Could not determine a ${MODE_LABEL[leg1Mode]} route from ${source} to ${gateway}.`,
      };
    }
    legs.push(leg1);
  }

  let finalMode = mode;
  if (mode === 'flight' && NO_DIRECT_FLIGHT.has(destNorm)) finalMode = 'bus';
  if (mode === 'train' && NO_RAIL.has(destNorm)) finalMode = 'bus';

  const leg2 = resolveLeg(gateway, destination, finalMode, routes, cityDataMap);
  if (!leg2) {
    return {
      feasible: false,
      reason: `Could not determine a ${MODE_LABEL[finalMode]} connection from ${gateway} to ${destination}.`,
    };
  }
  legs.push(leg2);

  return buildPlan(legs, {
    direct: false,
    mode,
    note:
      srcNorm === norm(gateway)
        ? `No direct ${MODE_LABEL[mode]} to ${destination} — final stretch by ${MODE_LABEL[finalMode]} via ${gateway}`
        : `No direct ${MODE_LABEL[mode]} — travel ${MODE_LABEL[mode]} to ${gateway}, then ${MODE_LABEL[finalMode]} to ${destination}`,
  });
};

// â”€â”€ Feasible modes for a source â†’ destination pair â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const getRouteOptions = async ({ source, destination, cityData, routes = [], cityDataMap = {} }) => {
  const availableModes = [];
  const unavailableModes = [];

  for (const mode of ['flight', 'train', 'bus']) {
    const plan = await buildJourneyPlan({
      source,
      destination,
      mode,
      cityData,
      routes,
      cityDataMap,
    });
    if (plan.feasible) {
      availableModes.push({
        mode,
        label: MODE_LABEL[mode],
        direct: plan.direct,
        note: plan.note,
        roundTripMin: plan.roundTripMin,
        roundTripMax: plan.roundTripMax,
        totalDurationHrs: plan.totalDurationHrs,
        legs: plan.legs.map((l) => ({
          from: l.from,
          to: l.to,
          mode: l.mode,
          min: l.min,
          max: l.max,
          durationHrs: l.durationHrs,
        })),
      });
    } else {
      unavailableModes.push({ mode, label: MODE_LABEL[mode], reason: plan.reason });
    }
  }

  return { availableModes, unavailableModes };
};

export default { buildJourneyPlan, getRouteOptions };
