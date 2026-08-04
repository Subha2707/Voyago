/**
 * Budget calculation utilities for Voyago.
 * All monetary values are in INR.
 */

/**
 * Calculate the full trip cost breakdown.
 *
 * @param {Object} params
 * @param {Object} params.cityData       - CityData document from MongoDB
 * @param {Array}  params.routeEstimate  - Array of RouteEstimate documents
 * @param {number} params.days           - Number of travel days
 * @param {number} params.travelers      - Number of travelers
 * @param {string} params.hotelTier      - 'budget' | 'mid' | 'luxury'
 * @param {string} params.mode           - Preferred transport mode: 'flight' | 'train' | 'bus'
 * @param {Object} params.journeyPlan    - Prebuilt journey plan from routePlanner
 * @returns {Object} cost breakdown with { transport, stay, food, localTransport, total }
 */
export const calcTripCost = ({
  cityData,
  routeEstimate = [],
  days,
  travelers,
  hotelTier = 'mid',
  mode,
  journeyPlan,
}) => {
  if (!cityData) return null;

  // â”€â”€ Transport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  let transportMin = 0;
  let transportMax = 0;
  let transportMode = 'bus';
  let bookingLink = 'https://www.google.com/flights';
  let journey = null;

  if (journeyPlan && journeyPlan.feasible) {
    // Use the backend journey plan (per-person one-way legs, round trip Ã— travelers)
    transportMin = journeyPlan.roundTripMin * travelers;
    transportMax = journeyPlan.roundTripMax * travelers;
    transportMode = journeyPlan.mode;
    bookingLink = journeyPlan.bookingLink || bookingLink;
    journey = journeyPlan.legs.map((l) => ({
      from: l.from,
      to: l.to,
      mode: l.mode,
      min: l.min,
      max: l.max,
      durationHrs: l.durationHrs,
      bookingLink: l.bookingLink,
      seeded: Boolean(l.seeded),
      note: l.note || '',
    }));
  } else if (mode) {
    // Preferred mode supplied, no journey plan â†’ pick that mode's direct route
    const direct = routeEstimate.find((r) => r.mode === mode);
    if (direct) {
      transportMin = direct.avgCostRange.min * travelers * 2;
      transportMax = direct.avgCostRange.max * travelers * 2;
      transportMode = direct.mode;
      bookingLink = direct.bookingLink || bookingLink;
      journey = [
        {
          from: null,
          to: null,
          mode: direct.mode,
          min: direct.avgCostRange.min,
          max: direct.avgCostRange.max,
          durationHrs: direct.avgDurationHrs,
          bookingLink: direct.bookingLink,
          seeded: true,
          note: '',
        },
      ];
    } else if (routeEstimate && routeEstimate.length > 0) {
      // Mode not available â†’ fall back to priority: flight > train > bus
      const flight = routeEstimate.find((r) => r.mode === 'flight');
      const train = routeEstimate.find((r) => r.mode === 'train');
      const best = flight || train || routeEstimate[0];
      if (best) {
        transportMin = best.avgCostRange.min * travelers * 2;
        transportMax = best.avgCostRange.max * travelers * 2;
        transportMode = best.mode;
        bookingLink = best.bookingLink || bookingLink;
      }
    } else if (cityData) {
      const isInternational = cityData.currency !== 'INR';
      transportMin = (isInternational ? 9000 : 3500) * travelers * 2;
      transportMax = (isInternational ? 25000 : 7000) * travelers * 2;
      transportMode = 'flight';
    }
  } else if (routeEstimate && routeEstimate.length > 0) {
    // Priority: flight > train > bus
    const flight = routeEstimate.find((r) => r.mode === 'flight');
    const train = routeEstimate.find((r) => r.mode === 'train');
    const bus = routeEstimate.find((r) => r.mode === 'bus');
    const best = flight || train || bus;

    if (best) {
      // Round trip Ã— number of travelers
      transportMin = best.avgCostRange.min * travelers * 2;
      transportMax = best.avgCostRange.max * travelers * 2;
      transportMode = best.mode;
      bookingLink = best.bookingLink || bookingLink;
    }
  } else if (cityData) {
    // No pre-seeded route for this source â†’ sensible fallback estimate so the
    // plan/surprise flow still returns useful numbers for any city worldwide.
    const isInternational = cityData.currency !== 'INR';
    transportMin = (isInternational ? 9000 : 3500) * travelers * 2;
    transportMax = (isInternational ? 25000 : 7000) * travelers * 2;
    transportMode = 'flight';
  }

  // â”€â”€ Accommodation â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  // Assume 2 travelers share a room
  const rooms = Math.ceil(travelers / 2);
  const hotelCostPerNight =
    cityData.avgHotelCost?.[hotelTier] ||
    cityData.avgHotelCost?.mid ||
    2000;
  const stayMin = Math.round(hotelCostPerNight * days * rooms * 0.85);
  const stayMax = Math.round(hotelCostPerNight * days * rooms * 1.15);

  // â”€â”€ Food â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const streetFoodPerDay = cityData.avgFoodCostPerDay?.streetFood || 400;
  const restaurantPerDay = cityData.avgFoodCostPerDay?.restaurant || 800;
  const foodMin = Math.round(streetFoodPerDay * days * travelers);
  const foodMax = Math.round(restaurantPerDay * days * travelers);

  // â”€â”€ Local Transport â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const localPerDay = cityData.localTransportCostPerDay || 400;
  const localMin = Math.round(localPerDay * 0.8 * days * travelers);
  const localMax = Math.round(localPerDay * 1.2 * days * travelers);

  // â”€â”€ Totals â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const totalMin = transportMin + stayMin + foodMin + localMin;
  const totalMax = transportMax + stayMax + foodMax + localMax;

  return {
    transport: {
      min: Math.round(transportMin),
      max: Math.round(transportMax),
      mode: transportMode,
      bookingLink,
      journey,
    },
    stay: {
      min: stayMin,
      max: stayMax,
      tier: hotelTier,
    },
    food: {
      min: foodMin,
      max: foodMax,
    },
    localTransport: {
      min: localMin,
      max: localMax,
    },
    total: {
      min: totalMin,
      max: totalMax,
    },
  };
};

/**
 * Match destinations to a given budget.
 *
 * tolerance = 0.175 means ±17.5% from the budget center.
 * FitScore formula: 60% budget proximity + 40% safety score.
 *
 * @param {Object} params
 * @param {number} params.budget        - Target budget in INR
 * @param {number} params.tolerance     - Fractional tolerance (default 0.175)
 * @param {Array}  params.allCityData   - All CityData documents
 * @param {Array}  params.allRoutes     - All RouteEstimate documents
 * @param {string} params.source        - Departure city
 * @param {number} params.days          - Number of travel days
 * @param {number} params.travelers     - Number of travelers
 * @param {string} params.hotelTier     - 'budget' | 'mid' | 'luxury'
 * @returns {Array} Sorted array of { cityData, totalMin, totalMax, fitScore, breakdown }
 */
export const matchDestinationsToBudget = ({
  budget,
  tolerance = 0.175,
  allCityData,
  allRoutes,
  source,
  days,
  travelers,
  hotelTier = 'mid',
}) => {
  const results = [];
  const budgetLow = budget * (1 - tolerance);
  const budgetHigh = budget * (1 + tolerance);

  for (const cityData of allCityData) {
    const destination = cityData.cityName;

    // Get routes from this source to this destination
    const routeEstimate = allRoutes.filter(
      (r) =>
        r.source.toLowerCase() === source.toLowerCase() &&
        r.destination.toLowerCase() === destination.toLowerCase()
    );

    const breakdown = calcTripCost({
      cityData,
      routeEstimate,
      days,
      travelers,
      hotelTier,
    });

    if (!breakdown) continue;

    const { total } = breakdown;
    const midpoint = (total.min + total.max) / 2;

    // Filter: midpoint must be within tolerance band
    if (midpoint < budgetLow || midpoint > budgetHigh) continue;

    // FitScore: 60 pts for budget proximity + 40 pts for safety
    const diff = Math.abs(midpoint - budget);
    const maxAllowedDiff = budget * tolerance;
    const budgetScore = Math.max(0, 60 * (1 - diff / maxAllowedDiff));
    const safetyRaw = cityData.safetyScore || 5;
    const safetyScore = (safetyRaw / 10) * 40;
    const fitScore = Math.round(budgetScore + safetyScore);

    results.push({
      cityData,
      totalMin: total.min,
      totalMax: total.max,
      fitScore,
      breakdown,
    });
  }

  // Sort by fitScore descending (best matches first)
  results.sort((a, b) => b.fitScore - a.fitScore);
  return results;
};
