import axios from 'axios';
import CityData from '../models/CityData.js';

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

// Deterministic pseudo-random generator (stable per city name) for mock data
const hashString = (str) => {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
};

const seededPick = (seed, array) => array[hashString(seed) % array.length];
const seededInt = (seed, min, max) => min + (hashString(seed) % (max - min + 1));

// Convert an INR amount to the traveler's selected currency for display
const inrToCurrency = (inr, currency, rate) => {
  if (!currency || currency === 'INR' || !rate) {
    return `₹${Math.round(inr).toLocaleString('en-IN')}`;
  }
  const symbolMap = {
    USD: '$', EUR: '€', GBP: '£', JPY: '¥', AED: 'AED ',
    AUD: 'A$', CAD: 'C$', CHF: 'CHF ', SGD: 'S$', THB: '฿',
    MYR: 'RM ', CNY: 'CN¥', HKD: 'HK$', KRW: '₩', TRY: '₺',
    ZAR: 'R ', NZD: 'NZ$',
  };
  const sym = symbolMap[currency] || `${currency} `;
  const val = inr * rate;
  const rounded = currency === 'JPY' || currency === 'KRW' ? Math.round(val) : Math.round(val * 10) / 10;
  const decimals = Number.isInteger(rounded) ? 0 : 1;
  return `${sym}${rounded.toLocaleString('en-US', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}`;
};

// Helper to query Groq
const callGroq = async (systemPrompt, userPrompt) => {
  if (!GROQ_API_KEY || GROQ_API_KEY === 'your_groq_key') {
    throw new Error('No Groq API Key found.');
  }

  const response = await axios.post(
    GROQ_URL,
    {
      model: GROQ_MODEL,
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
      temperature: 0.7,
      response_format: { type: 'json_object' },
    },
    {
      headers: {
        Authorization: `Bearer ${GROQ_API_KEY}`,
        'Content-Type': 'application/json',
      },
    }
  );

  return JSON.parse(response.data.choices[0].message.content);
};

// â”€â”€ Smart Mock Itinerary Generator â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const generateMockItinerary = (cityData, days, interests = []) => {
  const attractions = cityData?.attractions || [];
  const cuisines = cityData?.cuisine || ['Local Street Food', 'Fine Dining'];
  const cityName = cityData?.cityName || 'your destination';
  const country = cityData?.country || '';
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = monthNames[new Date().getMonth()];
  const bestMonth = cityData?.bestMonths?.find((m) => m.month === currentMonth);
  const seasonHint = bestMonth
    ? `It is currently ${currentMonth} in ${cityName} — expect ${bestMonth.tempRange} with a ${bestMonth.crowdLevel} crowd level.`
    : `Visiting ${cityName}${country ? ', ' + country : ''} right now.`;

  const interestTypes = {
    Heritage: 'heritage sites',
    Nature: 'nature trails and scenic spots',
    Food: 'local food haunts',
    Nightlife: 'evening hangout spots',
    Adventure: 'adventure activities',
    Shopping: 'local markets',
    Relaxation: 'quiet, relaxing corners',
  };
  const focus = interests.length > 0 ? interests.slice(0, 2).map((i) => interestTypes[i] || i.toLowerCase()).join(' and ') : 'the top sights';

  const activityTemplates = [
    (a, idx) => ({
      morning: `Start Day ${idx + 1} bright and early at ${a[0].name} (${a[0].type || 'attraction'}). ${a[0].description || 'A must-see highlight in ' + cityName + '.'} Arrive before opening to beat the crowds.`,
      afternoon: `After lunch, head to ${a[1].name || 'the central district'}. ${a[1].description || `Spend a relaxed afternoon exploring ${cityName} at your own pace.`}`,
      evening: `Wind down with an evening stroll around ${a[2]?.name || 'the old town'}, then enjoy dinner at a spot famous for ${cuisines[(idx + 1) % cuisines.length]}.`,
    }),
    (a, idx) => ({
      morning: `Kick off with ${a[0].name || 'a classic city walk'}. ${a[0].description || `One of the best ways to start your day in ${cityName}.`}`,
      afternoon: `Dive into local culture at ${a[1].name || 'a neighborhood bazaar'}. Try the street snacks — ${cuisines[idx % cuisines.length]} is a crowd favorite here.`,
      evening: `Catch sunset at ${a[2]?.name || 'a popular viewpoint'} before heading to a well-reviewed local restaurant for dinner.`,
    }),
    (a, idx) => ({
      morning: `Begin at ${a[0].name || 'the historic center'}, taking time to photograph the details. ${a[0].description || 'Rich in history and character.'}`,
      afternoon: `Explore ${a[1].name || 'the riverside/market area'} and pick up some souvenirs. Keep an eye out for handcrafted local goods.`,
      evening: `Enjoy a laid-back evening tasting ${cuisines[idx % cuisines.length]} with a local twist, followed by a leisurely night walk.`,
    }),
  ];

  return Array.from({ length: Math.min(days, 10) }, (_, idx) => {
    const dayNum = idx + 1;
    const template = activityTemplates[idx % activityTemplates.length];
    const a = [];
    for (let j = 0; j < 3; j++) {
      if (attractions.length > 0) {
        a.push(attractions[(idx * 3 + j) % attractions.length]);
      } else {
        a.push({
          name: ['the local market', 'a scenic viewpoint', 'the old quarter'][j],
          description: '',
        });
      }
    }

    const plan = template(a, idx);
    return {
      day: dayNum,
      morning: plan.morning,
      afternoon: plan.afternoon,
      evening: plan.evening,
      meals: [
        `Breakfast: Try a local cafe serving ${cuisines[(idx) % cuisines.length]}.`,
        `Lunch: ${seededPick(`${cityName}-lunch-${idx}`, ['A cozy family-run eatery', 'A bustling food market stall', 'A riverside bistro', 'A hidden gem popular with locals'])} — order the house special.`,
        `Dinner: ${seededPick(`${cityName}-dinner-${idx}`, ['Rooftop dining with a view', 'A traditional restaurant with live local music', 'Street-food walk for the best night snacks'])}.`,
      ],
      tips: seededPick(`${cityName}-tip-${idx}`, [
        `Wear comfortable walking shoes and carry a refillable water bottle. ${seasonHint}`,
        `Start early (around 9 AM) to avoid peak crowds. Keep small cash for local vendors.`,
        `Book popular spots a day in advance during the ${bestMonth?.crowdLevel?.toLowerCase() || 'busy'} season.`,
        `Ask locals for recommendations — they know the best hidden gems around ${cityName}.`,
      ]),
      focus,
    };
  });
};

// â”€â”€ Generate Itinerary â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const generateItinerary = async (req, res, next) => {
  try {
    const { destination, days = 3, interests = [], travelers = 1, weatherSummary } = req.body;

    if (!destination) {
      return res.status(400).json({ success: false, message: 'destination is required.' });
    }

    const cityData = await CityData.findOne({
      cityName: { $regex: new RegExp(`^${destination}$`, 'i') },
    });

    // Check if we should use Groq
    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_key') {
      try {
        const attractionsText = cityData?.attractions?.map((a) => `${a.name} (${a.type})`).join(', ') || '';
        const systemPrompt = `You are Voyago AI, a premium travel itinerary planner. Generate a structured day-by-day travel plan. You MUST respond with a JSON object containing an "itinerary" array. 
Each day in the array must be an object matching this JSON structure:
{
  "day": number,
  "morning": "string description",
  "afternoon": "string description",
  "evening": "string description",
  "meals": ["breakfast info", "lunch info", "dinner info"],
  "tips": "helpful tips for the day"
}`;
        const userPrompt = `Create a ${days}-day itinerary for ${destination} for ${travelers} traveler(s) interested in: ${interests.join(', ')}.
Weather: ${weatherSummary || 'Moderate climates'}.
Available tourist spots to consider: ${attractionsText}.
Respond ONLY in the JSON format requested.`;

        const data = await callGroq(systemPrompt, userPrompt);
        if (data.itinerary) {
          return res.json({ success: true, itinerary: data.itinerary, source: 'groq' });
        }
      } catch (error) {
        console.error('Groq itinerary generation failed, using mock data:', error.message);
      }
    }

    // Fallback to Mock
    const itinerary = generateMockItinerary(cityData, Number(days), interests);
    res.json({
      success: true,
      itinerary,
      source: 'mock',
    });
  } catch (error) {
    next(error);
  }
};

// â”€â”€ Generate Packing List â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const generatePackingList = async (req, res, next) => {
  try {
    const { destination, days = 5, interests = [], weatherSummary, startDate } = req.body;

    const cityData = destination
      ? await CityData.findOne({ cityName: { $regex: new RegExp(`^${destination}$`, 'i') } })
      : null;

    const monthName = startDate
      ? new Date(startDate).toLocaleString('en-US', { month: 'long' })
      : new Date().toLocaleString('en-US', { month: 'long' });
    const bestMonths = cityData?.bestMonths || [];
    const monthInfo = bestMonths.find((m) => m.month === monthName);
    const seasonTag = monthInfo?.tempRange ? 'seasonal' : null;

    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_key') {
      try {
        const systemPrompt = `You are a travel assistant. Generate a customized packing list as a JSON object with categories: "clothing", "documents", "health", "tech", "misc". Each category should be an array of strings. Tailor the list to the destination's climate, culture, the travel month, and the traveler's interests.`;
        const userPrompt = `Pack list for ${days} days in ${destination || 'destination'}, traveling in ${monthName}. Interests: ${interests.join(', ')}. Weather context: ${weatherSummary || 'seasonal conditions'}. Known temperature range for ${monthName}: ${monthInfo?.tempRange || 'varies'}. Local cuisine to try: ${cityData?.cuisine?.join(', ') || 'local dishes'}.`;

        const data = await callGroq(systemPrompt, userPrompt);
        return res.json({ success: true, packingList: data, source: 'groq' });
      } catch (error) {
        console.error('Groq packing list failed, using mock:', error.message);
      }
    }

    // Fallback Mock Packing List (dest/season aware)
    const coldSeason = /winter|cold|cool|snow/.test(weatherSummary || `${monthInfo?.tempRange || ''}`) || /Dec|Jan|Feb/.test(monthName);

    const clothing = [
      coldSeason
        ? 'Warm layers: thermal/fleece top, insulated jacket'
        : 'Lightweight, breathable clothes',
      'Comfortable walking/hiking shoes',
      '1 semi-formal outfit for dinners/evenings',
      coldSeason
        ? 'Woollen cap, scarf, and gloves'
        : 'Rain jacket or small travel umbrella',
      cityData?.tags?.includes('beach') || /beach|coastal/.test(destination || '')
        ? 'Swimwear & quick-dry towel'
        : 'Sunscreen (SPF 30+)',
    ];

    const misc = [
      'Sunglasses & sun hat',
      'Refillable water bottle',
      'Compact backpack for sightseeing day trips',
      cityData?.tags?.includes('trekking') || /trek|mountain|hill/.test(destination || '')
        ? 'Basic trekking gear / grip shoes'
        : 'Light umbrella or hat',
    ];

    const documents = [
      'Physical printout of tickets & accommodation details',
      'Government-issued photo ID cards',
      cityData?.currency !== 'INR' ? `Foreign currency (${cityData?.currency || 'local'}) & small USD for emergencies` : 'Emergency cash (INR)',
      'Travel insurance copy',
    ];

    const packingList = {
      clothing,
      documents,
      health: [
        'First-aid basics (Painkillers, bandages, antiseptic)',
        'Personal daily medications',
        'Hand sanitizer & wet wipes',
        cityData?.tags?.includes('beach') ? 'After-sun lotion / aloe gel' : 'Sunscreen (SPF 30+)',
      ],
      tech: [
        'Smartphones + chargers',
        'Power bank (10000mAh+)',
        cityData?.country !== 'India' && cityData?.currency ? 'Universal wall plug adapter' : '',
        'Wired/Wireless earphones',
      ].filter(Boolean),
      misc,
    };

    res.json({
      success: true,
      packingList,
      source: 'mock',
      season: seasonTag || null,
      travelMonth: monthName,
      note: cityData?.bestMonths
        ? `Packed for ${monthName} in ${destination}. Best months to visit: ${cityData.bestMonths.map((m) => m.month).slice(0, 3).join(', ')}.`
        : `Packed for ${monthName}.`,
    });
  } catch (error) {
    next(error);
  }
};

// â”€â”€ RAG-Grounded Chatbot â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const chatbot = async (req, res, next) => {
  try {
    const { message, cityName, history = [], currency, currencyRate } = req.body;

    if (!message) {
      return res.status(400).json({ success: false, message: 'message is required.' });
    }

    let cityContext = '';
    let cityData = null;
    const cityName2 = cityData?.cityName || cityName || 'your destination';

    if (cityName) {
      cityData = await CityData.findOne({
        cityName: { $regex: new RegExp(`^${cityName}$`, 'i') },
      });
      if (cityData) {
        cityContext = `
Destination: ${cityData.cityName}, ${cityData.country}
General Safety Score: ${cityData.safetyScore}/10. Solo traveler safety: ${cityData.soloTravelerSafety}/10. Women safety: ${cityData.womenSafety}/10.
Emergency Contacts: Police (${cityData.emergencyContacts?.police || '100'}), Ambulance (${cityData.emergencyContacts?.ambulance || '102'}).
Average Costs: Hotel Budget per night: ₹${cityData.avgHotelCost?.budget || 1000}, Hotel Mid: ₹${cityData.avgHotelCost?.mid || 2500}, Hotel Luxury: ₹${cityData.avgHotelCost?.luxury || 6000}.
Local Food Cost Per Day: Street food: ₹${cityData.avgFoodCostPerDay?.streetFood || 300}, Restaurant: ₹${cityData.avgFoodCostPerDay?.restaurant || 700}.
Local transport options: ${cityData.localTransportOptions?.join(', ') || 'cab apps'}.
Famous spots: ${cityData.attractions?.map((a) => a.name).join(', ') || 'Various tourist attractions'}.
Famous dishes: ${cityData.cuisine?.join(', ') || 'Local dishes'}.
`;
      }
    }

    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_key') {
      try {
        const systemPrompt = `You are Voyago AI, a helpful, conversational travel planning assistant. 
The traveler is asking about: ${cityName2}. 
Use the following curated city information to ground your answers when it is relevant. If the information is not in the context, use your general knowledge about ${cityName2}.
Curated Context:
${cityContext || 'No specific curated context was provided for this city.'}
Guidelines:
- Keep answers concise, clear, and engaging.
- Never hallucinate false information about safety or emergency contacts.
- Speak directly to the traveler.
- Tailor answers specifically to ${cityName2} whenever possible.
- Currency: The traveler has selected ${currency || 'INR'} as their display currency. All prices in the context are in INR (₹). Whenever you quote a price, show it converted to ${currency || 'INR'} using the rate 1 INR = ${currencyRate || 1} ${currency || 'INR'}, and round to a sensible value. Never display raw INR figures when another currency is selected.`;

        // Format history for Groq API
        const response = await axios.post(
          GROQ_URL,
          {
            model: GROQ_MODEL,
            messages: [
              { role: 'system', content: systemPrompt },
              ...history.slice(-6).map((h) => ({
                role: h.role === 'user' ? 'user' : 'assistant',
                content: h.content,
              })),
              { role: 'user', content: message },
            ],
            temperature: 0.7,
          },
          {
            headers: {
              Authorization: `Bearer ${GROQ_API_KEY}`,
              'Content-Type': 'application/json',
            },
          }
        );

        return res.json({
          success: true,
          reply: response.data.choices[0].message.content,
          source: 'groq_rag',
        });
      } catch (error) {
        console.error('Groq chat failed, using mock RAG response:', error.message);
      }
    }

    // Smart Mock Chat responses using cityData keywords
    let reply = '';
    const lowerMsg = message.toLowerCase();

    const replyPool = (topic, options) => {
      // Rotate through generic-but-topical replies so every question gets a distinct answer
      const idx = hashString(message + topic + cityName2) % options.length;
      return options[idx];
    };

    if (!cityData) {
      // No curated city data — still give a useful, varied answer from general knowledge
      if (lowerMsg.includes('safe') || lowerMsg.includes('security') || lowerMsg.includes('crime')) {
        reply = `For ${cityName2}, general travel advice: check your government's travel advisory, avoid poorly lit areas after dark, and keep valuables out of sight. In an emergency dial 112 where available. Would you like me to look up specific safety details for another city we support?`;
      } else if (lowerMsg.includes('weather') || lowerMsg.includes('rain') || lowerMsg.includes('forecast')) {
        reply = `I can fetch live weather for ${cityName2} from the Weather Forecast section of this page. Meanwhile, a good rule is to check conditions a week ahead and pack layers. Is there anything else about ${cityName2} you'd like to know?`;
      } else if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('restaurant')) {
        reply = `For authentic eating in ${cityName2}, look for busy local spots away from main tourist squares — that's usually where the best, most affordable food is. Tell me what type of cuisine you enjoy and I can tailor suggestions!`;
      } else if (lowerMsg.includes('cost') || lowerMsg.includes('budget') || lowerMsg.includes('money') || lowerMsg.includes('price')) {
        reply = `Budget for ${cityName2} depends heavily on season and accommodation. As a rough guide, plan for accommodation + food + local transport + a buffer for entry fees and shopping. Want me to run a cost estimate for a specific city in our database?`;
      } else if (lowerMsg.includes('best time') || lowerMsg.includes('when to visit') || lowerMsg.includes('season')) {
        reply = `The best time to visit ${cityName2} usually avoids both peak tourist season and the rainy/extremely hot months. For a precise recommendation, try the Explore page for a city we have data on. Anything else?`;
      } else {
        reply = replyPool('general', [
          `Great question about ${cityName2}! Could you narrow it down — are you asking about safety, costs, food, weather, or what to see?`,
          `For ${cityName2}, the top experiences usually mix history, food, and local neighborhoods. Would you like tips on any of those?`,
          `Happy to help plan ${cityName2}! Tell me a bit more — how many days, your interests, and I'll give more specific advice.`,
        ]);
      }
    } else {
      if (lowerMsg.includes('safety') || lowerMsg.includes('safe') || lowerMsg.includes('women') || lowerMsg.includes('solo')) {
        reply = `Safety in ${cityData.cityName} is rated ${cityData.safetyScore}/10 overall. Solo traveler safety is ${cityData.soloTravelerSafety}/10, and women's safety score is ${cityData.womenSafety}/10. It is ${cityData.safetyScore >= 7 ? 'generally very safe' : 'decently safe, but always keep an eye out and avoid isolated areas late at night'}. Emergency contacts: Police is ${cityData.emergencyContacts?.police || '100'}, Ambulance is ${cityData.emergencyContacts?.ambulance || '102'}.`;
      } else if (lowerMsg.includes('cost') || lowerMsg.includes('budget') || lowerMsg.includes('expensive') || lowerMsg.includes('price')) {
        reply = `In ${cityData.cityName}, the average budget hotel is around ${inrToCurrency(cityData.avgHotelCost.budget, currency, currencyRate)}/night while mid-range hotels cost ${inrToCurrency(cityData.avgHotelCost.mid, currency, currencyRate)}/night. Street food is super affordable at approx ${inrToCurrency(cityData.avgFoodCostPerDay.streetFood, currency, currencyRate)}/day per person, while sitting down at restaurants runs around ${inrToCurrency(cityData.avgFoodCostPerDay.restaurant, currency, currencyRate)}/day. Local transport costs roughly ${inrToCurrency(cityData.localTransportCostPerDay, currency, currencyRate)}/day.`;
      } else if (lowerMsg.includes('food') || lowerMsg.includes('eat') || lowerMsg.includes('cuisine') || lowerMsg.includes('dish')) {
        reply = `When visiting ${cityData.cityName}, you must try local favorites like: ${cityData.cuisine.join(', ')}. Street food is highly recommended here! ${cityData.bestMonths?.[0] ? `If you can, plan around ${cityData.bestMonths[0].month} when ${cityData.bestMonths[0].reason.toLowerCase()}.` : ''}`;
      } else if (lowerMsg.includes('places') || lowerMsg.includes('spot') || lowerMsg.includes('attractions') || lowerMsg.includes('see') || lowerMsg.includes('do')) {
        reply = `Top spots to visit in ${cityData.cityName} include: ${cityData.attractions.slice(0, 4).map((a) => a.name).join(', ')}. ${cityData.attractions[0]?.description || ''} Let me know if you want details on any of these!`;
      } else if (lowerMsg.includes('weather') || lowerMsg.includes('forecast') || lowerMsg.includes('climate')) {
        reply = `${cityData.bestMonths?.length ? `The best months to visit ${cityData.cityName} are ${cityData.bestMonths.map((m) => m.month).slice(0, 3).join(', ')}, with temperatures around ${cityData.bestMonths[0].tempRange}.` : 'Weather varies by season.'} Check the Weather Forecast section on this page for the live 7-day outlook.`;
      } else if (lowerMsg.includes('best time') || lowerMsg.includes('when to visit') || lowerMsg.includes('season')) {
        reply = `The best time to visit ${cityData.cityName} is ${cityData.bestMonths?.filter((m) => m.crowdLevel !== 'High' && m.priceLevel !== 'High').map((m) => m.month).slice(0, 2).join(' or ') || cityData.bestMonths?.[0]?.month || 'your preferred season'}. ${cityData.bestMonths?.[0]?.reason || ''}`;
      } else if (lowerMsg.includes('transport') || lowerMsg.includes('get around') || lowerMsg.includes('travel')) {
        reply = `Getting around ${cityData.cityName} is easy with ${cityData.localTransportOptions.join(', ')}. Expect to spend roughly ${inrToCurrency(cityData.localTransportCostPerDay, currency, currencyRate)}/day. Public transport is usually the cheapest option.`;
      } else {
        reply = replyPool('general', [
          `Interesting! In ${cityData.cityName}, a good first stop is ${cityData.attractions[0]?.name || 'the city center'}. Want specifics on safety, food, costs, or best time to visit?`,
          `Great question about ${cityData.cityName}! I can help with safety, budget, food, top spots, or the best season. Which would you like?`,
          `For ${cityData.cityName}, travelers usually love ${cityData.cuisine.slice(0, 2).join(' and ')} and visiting ${cityData.attractions.slice(0, 2).map((a) => a.name).join(' and ')}. Tell me what matters most to you!`,
        ]);
      }
    }

    res.json({
      success: true,
      reply,
      source: 'mock_rag',
    });
  } catch (error) {
    next(error);
  }
};

// â”€â”€ Regenerate Day â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export const regenerateDay = async (req, res, next) => {
  try {
    const { destination, dayNumber = 1, currentPlan = {}, preference } = req.body;

    const cityData = await CityData.findOne({
      cityName: { $regex: new RegExp(`^${destination}$`, 'i') },
    });

    if (GROQ_API_KEY && GROQ_API_KEY !== 'your_groq_key') {
      try {
        const attractionsText = cityData?.attractions?.map((a) => a.name).join(', ') || '';
        const systemPrompt = `You are a travel assistant. You MUST respond with a JSON object representing a single day itinerary matching this structure:
{
  "day": number,
  "morning": "alternative activity morning",
  "afternoon": "alternative activity afternoon",
  "evening": "alternative activity evening",
  "meals": ["breakfast", "lunch", "dinner"],
  "tips": "tips"
}`;
        const userPrompt = `For ${destination}, regenerate Day ${dayNumber}. Current plan was: Morning: ${currentPlan.morning}, Afternoon: ${currentPlan.afternoon}. Preference change: Make it focus more on ${preference || 'relaxation/adventure'}. Spots available in city: ${attractionsText}.`;

        const data = await callGroq(systemPrompt, userPrompt);
        return res.json({ success: true, dayPlan: data, source: 'groq' });
      } catch (error) {
        console.error('Groq day regeneration failed, using mock:', error.message);
      }
    }

    // Fallback mock day plan
    const altSpot = cityData?.attractions?.[(Number(dayNumber) + 3) % (cityData.attractions.length || 1)]?.name || 'Local Gardens';
    const altSpot2 = cityData?.attractions?.[(Number(dayNumber) + 4) % (cityData.attractions.length || 1)]?.name || 'Art Gallery';

    const dayPlan = {
      day: Number(dayNumber),
      morning: `[Alternative] Take a relaxing stroll around ${altSpot} and experience the peaceful atmosphere.`,
      afternoon: `[Alternative] Visit ${altSpot2} to explore local arts, history, and craft exhibits.`,
      evening: `Spend the evening shopping for local souvenirs at the downtown handicrafts market.`,
      meals: [
        'Breakfast: Healthy local organic cafe.',
        'Lunch: Cozy traditional diner.',
        'Dinner: Rooftop restaurant overlooking the city.',
      ],
      tips: `This plan is more laid back. Start at 10 AM to avoid the morning rush.`,
    };

    res.json({ success: true, dayPlan, source: 'mock' });
  } catch (error) {
    next(error);
  }
};
