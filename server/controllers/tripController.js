import Trip from '../models/Trip.js';
import CityData from '../models/CityData.js';
import RouteEstimate from '../models/RouteEstimate.js';
import User from '../models/User.js';
import { calcTripCost, matchDestinationsToBudget } from '../utils/budgetCalc.js';
import { getOrBuildCityData } from '../services/cityService.js';
import { buildJourneyPlan } from '../services/routePlanner.js';

// ── Flow A: Plan a specific trip ───────────────────────────────────────────────
export const planTrip = async (req, res, next) => {
  try {
    const {
      source,
      destination,
      startDate,
      endDate,
      travelers = 1,
      interests = [],
      budget,
      hotelTier = 'mid',
      mode = 'flight',
    } = req.body;

    if (!destination || !startDate || !endDate) {
      return res.status(400).json({
        success: false,
        message: 'destination, startDate, and endDate are required.',
      });
    }

    // Calculate trip duration in days
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.max(1, Math.ceil((end - start) / (1000 * 60 * 60 * 24)));

    // Lookup city data (case-insensitive); auto-builds a profile for any valid city
    const cityData = await getOrBuildCityData(destination);

    // Load all route estimates once for journey planning
    const allRoutes = await RouteEstimate.find({});

    // Build the journey plan for the selected transport mode. The backend is the
    // source of truth for whether the mode is possible for this route.
    let journeyPlan = null;
    if (source) {
      const cityDataMap = {};
      if (cityData) cityDataMap[cityData.cityName.toLowerCase()] = cityData;
      const sourceCityData = await CityData.findOne({
        cityName: { $regex: new RegExp(`^${source}$`, 'i') },
      });
      if (sourceCityData) cityDataMap[sourceCityData.cityName.toLowerCase()] = sourceCityData;

      journeyPlan = await buildJourneyPlan({
        source,
        destination,
        mode,
        cityData,
        routes: allRoutes,
        cityDataMap,
      });

      if (!journeyPlan.feasible) {
        return res.status(400).json({
          success: false,
          message: `Not possible by ${mode === 'bus' ? 'bus' : mode === 'train' ? 'train' : 'flight'} for ${source} → ${destination}. ${journeyPlan.reason}`,
        });
      }
    }

    // Calculate cost breakdown
    const costBreakdown = cityData
      ? calcTripCost({
          cityData,
          routeEstimate: source
            ? allRoutes.filter(
                (r) =>
                  r.source.toLowerCase() === source.toLowerCase() &&
                  r.destination.toLowerCase() === destination.toLowerCase()
              )
            : [],
          days,
          travelers: Number(travelers),
          hotelTier,
          mode,
          journeyPlan,
        })
      : null;

    // Save trip to DB
    const trip = await Trip.create({
      userId: req.user.id,
      source: source || '',
      destination,
      startDate: start,
      endDate: end,
      travelers: Number(travelers),
      budget: budget || costBreakdown?.total?.max || 0,
      interests,
      flow: 'A',
      estimatedBudget: costBreakdown
        ? {
            transport: costBreakdown.transport,
            stay: costBreakdown.stay,
            food: costBreakdown.food,
            localTransport: costBreakdown.localTransport,
            total: costBreakdown.total,
          }
        : undefined,
    });

    // Link trip to user's savedTrips
    await User.findByIdAndUpdate(req.user.id, { $push: { savedTrips: trip._id } });

    console.log(`✅ Trip planned: ${source || 'Unknown'} → ${destination} (${days} days, ${travelers} traveler(s))`);

    res.status(201).json({
      success: true,
      trip: {
        ...trip.toObject(),
        costBreakdown,
        cityInfo: cityData || null,
        days,
      },
    });
  } catch (error) {
    next(error);
  }
};

// ── Flow B: Explore a destination ─────────────────────────────────────────────
export const exploreDestination = async (req, res, next) => {
  try {
    const { destination } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination is required.' });
    }

    const cityData = await getOrBuildCityData(destination);

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `Could not gather data for "${destination}". Please check the spelling and try again.`,
      });
    }

    // Create an exploration record
    const trip = await Trip.create({
      userId: req.user.id,
      destination,
      flow: 'B',
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { savedTrips: trip._id } });

    console.log(`🔍 Destination explored: ${destination}`);

    res.json({
      success: true,
      cityData,
      bestMonths: cityData.bestMonths,
      tripId: trip._id,
      // AI-powered reasoning available via POST /api/ai/itinerary
      aiReasoningPlaceholder: `AI-powered itinerary for ${destination} → POST /api/ai/itinerary`,
    });
  } catch (error) {
    next(error);
  }
};

// ── Flow C: Surprise Me ────────────────────────────────────────────────────────
export const surpriseMe = async (req, res, next) => {
  try {
    const {
      location,
      travelDays = 5,
      travelers = 1,
      budget,
      tolerance = 0.175,
      hotelTier = 'mid',
    } = req.body;

    if (!budget) {
      return res.status(400).json({
        success: false,
        message: 'budget (in INR) is required for Surprise Me.',
      });
    }

    // Fetch all city data and route estimates from this location
    const [allCityData, allRoutes] = await Promise.all([
      CityData.find({}),
      location
        ? RouteEstimate.find({ source: { $regex: new RegExp(`^${location}$`, 'i') } })
        : RouteEstimate.find({}),
    ]);

    const matches = matchDestinationsToBudget({
      budget: Number(budget),
      tolerance,
      allCityData,
      allRoutes,
      source: location || '',
      days: Number(travelDays),
      travelers: Number(travelers),
      hotelTier,
    });

    const top5 = matches.slice(0, 5);

    if (top5.length === 0) {
      return res.status(200).json({
        success: true,
        matches: [],
        totalMatches: 0,
        message: 'No destinations found within that budget range. Try adjusting your budget or tolerance.',
      });
    }

    // Save the surprise trip
    const trip = await Trip.create({
      userId: req.user.id,
      source: location || '',
      destination: top5[0]?.cityData?.cityName || 'TBD',
      travelers: Number(travelers),
      budget: Number(budget),
      flow: 'C',
    });

    await User.findByIdAndUpdate(req.user.id, { $push: { savedTrips: trip._id } });

    console.log(`🎲 Surprise Me: Found ${top5.length} matches for ₹${budget} budget`);

    res.json({
      success: true,
      matches: top5,
      tripId: trip._id,
      totalMatches: matches.length,
    });
  } catch (error) {
    next(error);
  }
};

// ── Get all trips for current user ─────────────────────────────────────────────
export const getTrips = async (req, res, next) => {
  try {
    const trips = await Trip.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ success: true, trips, count: trips.length });
  } catch (error) {
    next(error);
  }
};

// ── Get a single trip by ID ────────────────────────────────────────────────────
export const getTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOne({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }
    res.json({ success: true, trip });
  } catch (error) {
    next(error);
  }
};

// ── Delete a trip by ID ────────────────────────────────────────────────────────
export const deleteTripById = async (req, res, next) => {
  try {
    const trip = await Trip.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    if (!trip) {
      return res.status(404).json({ success: false, message: 'Trip not found.' });
    }

    // Remove from user's savedTrips array
    await User.findByIdAndUpdate(req.user.id, { $pull: { savedTrips: trip._id } });

    console.log(`🗑️  Trip deleted: ${trip._id}`);
    res.json({ success: true, message: 'Trip deleted successfully.' });
  } catch (error) {
    next(error);
  }
};
