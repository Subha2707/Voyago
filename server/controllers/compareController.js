import { getOrBuildCityData } from '../services/cityService.js';

export const compareDestinations = async (req, res, next) => {
  try {
    const { city1, city2 } = req.body;

    if (!city1 || !city2) {
      return res.status(400).json({
        success: false,
        message: 'Both city1 and city2 are required for comparison.',
      });
    }

    const [data1, data2] = await Promise.all([
      getOrBuildCityData(city1),
      getOrBuildCityData(city2),
    ]);

    if (!data1 || !data2) {
      const missing = [];
      if (!data1) missing.push(city1);
      if (!data2) missing.push(city2);
      return res.status(404).json({
        success: false,
        message: `No data available for: ${missing.join(', ')}. Please check the spelling.`,
      });
    }

    // Comparison summary analytics
    const comparison = {
      cost: {
        budgetHotelDiff: data1.avgHotelCost.budget - data2.avgHotelCost.budget,
        midHotelDiff: data1.avgHotelCost.mid - data2.avgHotelCost.mid,
        luxuryHotelDiff: data1.avgHotelCost.luxury - data2.avgHotelCost.luxury,
        foodStreetDiff: data1.avgFoodCostPerDay.streetFood - data2.avgFoodCostPerDay.streetFood,
        foodRestDiff: data1.avgFoodCostPerDay.restaurant - data2.avgFoodCostPerDay.restaurant,
        cheaperCity:
          data1.avgHotelCost.mid + data1.avgFoodCostPerDay.restaurant <
          data2.avgHotelCost.mid + data2.avgFoodCostPerDay.restaurant
            ? data1.cityName
            : data2.cityName,
      },
      safety: {
        safetyDiff: data1.safetyScore - data2.safetyScore,
        soloDiff: data1.soloTravelerSafety - data2.soloTravelerSafety,
        womenDiff: data1.womenSafety - data2.womenSafety,
        saferCity: data1.safetyScore > data2.safetyScore ? data1.cityName : data2.cityName,
      },
    };

    res.json({
      success: true,
      city1: data1,
      city2: data2,
      comparison,
    });
  } catch (error) {
    next(error);
  }
};