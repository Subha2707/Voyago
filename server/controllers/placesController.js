import CityData from '../models/CityData.js';

// ── getPlaces ──────────────────────────────────────────────────────────────────
export const getPlaces = async (req, res, next) => {
  try {
    const { city } = req.params;

    const cityData = await CityData.findOne({
      cityName: { $regex: new RegExp(`^${city}$`, 'i') },
    });

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `No data found for "${city}". The city may not be in our database yet.`,
      });
    }

    console.log(`📍 Places fetched for: ${cityData.cityName}`);

    res.json({ success: true, cityData });
  } catch (error) {
    next(error);
  }
};

// ── getBestTime ────────────────────────────────────────────────────────────────
export const getBestTime = async (req, res, next) => {
  try {
    const { city } = req.params;

    const cityData = await CityData.findOne(
      { cityName: { $regex: new RegExp(`^${city}$`, 'i') } },
      { cityName: 1, country: 1, bestMonths: 1, tags: 1 }
    );

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `No data found for "${city}".`,
      });
    }

    // Highlight recommended months (Low/Medium crowd and Low/Medium price)
    const recommended = cityData.bestMonths.filter(
      (m) => m.crowdLevel !== 'High' && m.priceLevel !== 'High'
    );

    res.json({
      success: true,
      city: cityData.cityName,
      country: cityData.country,
      bestMonths: cityData.bestMonths,
      recommended,
    });
  } catch (error) {
    next(error);
  }
};

// ── getSafety ──────────────────────────────────────────────────────────────────
export const getSafety = async (req, res, next) => {
  try {
    const { city } = req.params;

    const cityData = await CityData.findOne(
      { cityName: { $regex: new RegExp(`^${city}$`, 'i') } },
      {
        cityName: 1,
        country: 1,
        safetyScore: 1,
        soloTravelerSafety: 1,
        womenSafety: 1,
        emergencyContacts: 1,
        nearestHospitals: 1,
      }
    );

    if (!cityData) {
      return res.status(404).json({
        success: false,
        message: `No safety data found for "${city}".`,
      });
    }

    // Safety rating label
    const getSafetyLabel = (score) => {
      if (score >= 8) return 'Very Safe';
      if (score >= 6) return 'Generally Safe';
      if (score >= 4) return 'Exercise Caution';
      return 'High Risk';
    };

    res.json({
      success: true,
      city: cityData.cityName,
      country: cityData.country,
      safetyScore: cityData.safetyScore,
      safetyLabel: getSafetyLabel(cityData.safetyScore),
      soloTravelerSafety: cityData.soloTravelerSafety,
      womenSafety: cityData.womenSafety,
      emergencyContacts: cityData.emergencyContacts,
      nearestHospitals: cityData.nearestHospitals,
    });
  } catch (error) {
    next(error);
  }
};
