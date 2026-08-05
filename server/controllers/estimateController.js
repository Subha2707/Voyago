import CityData from '../models/CityData.js';
import RouteEstimate from '../models/RouteEstimate.js';
import { calcTripCost, matchDestinationsToBudget } from '../utils/budgetCalc.js';
import { isValidDestination } from '../data/validCities.js';

// // Calculate full trip cost breakdown
export const getCostEstimate = async (req, res, next) => {
  try {
    const { source, destination, days = 5, travelers = 1, hotelTier = 'mid' } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination is required.' });
    }

    const cityData = await CityData.findOne({
      cityName: { $regex: new RegExp(`^${destination}$`, 'i') },
    });

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `No city data found for "${destination}".`,
      });
    }

    const routeEstimate = source
      ? await RouteEstimate.find({
          source: { $regex: new RegExp(`^${source}$`, 'i') },
          destination: { $regex: new RegExp(`^${destination}$`, 'i') },
        })
      : [];

    const breakdown = calcTripCost({
      cityData,
      routeEstimate,
      days: Number(days),
      travelers: Number(travelers),
      hotelTier,
    });

    res.json({
      success: true,
      city: cityData.cityName,
      breakdown,
    });
  } catch (error) {
    next(error);
  }
};

// // Split total cost estimate per person
export const splitCost = async (req, res, next) => {
  try {
    const { totalMin, totalMax, travelers = 1 } = req.body;

    if (totalMin === undefined || totalMax === undefined) {
      return res.status(400).json({
        success: false,
        message: 'totalMin and totalMax are required.',
      });
    }

    const count = Math.max(1, Number(travelers));
    res.json({
      success: true,
      travelers: count,
      perPersonMin: Math.round(totalMin / count),
      perPersonMax: Math.round(totalMax / count),
    });
  } catch (error) {
    next(error);
  }
};

// // Match destinations within a given budget (Flow C / Check Budget)
export const checkBudget = async (req, res, next) => {
  try {
    const {
      source,
      budget,
      days = 5,
      travelers = 1,
      tolerance = 0.175,
      hotelTier = 'mid',
    } = req.body;

    if (!budget) {
      return res.status(400).json({ success: false, message: 'budget is required.' });
    }

    const [allCityData, allRoutes] = await Promise.all([
      CityData.find({}),
      source
        ? RouteEstimate.find({ source: { $regex: new RegExp(`^${source}$`, 'i') } })
        : RouteEstimate.find({}),
    ]);

    // Only consider real, canonical destinations (see validCities.js)
    const cityData = allCityData.filter((c) => isValidDestination(c.cityName));

    const matches = matchDestinationsToBudget({
      budget: Number(budget),
      tolerance: Number(tolerance),
      allCityData: cityData,
      allRoutes,
      source: source || '',
      days: Number(days),
      travelers: Number(travelers),
      hotelTier,
    });

    res.json({
      success: true,
      budget,
      tolerance,
      matches,
      totalMatches: matches.length,
    });
  } catch (error) {
    next(error);
  }
};
