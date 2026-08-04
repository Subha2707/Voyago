import axios from 'axios';
import CityData from '../models/CityData.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';
const OPENWEATHER_KEY = process.env.OPENWEATHER_API_KEY;

// In-flight build promises so concurrent requests for the same city reuse one build
const building = new Map();

const geocodeCity = async (cityName) => {
  try {
    if (!OPENWEATHER_KEY || OPENWEATHER_KEY === 'your_openweather_key') return null;
    const { data } = await axios.get('http://api.openweathermap.org/geo/1.0/direct', {
      params: { q: cityName, limit: 1, appid: OPENWEATHER_KEY },
      timeout: 8000,
    });
    if (data && data.length > 0) {
      return {
        lat: data[0].lat,
        lng: data[0].lon,
        countryCode: data[0].country || null,
      };
    }
    return null;
  } catch (err) {
    return null;
  }
};

const normalize = (obj, def = {}) => {
  if (!obj || typeof obj !== 'object') return def;
  return obj;
};

/**
 * Build a full CityData profile for any city using Groq + OpenWeather geocoding.
 * Called only when the city is not already seeded. Returns a CityData document.
 */
const buildCityData = async (cityName) => {
  const geo = await geocodeCity(cityName);

  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_key') {
    throw new Error('No Groq key available to build city data.');
  }

  const systemPrompt = `You are a travel research engine. You will receive a city name and must return a SINGLE JSON object with accurate, well-researched travel data for that city. Respond with strict JSON only — no markdown, no commentary.

JSON shape (all currency in INR, costs per person):
{
  "country": "string",
  "region": "string (e.g. Europe, South Asia)",
  "avgHotelCost": { "budget": number/night, "mid": number/night, "luxury": number/night },
  "avgFoodCostPerDay": { "streetFood": number, "restaurant": number },
  "localTransportCostPerDay": number,
  "attractions": [ { "name": "string", "type": "string (Heritage|Nature|Beach|Museum|Food|Adventure|Shopping|Religion|Scenic|City)", "description": "one sentence", "entryFeeINR": number } ] (3-4 items, real famous spots),
  "cuisine": [ "3-5 famous local dishes" ],
  "localTransportOptions": [ "3-4 real options" ],
  "bestMonths": [ { "month": "full month name", "reason": "short reason", "crowdLevel": "Low|Medium|High", "priceLevel": "Low|Medium|High", "tempRange": "e.g. 15°C - 28°C" } ] (3 months, real climate data),
  "safetyScore": number 1-10,
  "soloTravelerSafety": number 1-10,
  "womenSafety": number 1-10,
  "emergencyContacts": { "police": "string", "ambulance": "string", "touristHelpline": "string", "embassy": "string or N/A" },
  "currency": "ISO code e.g. INR, THB",
  "tags": [ "3-5 tags like beach, city, adventure" ]
}`;

  const response = await axios.post(
    GROQ_URL,
    {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Provide researched travel data for the city: ${cityName}` },
      ],
      temperature: 0.6,
      response_format: { type: 'json_object' },
    },
    {
      headers: { Authorization: `Bearer ${GROQ_API_KEY}`, 'Content-Type': 'application/json' },
      timeout: 60000,
    }
  );

  let data;
  try {
    data = JSON.parse(response.data.choices[0].message.content);
  } catch (e) {
    throw new Error('Could not parse city data response.');
  }

  const costs = normalize(data.avgHotelCost);
  const food = normalize(data.avgFoodCostPerDay);
  const contacts = normalize(data.emergencyContacts);

  const doc = {
    cityName,
    country: data.country || 'Unknown',
    region: data.region || '',
    coordinates: geo ? { lat: geo.lat, lng: geo.lng } : undefined,
    countryCode: data.countryCode || geo?.countryCode || '',
    avgHotelCost: {
      budget: Math.max(500, Number(costs.budget) || 2500),
      mid: Math.max(800, Number(costs.mid) || 5000),
      luxury: Math.max(2000, Number(costs.luxury) || 12000),
    },
    avgFoodCostPerDay: {
      streetFood: Math.max(150, Number(food.streetFood) || 400),
      restaurant: Math.max(300, Number(food.restaurant) || 1000),
    },
    localTransportCostPerDay: Math.max(150, Number(data.localTransportCostPerDay) || 500),
    attractions: Array.isArray(data.attractions) ? data.attractions.slice(0, 4) : [],
    cuisine: Array.isArray(data.cuisine) ? data.cuisine.slice(0, 5) : [],
    localTransportOptions: Array.isArray(data.localTransportOptions) ? data.localTransportOptions.slice(0, 4) : [],
    bestMonths: Array.isArray(data.bestMonths) ? data.bestMonths.slice(0, 3) : [],
    safetyScore: Math.min(10, Math.max(1, Number(data.safetyScore) || 7)),
    soloTravelerSafety: Math.min(10, Math.max(1, Number(data.soloTravelerSafety) || 7)),
    womenSafety: Math.min(10, Math.max(1, Number(data.womenSafety) || 7)),
    emergencyContacts: {
      police: contacts.police || '112',
      ambulance: contacts.ambulance || '112',
      touristHelpline: contacts.touristHelpline || 'N/A',
      embassy: contacts.embassy || 'N/A',
    },
    currency: data.currency || (data.countryCode || geo?.countryCode || 'INR'),
    tags: Array.isArray(data.tags) ? data.tags.slice(0, 5) : [],
  };

  return CityData.create(doc);
};

/**
 * Get CityData for a city, building + caching it on the fly if it isn't seeded.
 * Returns the document, or null if the city could not be resolved.
 */
export const getOrBuildCityData = async (cityName) => {
  if (!cityName) return null;
  const name = String(cityName).trim();
  const key = name.toLowerCase();

  const existing = await CityData.findOne({ cityName: { $regex: new RegExp(`^${name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') } });
  if (existing) return existing;

  if (building.has(key)) return building.get(key);

  const promise = (async () => {
    try {
      const built = await buildCityData(name);
      return built;
    } catch (err) {
      console.error(`⚠️  Could not auto-build city data for "${name}":`, err.message);
      return null;
    } finally {
      building.delete(key);
    }
  })();

  building.set(key, promise);
  return promise;
};
