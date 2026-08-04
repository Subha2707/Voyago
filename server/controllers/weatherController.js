import axios from 'axios';

const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

// ── Mock data helpers ──────────────────────────────────────────────────────────
const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < (str || '').length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

// Climate profiles used to make mock forecasts feel plausible per destination
const climateProfiles = [
  { base: 14, range: 8, conds: [['Partly Cloudy', '02d'], ['Clear Sky', '01d'], ['Scattered Clouds', '03d']] },   // Cool temperate
  { base: 24, range: 8, conds: [['Sunny', '01d'], ['Partly Cloudy', '02d'], ['Clear Sky', '01d']] },               // Warm tropical
  { base: 30, range: 5, conds: [['Sunny', '01d'], ['Haze', '50d'], ['Clear Sky', '01d']] },                        // Hot/dry
  { base: 18, range: 9, conds: [['Light Rain', '10d'], ['Clouds', '03d'], ['Overcast', '04d']] },                  // Rainy/humid
  { base: -1, range: 10, conds: [['Snow', '13d'], ['Clear Sky', '01d'], ['Cloudy', '04d']] },                      // Cold/snowy
];

const getMockForecast = (city) => {
  const profile = climateProfiles[hashString(city) % climateProfiles.length];
  const base = profile.base;
  return Array.from({ length: 7 }, (_, i) => {
    const [description, icon] = profile.conds[(hashString(`${city}-day-${i}`) + i) % profile.conds.length];
    const date = new Date();
    date.setDate(date.getDate() + i);
    const variation = (hashString(`${city}-${i}`) % 5) - 2; // -2..2
    return {
      date: date.toISOString().split('T')[0],
      temp_min: Math.round(base + variation - 3),
      temp_max: Math.round(base + variation + profile.range / 2),
      description,
      icon,
      humidity: Math.round(40 + (hashString(`${city}-hum-${i}`) % 55)),
      wind: Math.round(4 + (hashString(`${city}-wind-${i}`) % 14)),
    };
  });
};

const getMockAQI = (city) => {
  // Deterministic per city so AQI actually differs by destination
  const aqi = 1 + (hashString(`aqi-${city}`) % 4);
  const levels = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor' };
  const baseComponents = [
    { co: 230, no: 0.4, no2: 7.9, o3: 55, so2: 1.5, pm2_5: 12, pm10: 18, nh3: 0.9 },
    { co: 380, no: 1.1, no2: 15.2, o3: 48, so2: 3.2, pm2_5: 26, pm10: 41, nh3: 1.6 },
    { co: 640, no: 2.2, no2: 28.4, o3: 41, so2: 6.8, pm2_5: 55, pm10: 88, nh3: 2.4 },
    { co: 980, no: 3.8, no2: 46.1, o3: 33, so2: 11.4, pm2_5: 96, pm10: 155, nh3: 3.1 },
  ];
  const scale = (1 + (hashString(city) % 100) / 200); // 1.0 - 1.5 variation
  const c = baseComponents[aqi - 1];
  const components = {};
  Object.entries(c).forEach(([k, v]) => (components[k] = Number((v * scale).toFixed(1))));
  return { aqi, level: levels[aqi], components };
};

// AQI level mapping
const getAQILevel = (aqi) => {
  const levels = { 1: 'Good', 2: 'Fair', 3: 'Moderate', 4: 'Poor', 5: 'Very Poor' };
  return levels[aqi] || 'Unknown';
};

// ── getForecast ────────────────────────────────────────────────────────────────
export const getForecast = async (req, res, next) => {
  try {
    const { city } = req.params;
    const { startDate, endDate } = req.query;

    console.log(`🌤️  Fetching forecast for: ${city}`);

    if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'your_openweather_key') {
      console.log('⚠️  No OpenWeather API key — returning mock forecast data');
      return res.json({
        success: true,
        city,
        forecast: getMockForecast(city),
        source: 'mock',
      });
    }

    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: {
        q: city,
        appid: OPENWEATHER_KEY,
        units: 'metric',
        cnt: 56, // 7 days × 8 slots/day
      },
    });

    const { list } = response.data;

    // Aggregate per-day forecast
    const dailyMap = {};
    list.forEach((item) => {
      const date = item.dt_txt.split(' ')[0];
      if (!dailyMap[date]) {
        dailyMap[date] = { temps: [], humidity: [], wind: [], description: '', icon: '' };
      }
      dailyMap[date].temps.push(item.main.temp_min, item.main.temp_max);
      dailyMap[date].humidity.push(item.main.humidity);
      dailyMap[date].wind.push(item.wind.speed);
      // Use midday slot for description/icon
      if (item.dt_txt.includes('12:00')) {
        dailyMap[date].description = item.weather[0].description;
        dailyMap[date].icon = item.weather[0].icon;
      }
    });

    const forecast = Object.entries(dailyMap)
      .slice(0, 7)
      .map(([date, data]) => ({
        date,
        temp_min: Math.round(Math.min(...data.temps)),
        temp_max: Math.round(Math.max(...data.temps)),
        description: data.description || list[0]?.weather[0]?.description || 'Clear',
        icon: data.icon || list[0]?.weather[0]?.icon || '01d',
        humidity: Math.round(data.humidity.reduce((a, b) => a + b, 0) / data.humidity.length),
        wind: Math.round(data.wind.reduce((a, b) => a + b, 0) / data.wind.length),
      }));

    // The free OpenWeather tier only returns ~5 days. Pad out to a full 7-day
    // outlook by extrapolating the most recent values, clearly marked as estimated
    // so the UI can tell users only the first days are the real 5-day forecast.
    while (forecast.length < 7) {
      const last = forecast[forecast.length - 1];
      const nextDate = new Date(last.date);
      nextDate.setDate(nextDate.getDate() + 1);
      forecast.push({
        date: nextDate.toISOString().split('T')[0],
        temp_min: last.temp_min + (last.temp_min >= last.temp_max ? -1 : 0),
        temp_max: last.temp_max + 1,
        description: last.description,
        icon: last.icon,
        humidity: last.humidity,
        wind: last.wind,
        estimated: true,
      });
    }
    // Mark the actual API-provided days (they are the trustworthy portion)
    forecast.forEach((d, i) => { if (!d.estimated) d.estimated = i > 4; });

    res.json({ success: true, city, forecast, source: 'openweathermap' });
  } catch (error) {
    console.error('Weather forecast error:', error.message);
    // Graceful fallback to mock data
    res.json({
      success: true,
      city: req.params.city,
      forecast: getMockForecast(req.params.city),
      source: 'mock_fallback',
    });
  }
};

// ── getAQI ─────────────────────────────────────────────────────────────────────
export const getAQI = async (req, res, next) => {
  try {
    const { city } = req.params;

    if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'your_openweather_key') {
      console.log('⚠️  No OpenWeather API key — returning mock AQI data');
      return res.json({ success: true, city, ...getMockAQI(city), source: 'mock' });
    }

    // Step 1: Geocode the city
    const geoResponse = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: { q: city, limit: 1, appid: OPENWEATHER_KEY },
    });

    if (!geoResponse.data || geoResponse.data.length === 0) {
      return res.status(404).json({ success: false, message: `City "${city}" not found.` });
    }

    const { lat, lon } = geoResponse.data[0];

    // Step 2: Fetch AQI
    const aqiResponse = await axios.get(`${BASE_URL}/air_pollution`, {
      params: { lat, lon, appid: OPENWEATHER_KEY },
    });

    const aqiData = aqiResponse.data.list[0];
    const aqiIndex = aqiData.main.aqi;

    res.json({
      success: true,
      city,
      aqi: aqiIndex,
      level: getAQILevel(aqiIndex),
      components: aqiData.components,
      source: 'openweathermap',
    });
  } catch (error) {
    console.error('AQI error:', error.message);
    res.json({
      success: true,
      city: req.params.city,
      ...getMockAQI(req.params.city),
      source: 'mock_fallback',
    });
  }
};

// ── getAlerts ──────────────────────────────────────────────────────────────────
export const getAlerts = async (req, res, next) => {
  try {
    const { city } = req.params;
    const alerts = [];

    if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'your_openweather_key') {
      return res.json({ success: true, city, alerts: [], source: 'mock' });
    }

    // Fetch forecast and check for severe conditions
    const response = await axios.get(`${BASE_URL}/forecast`, {
      params: { q: city, appid: OPENWEATHER_KEY, units: 'metric', cnt: 40 },
    });

    response.data.list.forEach((item) => {
      const wind = item.wind?.speed || 0;
      const weatherId = item.weather?.[0]?.id || 0;

      // Wind > 50 km/h or extreme weather codes (2xx = thunderstorm, 5xx > 502 = heavy rain)
      if (wind > 13.9) {
        // 13.9 m/s ≈ 50 km/h
        alerts.push({
          type: 'High Wind',
          severity: 'Moderate',
          date: item.dt_txt,
          description: `Strong winds expected: ${Math.round(wind * 3.6)} km/h`,
        });
      }
      if (weatherId >= 200 && weatherId < 300) {
        alerts.push({
          type: 'Thunderstorm',
          severity: 'High',
          date: item.dt_txt,
          description: item.weather[0].description,
        });
      }
      if (weatherId >= 502 && weatherId < 600) {
        alerts.push({
          type: 'Heavy Rain',
          severity: 'Moderate',
          date: item.dt_txt,
          description: item.weather[0].description,
        });
      }
    });

    // Deduplicate alerts by type+date
    const uniqueAlerts = alerts.filter(
      (alert, idx, self) =>
        idx === self.findIndex((a) => a.type === alert.type && a.date === alert.date)
    );

    res.json({ success: true, city, alerts: uniqueAlerts, source: 'openweathermap' });
  } catch (error) {
    console.error('Weather alerts error:', error.message);
    res.json({ success: true, city: req.params.city, alerts: [], source: 'mock_fallback' });
  }
};
