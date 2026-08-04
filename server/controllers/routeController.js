import RouteEstimate from '../models/RouteEstimate.js';
import CityData from '../models/CityData.js';
import { getOrBuildCityData } from '../services/cityService.js';
import { getRouteOptions as getRouteOptionsService } from '../services/routePlanner.js';

// ── Which transport modes are possible for a route ─────────────────────────────
export const getRouteOptions = async (req, res, next) => {
  try {
    const { source, destination } = req.body;

    if (!source || !destination) {
      return res.status(400).json({
        success: false,
        message: 'source and destination are required.',
      });
    }

    if (source.trim().toLowerCase() === destination.trim().toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: 'Departure and destination cannot be the same.',
      });
    }

    const [cityData, allRoutes, sourceCityData] = await Promise.all([
      getOrBuildCityData(destination),
      RouteEstimate.find({}),
      CityData.findOne({ cityName: { $regex: new RegExp(`^${source}$`, 'i') } }),
    ]);

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `Could not gather data for "${destination}". Please check the spelling and try again.`,
      });
    }

    const cityDataMap = {};
    if (cityData) cityDataMap[cityData.cityName.toLowerCase()] = cityData;
    if (sourceCityData) cityDataMap[sourceCityData.cityName.toLowerCase()] = sourceCityData;

    const options = await getRouteOptionsService({
      source,
      destination,
      cityData,
      routes: allRoutes,
      cityDataMap,
    });

    res.json({
      success: true,
      source,
      destination: cityData.cityName || destination,
      international: cityData.country !== 'India',
      ...options,
    });
  } catch (error) {
    next(error);
  }
};
