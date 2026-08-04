/**
20 Seed Cities data for Voyago.
Contains 12 Indian destinations and 8 International destinations.
Currency costs are in INR.
*/

export const citiesData = [
  // â”€â”€ INDIAN DESTINATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    cityName: 'Goa',
    country: 'India',
    region: 'West India',
    coordinates: { lat: 15.2993, lng: 74.124 },
    avgHotelCost: { budget: 1500, mid: 3500, luxury: 8000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 800 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Calangute Beach', type: 'Beach', description: 'One of the busiest and most popular beaches in North Goa.', entryFeeINR: 0, coords: { lat: 15.544, lng: 73.755 } },
      { name: 'Basilica of Bom Jesus', type: 'Heritage', description: 'UNESCO World Heritage site holding mortal remains of St. Francis Xavier.', entryFeeINR: 0, coords: { lat: 15.5009, lng: 73.9116 } },
      { name: 'Dudhsagar Falls', type: 'Nature', description: 'A majestic four-tiered waterfall on the Mandovi River.', entryFeeINR: 400, coords: { lat: 15.3179, lng: 74.3142 } },
      { name: 'Anjuna Flea Market', type: 'Shopping', description: 'Vibrant weekly flea market with local crafts and boho wear.', entryFeeINR: 0, coords: { lat: 15.58, lng: 73.74 } },
      { name: 'Fort Aguada', type: 'History', description: 'A well-preserved 17th-century Portuguese fort and lighthouse.', entryFeeINR: 25, coords: { lat: 15.4925, lng: 73.7739 } }
    ],
    cuisine: ['Fish Curry Rice', 'Pork Vindaloo', 'Feni', 'Bebinca', 'Prawn Balchao'],
    localTransportOptions: ['Rented Scooter', 'Prepaid Taxi', 'Local Bus', 'Auto Rickshaw'],
    bestMonths: [
      { month: 'November', reason: 'Pleasant weather, onset of tourist festival season.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '22°C - 32°C' },
      { month: 'December', reason: 'High energy, Christmas & New Year celebrations. High prices.', crowdLevel: 'High', priceLevel: 'High', tempRange: '21°C - 32°C' },
      { month: 'January', reason: 'Perfect cool weather, water sports active.', crowdLevel: 'High', priceLevel: 'High', tempRange: '20°C - 31°C' },
      { month: 'February', reason: 'Slightly less crowded, great sunsets.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '21°C - 32°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8,
    womenSafety: 7,
    emergencyContacts: { police: '112', ambulance: '108', touristHelpline: '1363', embassy: 'N/A' },
    nearestHospitals: [{ name: 'Manipal Hospital Goa', phone: '0832-3048800' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['beach', 'nightlife', 'party', 'heritage']
  },
  {
    cityName: 'Manali',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 32.2396, lng: 77.1887 },
    avgHotelCost: { budget: 1200, mid: 2500, luxury: 6000 },
    avgFoodCostPerDay: { streetFood: 250, restaurant: 600 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Solang Valley', type: 'Adventure', description: 'Famous for paragliding, skiing, and quad biking.', entryFeeINR: 0, coords: { lat: 32.316, lng: 77.159 } },
      { name: 'Hadimba Temple', type: 'Heritage', description: 'Ancient wooden pagoda-style temple surrounded by pine forests.', entryFeeINR: 0, coords: { lat: 32.2476, lng: 77.1784 } },
      { name: 'Rohtang Pass', type: 'Nature', description: 'High mountain pass offering spectacular snow views (requires permit).', entryFeeINR: 550, coords: { lat: 32.3716, lng: 77.2452 } },
      { name: 'Jogini Waterfall', type: 'Nature', description: 'Scenic waterfall reached via a short trek through pine woods.', entryFeeINR: 0, coords: { lat: 32.2694, lng: 77.1947 } }
    ],
    cuisine: ['Siddu', 'Trout Fish', 'Thukpa', 'Mittha', 'Chha Gosht'],
    localTransportOptions: ['Rented Bike', 'Local Taxi Union', 'Auto Rickshaw'],
    bestMonths: [
      { month: 'April', reason: 'Beautiful spring blossom and clear skies.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '10°C - 25°C' },
      { month: 'May', reason: 'Peak summer escape, pleasant climate.', crowdLevel: 'High', priceLevel: 'High', tempRange: '15°C - 28°C' },
      { month: 'June', reason: 'Busy season, good for adventure activities.', crowdLevel: 'High', priceLevel: 'High', tempRange: '15°C - 30°C' },
      { month: 'December', reason: 'Snowfall starts, popular for winter honeymooners.', crowdLevel: 'High', priceLevel: 'High', tempRange: '-2°C - 10°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102', touristHelpline: '1363' },
    nearestHospitals: [{ name: 'Mission Hospital Manali', phone: '01902-252379' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['mountain', 'snow', 'adventure', 'trekking']
  },
  {
    cityName: 'Jaipur',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 26.9124, lng: 75.7873 },
    avgHotelCost: { budget: 1000, mid: 2200, luxury: 7000 },
    avgFoodCostPerDay: { streetFood: 200, restaurant: 500 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Amer Fort', type: 'Heritage', description: 'Majestic hilltop fort with artistic Hindu style elements.', entryFeeINR: 100, coords: { lat: 26.9855, lng: 75.8513 } },
      { name: 'Hawa Mahal', type: 'History', description: 'Iconic pink sandstone palace with 953 small windows (jharokhas).', entryFeeINR: 50, coords: { lat: 26.9239, lng: 75.8267 } },
      { name: 'City Palace', type: 'History', description: 'Royal residence showcasing a blend of Rajasthani and Mughal styles.', entryFeeINR: 200, coords: { lat: 26.9258, lng: 75.8237 } },
      { name: 'Jantar Mantar', type: 'Science', description: 'UNESCO astronomical observatory built in the 18th century.', entryFeeINR: 50, coords: { lat: 26.9248, lng: 75.8245 } }
    ],
    cuisine: ['Dal Baati Churma', 'Laal Maas', 'Gatte ki Sabzi', 'Pyaz Kachori', 'Ghevar'],
    localTransportOptions: ['E-Rickshaw', 'Metro', 'App Cabs (Uber/Ola)', 'Auto Rickshaw'],
    bestMonths: [
      { month: 'October', reason: 'Post-monsoon transition, pleasant evenings.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 33°C' },
      { month: 'November', reason: 'Excellent cool weather, ideal sightseeing.', crowdLevel: 'High', priceLevel: 'Medium', tempRange: '13°C - 29°C' },
      { month: 'December', reason: 'Cool winters, cultural festivals active.', crowdLevel: 'High', priceLevel: 'High', tempRange: '8°C - 23°C' },
      { month: 'January', reason: 'Kite festival, very pleasant winter weather.', crowdLevel: 'High', priceLevel: 'High', tempRange: '8°C - 22°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8,
    womenSafety: 7,
    emergencyContacts: { police: '100', ambulance: '102', touristHelpline: '0141-2822822' },
    nearestHospitals: [{ name: 'Fortis Escorts Jaipur', phone: '0141-2547000' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['heritage', 'history', 'shopping', 'culture']
  },
  {
    cityName: 'Munnar',
    country: 'India',
    region: 'South India',
    coordinates: { lat: 10.0889, lng: 77.0595 },
    avgHotelCost: { budget: 1500, mid: 3000, luxury: 6500 },
    avgFoodCostPerDay: { streetFood: 200, restaurant: 500 },
    localTransportCostPerDay: 700,
    attractions: [
      { name: 'Eravikulam National Park', type: 'Nature', description: 'Habitat of the endangered Nilgiri Tahr mountain goat.', entryFeeINR: 200, coords: { lat: 10.15, lng: 77.08 } },
      { name: 'Mattupetty Dam', type: 'Nature', description: 'Scenic dam site popular for boating and mist-laden views.', entryFeeINR: 50, coords: { lat: 10.1064, lng: 77.1245 } },
      { name: 'Tea Museum', type: 'Heritage', description: 'Displays the genesis and growth of tea plantations in Munnar.', entryFeeINR: 125, coords: { lat: 10.0931, lng: 77.0601 } }
    ],
    cuisine: ['Kerala Sadya', 'Appam with Stew', 'Banana Fritters', 'Idiyappam', 'Karimeen Pollichathu'],
    localTransportOptions: ['Auto Rickshaw', 'Local Taxi', 'Jeep Safari'],
    bestMonths: [
      { month: 'September', reason: 'Fresh lush green landscapes right after monsoons.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 24°C' },
      { month: 'October', reason: 'Mild climate, light mist.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '17°C - 23°C' },
      { month: 'December', reason: 'Coolest month, highly romantic.', crowdLevel: 'High', priceLevel: 'High', tempRange: '12°C - 20°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'Tata General Hospital Munnar', phone: '04865-230263' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['hillstation', 'nature', 'tea', 'romance']
  },
  {
    cityName: 'Mumbai',
    country: 'India',
    region: 'West India',
    coordinates: { lat: 19.076, lng: 72.8777 },
    avgHotelCost: { budget: 1800, mid: 4000, luxury: 12000 },
    avgFoodCostPerDay: { streetFood: 250, restaurant: 800 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Gateway of India', type: 'History', description: 'Iconic 20th-century arch overlooking the Arabian Sea.', entryFeeINR: 0, coords: { lat: 18.922, lng: 72.8347 } },
      { name: 'Marine Drive', type: 'Scenic', description: '3km long arc-shaped boulevard along the coast.', entryFeeINR: 0, coords: { lat: 18.9431, lng: 72.823 } },
      { name: 'Elephanta Caves', type: 'Heritage', description: 'Ancient rock-cut cave temples on Elephanta Island.', entryFeeINR: 300, coords: { lat: 18.9638, lng: 72.9315 } },
      { name: 'Chhatrapati Shivaji Terminus', type: 'Architecture', description: 'UNESCO historic terminal showcasing gothic style.', entryFeeINR: 0, coords: { lat: 18.94, lng: 72.8355 } }
    ],
    cuisine: ['Vada Pav', 'Pav Bhaji', 'Bhel Puri', 'Bombay Sandwich', 'Keema Pav'],
    localTransportOptions: ['Local Train', 'Best Bus', 'Black & Yellow Taxi', 'Auto Rickshaw (Suburbs)'],
    bestMonths: [
      { month: 'November', reason: 'Start of dry season, moderate heat.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '20°C - 32°C' },
      { month: 'December', reason: 'Cool ocean breezes, festive events.', crowdLevel: 'High', priceLevel: 'High', tempRange: '18°C - 30°C' },
      { month: 'January', reason: 'Pleasant winter weather, low humidity.', crowdLevel: 'High', priceLevel: 'High', tempRange: '17°C - 29°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8.5,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'Kokilaben Dhirubhai Ambani Hospital', phone: '022-30999999' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['city', 'shopping', 'nightlife', 'food']
  },
  {
    cityName: 'Delhi',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 28.7041, lng: 77.1025 },
    avgHotelCost: { budget: 1000, mid: 2500, luxury: 8000 },
    avgFoodCostPerDay: { streetFood: 200, restaurant: 600 },
    localTransportCostPerDay: 450,
    attractions: [
      { name: 'Red Fort', type: 'Heritage', description: 'Stunning 17th-century fortress built by Shah Jahan.', entryFeeINR: 80, coords: { lat: 28.6562, lng: 77.241 } },
      { name: 'Qutub Minar', type: 'Heritage', description: '73-meter tall victory tower built in the 12th century.', entryFeeINR: 40, coords: { lat: 28.5244, lng: 77.1855 } },
      { name: 'India Gate', type: 'Monument', description: 'War memorial dedicated to troops of British Indian Army.', entryFeeINR: 0, coords: { lat: 28.6129, lng: 77.2295 } },
      { name: 'Lotus Temple', type: 'Religion', description: 'Bahai house of worship shaped like a blooming lotus.', entryFeeINR: 0, coords: { lat: 28.5535, lng: 77.2588 } }
    ],
    cuisine: ['Butter Chicken', 'Chole Bhature', 'Golgappe', 'Aloo Chaat', 'Kebabs'],
    localTransportOptions: ['Delhi Metro', 'App Cabs', 'Auto Rickshaw', 'DTC Buses'],
    bestMonths: [
      { month: 'October', reason: 'End of summer heat, pleasant nights.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '19°C - 32°C' },
      { month: 'November', reason: 'Cool winters start, excellent sightseeing.', crowdLevel: 'High', priceLevel: 'Medium', tempRange: '12°C - 27°C' },
      { month: 'February', reason: 'Perfect spring breeze, flower festivals.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '11°C - 24°C' }
    ],
    safetyScore: 6,
    soloTravelerSafety: 6,
    womenSafety: 5,
    emergencyContacts: { police: '100', ambulance: '102', womenHelpline: '1091' },
    nearestHospitals: [{ name: 'Max Super Speciality Hospital Saket', phone: '011-26515050' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['city', 'heritage', 'food', 'shopping']
  },
  {
    cityName: 'Varanasi',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 25.3176, lng: 82.9739 },
    avgHotelCost: { budget: 800, mid: 2000, luxury: 6000 },
    avgFoodCostPerDay: { streetFood: 150, restaurant: 400 },
    localTransportCostPerDay: 300,
    attractions: [
      { name: 'Kashi Vishwanath Temple', type: 'Religion', description: 'Famed temple dedicated to Lord Shiva.', entryFeeINR: 0, coords: { lat: 25.3109, lng: 83.0104 } },
      { name: 'Dashashwamedh Ghat', type: 'Scenic', description: 'The main ghat where spectacular Ganga Aarti is performed daily.', entryFeeINR: 0, coords: { lat: 25.3078, lng: 83.0102 } },
      { name: 'Sarnath', type: 'Heritage', description: 'Where Lord Buddha gave his first sermon.', entryFeeINR: 20, coords: { lat: 25.3762, lng: 83.0227 } }
    ],
    cuisine: ['Kachori Sabzi', 'Banarasi Paan', 'Tamatar Chaat', 'Lassi', 'Rabri'],
    localTransportOptions: ['Cycle Rickshaw', 'Auto Rickshaw', 'Shared E-Rickshaw', 'Boat Ride'],
    bestMonths: [
      { month: 'October', reason: 'Post-monsoon river access is restored.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 31°C' },
      { month: 'November', reason: 'Dev Deepawali festival makes it magical.', crowdLevel: 'High', priceLevel: 'High', tempRange: '12°C - 28°C' },
      { month: 'December', reason: 'Cool and mist mornings on the Ganges.', crowdLevel: 'High', priceLevel: 'Medium', tempRange: '9°C - 23°C' }
    ],
    safetyScore: 7.5,
    soloTravelerSafety: 7.5,
    womenSafety: 6.5,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'Heritage Hospital Lanka', phone: '0542-2368888' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['spiritual', 'religion', 'culture', 'history']
  },
  {
    cityName: 'Rishikesh',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 30.0869, lng: 78.2676 },
    avgHotelCost: { budget: 800, mid: 1800, luxury: 5000 },
    avgFoodCostPerDay: { streetFood: 180, restaurant: 400 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Laxman Jhula', type: 'Scenic', description: 'Suspension bridge across the River Ganges.', entryFeeINR: 0, coords: { lat: 30.1299, lng: 78.3292 } },
      { name: 'Triveni Ghat', type: 'Religion', description: 'Famous bathing ghat where Maha Aarti is conducted.', entryFeeINR: 0, coords: { lat: 30.1042, lng: 78.2989 } },
      { name: 'Neer Garh Waterfall', type: 'Nature', description: 'Natural cascades tucked in the hill forests.', entryFeeINR: 30, coords: { lat: 30.1404, lng: 78.342 } }
    ],
    cuisine: ['Aloo Puri', 'Samosa', 'Chhole-Kulche', 'Ayurvedic Food', 'Masala Tea'],
    localTransportOptions: ['Auto Rickshaw', 'Shared Vikram', 'Scooter Rental'],
    bestMonths: [
      { month: 'October', reason: 'Perfect air for river rafting.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '15°C - 29°C' },
      { month: 'March', reason: 'International Yoga Festival.', crowdLevel: 'High', priceLevel: 'High', tempRange: '14°C - 28°C' },
      { month: 'April', reason: 'Clear summer days, ideal rafting water.', crowdLevel: 'High', priceLevel: 'Medium', tempRange: '18°C - 33°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8.5,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'AIIMS Rishikesh', phone: '0135-2452927' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['spiritual', 'adventure', 'yoga', 'river']
  },
  {
    cityName: 'Darjeeling',
    country: 'India',
    region: 'East India',
    coordinates: { lat: 27.041, lng: 88.2627 },
    avgHotelCost: { budget: 1200, mid: 2500, luxury: 6000 },
    avgFoodCostPerDay: { streetFood: 180, restaurant: 450 },
    localTransportCostPerDay: 600,
    attractions: [
      { name: 'Tiger Hill', type: 'Scenic', description: 'Famous for spectacular sunrise view over Kanchenjunga peak.', entryFeeINR: 80, coords: { lat: 26.9958, lng: 88.2917 } },
      { name: 'Batasia Loop', type: 'History', description: 'Spiral railway loop offering panoramic vistas.', entryFeeINR: 20, coords: { lat: 27.0219, lng: 88.2476 } },
      { name: 'Himalayan Mountaineering Institute', type: 'Museum', description: 'Museum dedicated to historic mountain expeditions.', entryFeeINR: 40, coords: { lat: 27.0583, lng: 88.2673 } }
    ],
    cuisine: ['Momos', 'Thukpa', 'Darjeeling Tea', 'Alu Dum', 'Sel Roti'],
    localTransportOptions: ['Shared Jeep', 'Chartered Taxi', 'Darjeeling Himalayan Railway (Toy Train)'],
    bestMonths: [
      { month: 'October', reason: 'Autumn breeze clears the mist, giving clear mountain views.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '10°C - 18°C' },
      { month: 'November', reason: 'Cold weather, very clear blue skies.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '6°C - 15°C' },
      { month: 'March', reason: 'Spring bloom of Rhododendrons.', crowdLevel: 'High', priceLevel: 'High', tempRange: '9°C - 17°C' }
    ],
    safetyScore: 8.5,
    soloTravelerSafety: 9,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'Darjeeling District Hospital', phone: '0354-2254326' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['hillstation', 'nature', 'tea', 'mountain']
  },
  {
    cityName: 'Andaman Islands',
    country: 'India',
    region: 'South India',
    coordinates: { lat: 11.7401, lng: 92.6586 },
    avgHotelCost: { budget: 2000, mid: 4500, luxury: 10000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 700 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Radhanagar Beach', type: 'Beach', description: 'Awarded as one of the best beaches in Asia (Havelock Island).', entryFeeINR: 0, coords: { lat: 12.03, lng: 92.95 } },
      { name: 'Cellular Jail', type: 'History', description: 'Historic colonial prison, now a National Memorial.', entryFeeINR: 30, coords: { lat: 11.6738, lng: 92.7479 } },
      { name: 'Baratang Island', type: 'Nature', description: 'Known for limestone caves and mangrove creeks.', entryFeeINR: 500, coords: { lat: 12.11, lng: 92.78 } }
    ],
    cuisine: ['Seafood Platter', 'Fish Curry', 'Coconut Prawn Curry', 'Fruit Chat', 'Lobster'],
    localTransportOptions: ['Private Ferry', 'Auto Rickshaw', 'Scooter Rental', 'Tourist Cab'],
    bestMonths: [
      { month: 'November', reason: 'Water sports active, dry season.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '23°C - 30°C' },
      { month: 'December', reason: 'Peak festival rush, highly pleasant.', crowdLevel: 'High', priceLevel: 'High', tempRange: '22°C - 30°C' },
      { month: 'January', reason: 'Ideal wind speed for scuba and snorkelling.', crowdLevel: 'High', priceLevel: 'High', tempRange: '22°C - 30°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8.5,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'G.B. Pant Hospital Port Blair', phone: '03192-233473' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['beach', 'islands', 'scuba', 'nature']
  },
  {
    cityName: 'Coorg',
    country: 'India',
    region: 'South India',
    coordinates: { lat: 12.3375, lng: 75.8069 },
    avgHotelCost: { budget: 1200, mid: 2500, luxury: 6000 },
    avgFoodCostPerDay: { streetFood: 180, restaurant: 500 },
    localTransportCostPerDay: 600,
    attractions: [
      { name: 'Abbey Falls', type: 'Nature', description: 'Beautiful waterfall located amidst lush coffee estates.', entryFeeINR: 15, coords: { lat: 12.4578, lng: 75.7208 } },
      { name: 'Raja\'s Seat', type: 'Scenic', description: 'Scenic hilltop garden offering beautiful sunset views.', entryFeeINR: 10, coords: { lat: 12.4132, lng: 75.7368 } },
      { name: 'Namdroling Golden Temple Bypass', type: 'Heritage', description: 'Tibetan monastery in Bylakuppe, housing golden statues.', entryFeeINR: 0, coords: { lat: 12.45, lng: 75.96 } }
    ],
    cuisine: ['Pandi Curry (Pork)', 'Kadambuttu (Rice Balls)', 'Bamboo Shoot Curry', 'Filter Coffee'],
    localTransportOptions: ['Auto Rickshaw', 'Rented Bike', 'Local Jeep'],
    bestMonths: [
      { month: 'October', reason: 'Post-monsoon aroma of fresh coffee blossoms.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 26°C' },
      { month: 'December', reason: 'Cool winters, cozy homestays are active.', crowdLevel: 'High', priceLevel: 'High', tempRange: '14°C - 22°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'District Hospital Madikeri', phone: '08272-225916' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['hillstation', 'coffee', 'nature', 'trekking']
  },
  {
    cityName: 'Udaipur',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 24.5854, lng: 73.7125 },
    avgHotelCost: { budget: 1000, mid: 2500, luxury: 8000 },
    avgFoodCostPerDay: { streetFood: 180, restaurant: 500 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'City Palace Udaipur', type: 'Heritage', description: 'Stunning palace complex located on the banks of Lake Pichola.', entryFeeINR: 250, coords: { lat: 24.5764, lng: 73.6835 } },
      { name: 'Lake Pichola', type: 'Scenic', description: 'Picturesque artificial lake known for its boat tours.', entryFeeINR: 400, coords: { lat: 24.5714, lng: 73.6738 } },
      { name: 'Sajjangarh Monsoon Palace', type: 'History', description: 'Hilltop palatial residence overlooking the lakes.', entryFeeINR: 110, coords: { lat: 24.5886, lng: 73.6397 } }
    ],
    cuisine: ['Rajasthani Thali', 'Ker Sangri', 'Mirchi Bada', 'Kachori', 'Sohan Halwa'],
    localTransportOptions: ['Auto Rickshaw', 'Cycle Rickshaw', 'App Taxi', 'Boats'],
    bestMonths: [
      { month: 'October', reason: 'Lakes are filled, mild temperature.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 33°C' },
      { month: 'November', reason: 'Ideal weather, clear blue lake reflections.', crowdLevel: 'High', priceLevel: 'High', tempRange: '12°C - 28°C' },
      { month: 'December', reason: 'Romantic cool evenings on lakeside.', crowdLevel: 'High', priceLevel: 'High', tempRange: '8°C - 24°C' }
    ],
    safetyScore: 8.5,
    soloTravelerSafety: 8.5,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102' },
    nearestHospitals: [{ name: 'Geetanjali Medical College & Hospital', phone: '0294-2500000' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['romance', 'heritage', 'lakes', 'palace']
  },

  // â”€â”€ INTERNATIONAL DESTINATIONS â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  {
    cityName: 'Bangkok',
    country: 'Thailand',
    region: 'Southeast Asia',
    coordinates: { lat: 13.7563, lng: 100.5018 },
    avgHotelCost: { budget: 2000, mid: 4000, luxury: 9000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 900 },
    localTransportCostPerDay: 600,
    attractions: [
      { name: 'The Grand Palace', type: 'Heritage', description: 'Stunning royal palace complex with intricate gold designs.', entryFeeINR: 1200, coords: { lat: 13.75, lng: 100.4913 } },
      { name: 'Wat Arun', type: 'Religion', description: 'Temple of the Dawn with iconic porcelain-covered spires.', entryFeeINR: 250, coords: { lat: 13.7437, lng: 100.4889 } },
      { name: 'Chatuchak Weekend Market', type: 'Shopping', description: 'One of the largest outdoor markets in the world.', entryFeeINR: 0, coords: { lat: 13.7999, lng: 100.5505 } }
    ],
    cuisine: ['Pad Thai', 'Tom Yum Goong', 'Green Curry', 'Mango Sticky Rice', 'Som Tum'],
    localTransportOptions: ['BTS Skytrain', 'MRT Metro', 'Tuk Tuk', 'Grab App Taxi'],
    bestMonths: [
      { month: 'November', reason: 'Cooler dry season starts. Very pleasant.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '23°C - 31°C' },
      { month: 'December', reason: 'Peak tourism, pleasant shopping weather.', crowdLevel: 'High', priceLevel: 'High', tempRange: '21°C - 30°C' },
      { month: 'January', reason: 'Ideal dry days for city sightseeing.', crowdLevel: 'High', priceLevel: 'High', tempRange: '21°C - 31°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8.5,
    womenSafety: 8,
    emergencyContacts: { police: '191', ambulance: '1669', touristHelpline: '1155', embassy: '+66-2-2580300' },
    nearestHospitals: [{ name: 'Bumrungrad International Hospital', phone: '+66-2-0668888' }],
    currency: 'THB',
    countryCode: 'TH',
    tags: ['city', 'shopping', 'nightlife', 'temples']
  },
  {
    cityName: 'Bali',
    country: 'Indonesia',
    region: 'Southeast Asia',
    coordinates: { lat: -8.4095, lng: 115.1889 },
    avgHotelCost: { budget: 1500, mid: 3500, luxury: 9000 },
    avgFoodCostPerDay: { streetFood: 250, restaurant: 800 },
    localTransportCostPerDay: 700,
    attractions: [
      { name: 'Ubud Sacred Monkey Forest', type: 'Nature', description: 'Sanctuary inhabited by Balinese long-tailed monkeys.', entryFeeINR: 450, coords: { lat: -8.519, lng: 115.26 } },
      { name: 'Tanah Lot Temple', type: 'Scenic', description: 'Iconic offshore rock temple offering magnificent sunset views.', entryFeeINR: 350, coords: { lat: -8.6212, lng: 115.0868 } },
      { name: 'Tegallalang Rice Terraces', type: 'Scenic', description: 'Beautiful terraced hillsides with local rice agriculture.', entryFeeINR: 100, coords: { lat: -8.43, lng: 115.28 } }
    ],
    cuisine: ['Nasi Goreng', 'Babi Guling', 'Sate Lilit', 'Lawar', 'Gado-Gado'],
    localTransportOptions: ['Rented Scooter', 'GoJek / Grab Driver', 'Private Tour Guide'],
    bestMonths: [
      { month: 'June', reason: 'Dry season, clear sunny skies, low humidity.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '24°C - 30°C' },
      { month: 'July', reason: 'Perfect beach weather, busy tourist rush.', crowdLevel: 'High', priceLevel: 'High', tempRange: '23°C - 29°C' },
      { month: 'August', reason: 'Peak dry season. Ideal for watersports.', crowdLevel: 'High', priceLevel: 'High', tempRange: '23°C - 30°C' }
    ],
    safetyScore: 8.5,
    soloTravelerSafety: 9,
    womenSafety: 8.5,
    emergencyContacts: { police: '110', ambulance: '118', touristHelpline: '+62-361-224111', embassy: '+62-21-2526220' },
    nearestHospitals: [{ name: 'BIMC Hospital Kuta', phone: '+62-361-761263' }],
    currency: 'IDR',
    countryCode: 'ID',
    tags: ['beach', 'nature', 'spiritual', 'wellness']
  },
  {
    cityName: 'Singapore',
    country: 'Singapore',
    region: 'Southeast Asia',
    coordinates: { lat: 1.3521, lng: 103.8198 },
    avgHotelCost: { budget: 5000, mid: 10000, luxury: 25000 },
    avgFoodCostPerDay: { streetFood: 600, restaurant: 2000 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Gardens by the Bay', type: 'Scenic', description: 'Futuristic park featuring Supertree structures and conservatories.', entryFeeINR: 1800, coords: { lat: 1.2816, lng: 103.8636 } },
      { name: 'Sentosa Island', type: 'Entertainment', description: 'Island resort housing Universal Studios and beaches.', entryFeeINR: 2500, coords: { lat: 1.2494, lng: 103.8303 } },
      { name: 'Marina Bay Sands Skypark', type: 'Scenic', description: 'Iconic observation deck overlooking Singapore skyline.', entryFeeINR: 1500, coords: { lat: 1.2834, lng: 103.8607 } }
    ],
    cuisine: ['Chilli Crab', 'Hainanese Chicken Rice', 'Laksa', 'Roti Prata', 'Kaya Toast'],
    localTransportOptions: ['MRT Subway', 'Public Bus', 'Grab / Tada App Taxi'],
    bestMonths: [
      { month: 'February', reason: 'Dry season, least rain, lots of sunshine.', crowdLevel: 'Medium', priceLevel: 'High', tempRange: '24°C - 31°C' },
      { month: 'March', reason: 'Excellent outdoor activity window.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '25°C - 32°C' },
      { month: 'June', reason: 'Great shopping discounts during Great Singapore Sale.', crowdLevel: 'High', priceLevel: 'High', tempRange: '25°C - 31°C' }
    ],
    safetyScore: 9.9,
    soloTravelerSafety: 9.9,
    womenSafety: 9.9,
    emergencyContacts: { police: '999', ambulance: '995', touristHelpline: '1800-7362000', embassy: '+65-67376777' },
    nearestHospitals: [{ name: 'Singapore General Hospital', phone: '+65-62223322' }],
    currency: 'SGD',
    countryCode: 'SG',
    tags: ['city', 'modern', 'family', 'luxury']
  },
  {
    cityName: 'Dubai',
    country: 'UAE',
    region: 'Middle East',
    coordinates: { lat: 25.2048, lng: 55.2708 },
    avgHotelCost: { budget: 4000, mid: 9000, luxury: 22000 },
    avgFoodCostPerDay: { streetFood: 500, restaurant: 1800 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Burj Khalifa', type: 'Scenic', description: 'The tallest building in the world at 828m.', entryFeeINR: 3500, coords: { lat: 25.1972, lng: 55.2744 } },
      { name: 'Dubai Mall', type: 'Shopping', description: 'Massive luxury shopping and entertainment complex.', entryFeeINR: 0, coords: { lat: 25.1985, lng: 55.2796 } },
      { name: 'Desert Safari', type: 'Adventure', description: 'Dune bashing, camel riding, and traditional dinner camps.', entryFeeINR: 2500, coords: { lat: 24.95, lng: 55.6 } }
    ],
    cuisine: ['Shawarma', 'Al Harees', 'Mandhi', 'Luqaimat', 'Hummus & Falafel'],
    localTransportOptions: ['Dubai Metro', 'RTA Taxi', 'Careem App Taxi', 'Tram'],
    bestMonths: [
      { month: 'November', reason: 'Pleasant winter temperatures begin.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '19°C - 31°C' },
      { month: 'December', reason: 'Excellent cool outdoor climate. High shopping rush.', crowdLevel: 'High', priceLevel: 'High', tempRange: '16°C - 26°C' },
      { month: 'January', reason: 'Dubai Shopping Festival peak activities.', crowdLevel: 'High', priceLevel: 'High', tempRange: '15°C - 24°C' }
    ],
    safetyScore: 9.5,
    soloTravelerSafety: 9.5,
    womenSafety: 9.5,
    emergencyContacts: { police: '999', ambulance: '998', touristHelpline: '800-4438', embassy: '+971-2-4492700' },
    nearestHospitals: [{ name: 'Rashid Hospital Dubai', phone: '+971-4-2192000' }],
    currency: 'AED',
    countryCode: 'AE',
    tags: ['city', 'modern', 'desert', 'luxury']
  },
  {
    cityName: 'Paris',
    country: 'France',
    region: 'Europe',
    coordinates: { lat: 48.8566, lng: 2.3522 },
    avgHotelCost: { budget: 6000, mid: 12000, luxury: 30000 },
    avgFoodCostPerDay: { streetFood: 800, restaurant: 2500 },
    localTransportCostPerDay: 900,
    attractions: [
      { name: 'Eiffel Tower', type: 'Scenic', description: 'Iconic wrought iron lattice tower on the Champ de Mars.', entryFeeINR: 2400, coords: { lat: 48.8584, lng: 2.2945 } },
      { name: 'Louvre Museum', type: 'Museum', description: 'The world\'s largest art museum holding the Mona Lisa.', entryFeeINR: 1900, coords: { lat: 48.8606, lng: 2.3376 } },
      { name: 'Cathédrale Notre-Dame', type: 'Heritage', description: 'Famed medieval Catholic cathedral.', entryFeeINR: 0, coords: { lat: 48.853, lng: 2.3499 } }
    ],
    cuisine: ['Croissants', 'Escargot', 'Macarons', 'Crepes', 'Coq au Vin'],
    localTransportOptions: ['Paris Metro', 'RER Train', 'Vélib Bicycle', 'Uber Cabs'],
    bestMonths: [
      { month: 'April', reason: 'Spring in Paris, blooming parks, pleasant.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '8°C - 16°C' },
      { month: 'May', reason: 'Beautiful long daylight hours, spring flowers.', crowdLevel: 'High', priceLevel: 'High', tempRange: '11°C - 20°C' },
      { month: 'September', reason: 'Lovely autumn breeze, lesser crowd than summer.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '13°C - 22°C' }
    ],
    safetyScore: 7.5,
    soloTravelerSafety: 8,
    womenSafety: 7.5,
    emergencyContacts: { police: '17', ambulance: '15', touristHelpline: '112', embassy: '+33-1-40507070' },
    nearestHospitals: [{ name: 'Hôpital Saint-Louis', phone: '+33-1-42494949' }],
    currency: 'EUR',
    countryCode: 'FR',
    tags: ['city', 'heritage', 'museums', 'art']
  },
  {
    cityName: 'Istanbul',
    country: 'Turkey',
    region: 'Europe/Asia',
    coordinates: { lat: 41.0082, lng: 28.9784 },
    avgHotelCost: { budget: 2500, mid: 5000, luxury: 12000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 900 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Hagia Sophia', type: 'Heritage', description: 'Stunning historical place of worship showing Byzantine art.', entryFeeINR: 0, coords: { lat: 41.0085, lng: 28.9802 } },
      { name: 'Topkapi Palace', type: 'History', description: 'Grand residence of Ottoman Sultans for nearly 400 years.', entryFeeINR: 1800, coords: { lat: 41.0115, lng: 28.9833 } },
      { name: 'Grand Bazaar', type: 'Shopping', description: 'One of the largest covered markets in the world.', entryFeeINR: 0, coords: { lat: 41.0106, lng: 28.968 } }
    ],
    cuisine: ['Doner Kebab', 'Turkish Delight', 'Baklava', 'Simit', 'Turkish Tea'],
    localTransportOptions: ['Tram', 'Metro', 'Ferry', 'Yellow Taxi'],
    bestMonths: [
      { month: 'April', reason: 'Tulip festival, perfect cool weather.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '9°C - 16°C' },
      { month: 'May', reason: 'Ideal spring weather, very pleasant.', crowdLevel: 'Medium', priceLevel: 'High', tempRange: '12°C - 21°C' },
      { month: 'October', reason: 'Stunning autumn colors on the Bosphorus.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '13°C - 20°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8,
    womenSafety: 7.5,
    emergencyContacts: { police: '155', ambulance: '112', touristHelpline: '179', embassy: '+90-312-4382100' },
    nearestHospitals: [{ name: 'Florence Nightingale Hospital', phone: '+90-212-3756565' }],
    currency: 'TRY',
    countryCode: 'TR',
    tags: ['heritage', 'shopping', 'history', 'bridges']
  },
  {
    cityName: 'Vietnam',
    country: 'Vietnam',
    region: 'Southeast Asia',
    coordinates: { lat: 21.0278, lng: 105.8342 }, // Hanoi center
    avgHotelCost: { budget: 1200, mid: 2500, luxury: 6000 },
    avgFoodCostPerDay: { streetFood: 200, restaurant: 600 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Ha Long Bay Cruise', type: 'Scenic', description: 'Stunning emerald waters and towering limestone islands (requires day trip from Hanoi).', entryFeeINR: 1500, coords: { lat: 20.97, lng: 107.08 } },
      { name: 'Hanoi Old Quarter', type: 'Shopping', description: 'Charming streets packed with shops, street-side food, and history.', entryFeeINR: 0, coords: { lat: 21.0336, lng: 105.8524 } },
      { name: 'Ho Chi Minh Mausoleum', type: 'History', description: 'Resting place of Vietnamese revolutionary leader Ho Chi Minh.', entryFeeINR: 100, coords: { lat: 21.0368, lng: 105.8347 } }
    ],
    cuisine: ['Pho (Noodle Soup)', 'Banh Mi', 'Fresh Spring Rolls', 'Egg Coffee', 'Bun Cha'],
    localTransportOptions: ['Grab Bike / Car', 'Local Bus', 'Motorbike Taxi'],
    bestMonths: [
      { month: 'October', reason: 'Autumn breeze in the north, mild dry climate.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '21°C - 28°C' },
      { month: 'November', reason: 'Cool dry winds, pleasant sightseeing.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '19°C - 26°C' },
      { month: 'December', reason: 'Chilly north winters, very dry, great for tours.', crowdLevel: 'High', priceLevel: 'High', tempRange: '15°C - 22°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 8.5,
    emergencyContacts: { police: '113', ambulance: '115', embassy: '+84-24-38452501' },
    nearestHospitals: [{ name: 'Vinmec International Hospital Hanoi', phone: '+84-24-39743556' }],
    currency: 'VND',
    countryCode: 'VN',
    tags: ['nature', 'backpacking', 'food', 'budget']
  },
  {
    cityName: 'Sri Lanka',
    country: 'Sri Lanka',
    region: 'South Asia',
    coordinates: { lat: 6.9271, lng: 79.8612 }, // Colombo
    avgHotelCost: { budget: 1500, mid: 3000, luxury: 7000 },
    avgFoodCostPerDay: { streetFood: 200, restaurant: 600 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Sigiriya Rock Fortress', type: 'Heritage', description: 'Ancient fortress ruins atop a massive 200m high column of rock.', entryFeeINR: 2400, coords: { lat: 7.957, lng: 80.76 } },
      { name: 'Temple of the Tooth', type: 'Religion', description: 'Golden-roofed Buddhist temple in Kandy housing the tooth relic.', entryFeeINR: 800, coords: { lat: 7.2938, lng: 80.6413 } },
      { name: 'Galle Fort', type: 'Scenic', description: 'Colonial-era Dutch fort overlooking the Indian Ocean.', entryFeeINR: 0, coords: { lat: 6.0267, lng: 80.2158 } }
    ],
    cuisine: ['Kothu Roti', 'Fish Ambul Thiyal', 'Hoppers', 'Pol Sambol', 'Coconut Roti'],
    localTransportOptions: ['Tuk Tuk', 'Public Bus', 'Train (Scenic ride to Ella)', 'PickMe App Cabs'],
    bestMonths: [
      { month: 'December', reason: 'Dry season on the west & south coast beaches.', crowdLevel: 'High', priceLevel: 'High', tempRange: '23°C - 30°C' },
      { month: 'January', reason: 'Spectacular whale watching and sunny beach days.', crowdLevel: 'High', priceLevel: 'High', tempRange: '22°C - 30°C' },
      { month: 'February', reason: 'Pleasant climate all across the central hills.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '22°C - 31°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8,
    womenSafety: 7.5,
    emergencyContacts: { police: '119', ambulance: '110', touristHelpline: '1912', embassy: '+94-11-2327587' },
    nearestHospitals: [{ name: 'Colombo General Hospital', phone: '+94-11-2691111' }],
    currency: 'LKR',
    countryCode: 'LK',
    tags: ['beach', 'nature', 'spiritual', 'backpacking']
  },
  {
    cityName: 'Shimla',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 31.1048, lng: 77.1734 },
    avgHotelCost: { budget: 1500, mid: 3500, luxury: 9000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 800 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Mall Road', type: 'Shopping', description: 'Colonial-era promenade lined with shops, cafes and panoramic valley views.', entryFeeINR: 0, coords: { lat: 31.1033, lng: 77.1733 } },
      { name: 'Kufri', type: 'Nature', description: 'Hill station offering skiing, pony rides and Himalayan vistas.', entryFeeINR: 100, coords: { lat: 31.0996, lng: 77.2671 } },
      { name: 'Jakhoo Temple', type: 'Religion', description: 'Hilltop Hanuman temple with a giant statue and sweeping views.', entryFeeINR: 0, coords: { lat: 31.1005, lng: 77.1922 } },
      { name: 'Toy Train (Kalka-Shimla)', type: 'Heritage', description: 'UNESCO-listed scenic narrow-gauge mountain railway.', entryFeeINR: 700, coords: { lat: 30.9052, lng: 76.9415 } }
    ],
    cuisine: ['Momos', 'Thukpa', 'Siddu', 'Maggi Corners', 'Lamb Stew'],
    localTransportOptions: ['Local Taxi', 'Heritage Toy Train', 'Walkable City'],
    bestMonths: [
      { month: 'March', reason: 'Pleasant spring weather, blooming rhododendrons.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '8°C - 20°C' },
      { month: 'June', reason: 'Cool escape from plains heat, great for sightseeing.', crowdLevel: 'High', priceLevel: 'High', tempRange: '15°C - 28°C' },
      { month: 'December', reason: 'Snowfall and winter charm.', crowdLevel: 'High', priceLevel: 'High', tempRange: '-2°C - 12°C' }
    ],
    safetyScore: 8.5,
    soloTravelerSafety: 8.5,
    womenSafety: 8,
    emergencyContacts: { police: '100', ambulance: '102', touristHelpline: '1363' },
    nearestHospitals: [{ name: 'Indira Gandhi Medical College', phone: '0177-2658586' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['mountain', 'hillstation', 'family', 'scenic']
  },
  {
    cityName: 'Srinagar',
    country: 'India',
    region: 'North India',
    coordinates: { lat: 34.0837, lng: 74.7973 },
    avgHotelCost: { budget: 1800, mid: 4000, luxury: 12000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 800 },
    localTransportCostPerDay: 700,
    attractions: [
      { name: 'Dal Lake Shikara Ride', type: 'Scenic', description: 'Iconic wooden boat ride across Dal Lake with floating gardens.', entryFeeINR: 500, coords: { lat: 34.1109, lng: 74.8687 } },
      { name: 'Mughal Gardens', type: 'Heritage', description: 'Terraced Persian-style gardens including Shalimar and Nishat Bagh.', entryFeeINR: 30, coords: { lat: 34.1168, lng: 74.8351 } },
      { name: 'Gulmarg', type: 'Adventure', description: 'Meadow valley famous for skiing and the Gulmarg Gondola.', entryFeeINR: 300, coords: { lat: 34.0477, lng: 74.3881 } },
      { name: 'Pahalgam', type: 'Nature', description: 'Scenic valley on the Lidder river, gateway to Amarnath.', entryFeeINR: 0, coords: { lat: 34.0364, lng: 75.3153 } }
    ],
    cuisine: ['Wazwan', 'Rogan Josh', 'Yakhni', 'Kashmiri Kahwa', 'Modur Pulav'],
    localTransportOptions: ['Local Taxis', 'Shikara', 'Auto Rickshaw'],
    bestMonths: [
      { month: 'April', reason: 'Spring blossoms at Mughal gardens, pleasant weather.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '8°C - 22°C' },
      { month: 'October', reason: 'Golden autumn, clear skies, great sightseeing.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '5°C - 20°C' },
      { month: 'December', reason: 'Snowfall in Gulmarg for skiing enthusiasts.', crowdLevel: 'Medium', priceLevel: 'High', tempRange: '-4°C - 8°C' }
    ],
    safetyScore: 7.5,
    soloTravelerSafety: 7.5,
    womenSafety: 7,
    emergencyContacts: { police: '100', ambulance: '102', touristHelpline: '1363' },
    nearestHospitals: [{ name: 'SKIMS Hospital Soura', phone: '0194-240-4658' }],
    currency: 'INR',
    countryCode: 'IN',
    tags: ['mountain', 'lakes', 'heritage', 'adventure']
  },
  {
    cityName: 'Tokyo',
    country: 'Japan',
    region: 'East Asia',
    coordinates: { lat: 35.6762, lng: 139.6503 },
    avgHotelCost: { budget: 5000, mid: 10000, luxury: 25000 },
    avgFoodCostPerDay: { streetFood: 700, restaurant: 2000 },
    localTransportCostPerDay: 600,
    attractions: [
      { name: 'Tsukiji Outer Market', type: 'Food', description: 'Bustling market famous for fresh sushi and seafood breakfasts.', entryFeeINR: 0, coords: { lat: 35.6654, lng: 139.7707 } },
      { name: 'Senso-ji Temple', type: 'Heritage', description: 'Tokyo\'s oldest temple in Asakusa with a vibrant shopping street.', entryFeeINR: 0, coords: { lat: 35.7148, lng: 139.7967 } },
      { name: 'Shibuya Crossing', type: 'City', description: 'World-famous scramble crossing and neon shopping district.', entryFeeINR: 0, coords: { lat: 35.6595, lng: 139.7005 } },
      { name: 'Meiji Shrine', type: 'Religion', description: 'Peaceful Shinto shrine surrounded by a lush forest in Harajuku.', entryFeeINR: 0, coords: { lat: 35.6764, lng: 139.6993 } }
    ],
    cuisine: ['Sushi', 'Ramen', 'Tempura', 'Okonomiyaki', 'Matcha Desserts'],
    localTransportOptions: ['Tokyo Metro', 'JR Yamanote Line', 'Taxis', 'Bus'],
    bestMonths: [
      { month: 'March', reason: 'Cherry blossom season across parks.', crowdLevel: 'High', priceLevel: 'High', tempRange: '5°C - 14°C' },
      { month: 'April', reason: 'Full sakura bloom, spectacular city parks.', crowdLevel: 'High', priceLevel: 'High', tempRange: '9°C - 18°C' },
      { month: 'November', reason: 'Autumn foliage, comfortable temperatures.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '10°C - 17°C' }
    ],
    safetyScore: 9.5,
    soloTravelerSafety: 9.5,
    womenSafety: 9.5,
    emergencyContacts: { police: '110', ambulance: '119', touristHelpline: '03-3201-3331', embassy: '+81-3-3262-2391' },
    nearestHospitals: [{ name: 'St. Luke\'s International Hospital', phone: '+81-3-3541-5151' }],
    currency: 'JPY',
    countryCode: 'JP',
    tags: ['city', 'food', 'technology', 'culture']
  },
  {
    cityName: 'London',
    country: 'United Kingdom',
    region: 'Europe',
    coordinates: { lat: 51.5074, lng: -0.1278 },
    avgHotelCost: { budget: 6000, mid: 12000, luxury: 30000 },
    avgFoodCostPerDay: { streetFood: 800, restaurant: 2200 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Tower of London', type: 'Heritage', description: 'Historic castle and fortress housing the Crown Jewels.', entryFeeINR: 3300, coords: { lat: 51.5081, lng: -0.0759 } },
      { name: 'British Museum', type: 'Museum', description: 'World-renowned museum of history and culture (free entry).', entryFeeINR: 0, coords: { lat: 51.5194, lng: -0.127 } },
      { name: 'Big Ben & Westminster', type: 'Scenic', description: 'Iconic clock tower and the Houses of Parliament.', entryFeeINR: 0, coords: { lat: 51.5007, lng: -0.1246 } },
      { name: 'Buckingham Palace', type: 'Heritage', description: 'Official residence of the monarch, famous for the Changing of the Guard.', entryFeeINR: 0, coords: { lat: 51.5014, lng: -0.1419 } }
    ],
    cuisine: ['Fish and Chips', 'Afternoon Tea', 'Full English Breakfast', 'Sunday Roast', 'Pies'],
    localTransportOptions: ['London Underground', 'Red Double-Decker Bus', 'Black Cabs', 'Santander Cycles'],
    bestMonths: [
      { month: 'May', reason: 'Spring warmth and fewer crowds than summer.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '9°C - 18°C' },
      { month: 'June', reason: 'Long daylight hours, outdoor events.', crowdLevel: 'High', priceLevel: 'High', tempRange: '12°C - 21°C' },
      { month: 'September', reason: 'Mild autumn, pleasant sightseeing.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '11°C - 19°C' }
    ],
    safetyScore: 8,
    soloTravelerSafety: 8.5,
    womenSafety: 8,
    emergencyContacts: { police: '999', ambulance: '999', touristHelpline: '101', embassy: '+44-20-7836-9141' },
    nearestHospitals: [{ name: 'St Thomas\' Hospital', phone: '+44-20-7188-7188' }],
    currency: 'GBP',
    countryCode: 'GB',
    tags: ['city', 'heritage', 'museums', 'culture']
  },
  {
    cityName: 'New York',
    country: 'United States',
    region: 'North America',
    coordinates: { lat: 40.7128, lng: -74.006 },
    avgHotelCost: { budget: 8000, mid: 16000, luxury: 40000 },
    avgFoodCostPerDay: { streetFood: 1000, restaurant: 3000 },
    localTransportCostPerDay: 800,
    attractions: [
      { name: 'Statue of Liberty & Ellis Island', type: 'Scenic', description: 'Iconic harbor landmark and immigration museum.', entryFeeINR: 2000, coords: { lat: 40.6892, lng: -74.0445 } },
      { name: 'Central Park', type: 'Nature', description: '843-acre urban park with lakes, trails and attractions.', entryFeeINR: 0, coords: { lat: 40.7812, lng: -73.9665 } },
      { name: 'Times Square', type: 'City', description: 'Dazzling entertainment hub with neon billboards and Broadway.', entryFeeINR: 0, coords: { lat: 40.758, lng: -73.9855 } },
      { name: 'Metropolitan Museum of Art', type: 'Museum', description: 'One of the world\'s largest and finest art museums.', entryFeeINR: 2500, coords: { lat: 40.7794, lng: -73.9632 } }
    ],
    cuisine: ['NYC Pizza', 'Bagels', 'Pastrami Sandwich', 'Cheesecake', 'Street Hot Dogs'],
    localTransportOptions: ['Subway (MTA)', 'Yellow Taxis', 'Ride-Share Apps', 'Bike Sharing'],
    bestMonths: [
      { month: 'April', reason: 'Spring blossoms, mild crowds.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '7°C - 16°C' },
      { month: 'September', reason: 'Perfect weather, fewer crowds than summer.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '16°C - 25°C' },
      { month: 'October', reason: 'Autumn colors in Central Park.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '10°C - 19°C' }
    ],
    safetyScore: 7,
    soloTravelerSafety: 7.5,
    womenSafety: 7,
    emergencyContacts: { police: '911', ambulance: '911', touristHelpline: '311', embassy: '+91-11-2419-8000' },
    nearestHospitals: [{ name: 'Mount Sinai Hospital', phone: '+1-212-241-6500' }],
    currency: 'USD',
    countryCode: 'US',
    tags: ['city', 'nightlife', 'shopping', 'culture']
  },
  {
    cityName: 'Sydney',
    country: 'Australia',
    region: 'Oceania',
    coordinates: { lat: -33.8688, lng: 151.2093 },
    avgHotelCost: { budget: 6000, mid: 12000, luxury: 30000 },
    avgFoodCostPerDay: { streetFood: 800, restaurant: 2200 },
    localTransportCostPerDay: 700,
    attractions: [
      { name: 'Sydney Opera House', type: 'Scenic', description: 'UNESCO-listed performing arts centre with sail-shaped roof.', entryFeeINR: 0, coords: { lat: -33.8568, lng: 151.2153 } },
      { name: 'Sydney Harbour Bridge', type: 'Adventure', description: 'Iconic steel arch bridge offering the famous BridgeClimb.', entryFeeINR: 3500, coords: { lat: -33.8523, lng: 151.2108 } },
      { name: 'Bondi Beach', type: 'Beach', description: 'World-famous beach with surf culture and coastal walks.', entryFeeINR: 0, coords: { lat: -33.8908, lng: 151.2743 } },
      { name: 'Taronga Zoo', type: 'Nature', description: 'Harbour-side zoo with native Australian wildlife.', entryFeeINR: 4000, coords: { lat: -33.8437, lng: 151.2413 } }
    ],
    cuisine: ['Vegemite Toast', 'Meat Pies', 'Barramundi', 'Pavlova', 'Tim Tams'],
    localTransportOptions: ['Ferry', 'Train (Opal Card)', 'Bus', 'Trams'],
    bestMonths: [
      { month: 'March', reason: 'End of summer, warm and less crowded.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '19°C - 27°C' },
      { month: 'November', reason: 'Spring, pleasant weather before peak summer.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '16°C - 25°C' },
      { month: 'December', reason: 'Summer vibes, perfect for beaches.', crowdLevel: 'High', priceLevel: 'High', tempRange: '18°C - 26°C' }
    ],
    safetyScore: 8.5,
    soloTravelerSafety: 8.5,
    womenSafety: 8.5,
    emergencyContacts: { police: '000', ambulance: '000', touristHelpline: '000', embassy: '+61-2-9223-9500' },
    nearestHospitals: [{ name: 'St Vincent\'s Hospital', phone: '+61-2-8382-1111' }],
    currency: 'AUD',
    countryCode: 'AU',
    tags: ['beach', 'city', 'nature', 'family']
  },
  {
    cityName: 'Rome',
    country: 'Italy',
    region: 'Europe',
    coordinates: { lat: 41.9028, lng: 12.4964 },
    avgHotelCost: { budget: 4500, mid: 9000, luxury: 22000 },
    avgFoodCostPerDay: { streetFood: 600, restaurant: 1800 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Colosseum', type: 'Heritage', description: 'Ancient amphitheatre, the largest ever built.', entryFeeINR: 1900, coords: { lat: 41.8902, lng: 12.4922 } },
      { name: 'Vatican City', type: 'Religion', description: 'Home to St. Peter\'s Basilica and the Sistine Chapel.', entryFeeINR: 2200, coords: { lat: 41.9029, lng: 12.4534 } },
      { name: 'Trevi Fountain', type: 'Scenic', description: 'Baroque fountain where visitors toss coins for luck.', entryFeeINR: 0, coords: { lat: 41.9009, lng: 12.4833 } },
      { name: 'Pantheon', type: 'Heritage', description: 'Well-preserved ancient Roman temple with a massive dome.', entryFeeINR: 0, coords: { lat: 41.8986, lng: 12.4769 } }
    ],
    cuisine: ['Carbonara', 'Pizza al Taglio', 'Gelato', 'Cacio e Pepe', 'Tiramisu'],
    localTransportOptions: ['Metro', 'Bus', 'Hop-on Hop-off', 'Walking Tours'],
    bestMonths: [
      { month: 'April', reason: 'Mild spring weather, perfect walking conditions.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '9°C - 19°C' },
      { month: 'May', reason: 'Warm days, fewer crowds than June.', crowdLevel: 'Medium', priceLevel: 'High', tempRange: '12°C - 23°C' },
      { month: 'October', reason: 'Pleasant autumn, ideal for sightseeing.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '12°C - 21°C' }
    ],
    safetyScore: 7.5,
    soloTravelerSafety: 8,
    womenSafety: 7.5,
    emergencyContacts: { police: '112', ambulance: '112', touristHelpline: '113', embassy: '+39-06-4880-1651' },
    nearestHospitals: [{ name: 'Ospedale San Camillo', phone: '+39-06-58701' }],
    currency: 'EUR',
    countryCode: 'IT',
    tags: ['heritage', 'food', 'history', 'art']
  },
  {
    cityName: 'Barcelona',
    country: 'Spain',
    region: 'Europe',
    coordinates: { lat: 41.3874, lng: 2.1686 },
    avgHotelCost: { budget: 4500, mid: 9000, luxury: 22000 },
    avgFoodCostPerDay: { streetFood: 600, restaurant: 1800 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Sagrada Familia', type: 'Heritage', description: 'Gaudí\'s towering unfinished basilica, a UNESCO wonder.', entryFeeINR: 2800, coords: { lat: 41.4036, lng: 2.1744 } },
      { name: 'Park Güell', type: 'Scenic', description: 'Colorful mosaic park designed by Antoni Gaudí.', entryFeeINR: 1000, coords: { lat: 41.4145, lng: 2.1527 } },
      { name: 'La Rambla', type: 'Shopping', description: 'Tree-lined pedestrian boulevard with street performers.', entryFeeINR: 0, coords: { lat: 41.3809, lng: 2.173 } },
      { name: 'Barceloneta Beach', type: 'Beach', description: 'Lively urban beach with promenade and seafood restaurants.', entryFeeINR: 0, coords: { lat: 41.3793, lng: 2.1934 } }
    ],
    cuisine: ['Paella', 'Tapas', 'Patatas Bravas', 'Jamón Ibérico', 'Crema Catalana'],
    localTransportOptions: ['Metro', 'Bus', 'Bicing Bikes', 'Cable Car'],
    bestMonths: [
      { month: 'May', reason: 'Warm and sunny, beach-ready weather.', crowdLevel: 'Medium', priceLevel: 'High', tempRange: '15°C - 23°C' },
      { month: 'June', reason: 'Long summer days, festivals.', crowdLevel: 'High', priceLevel: 'High', tempRange: '18°C - 27°C' },
      { month: 'September', reason: 'Still warm, quieter than peak summer.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '18°C - 27°C' }
    ],
    safetyScore: 7,
    soloTravelerSafety: 7.5,
    womenSafety: 7,
    emergencyContacts: { police: '112', ambulance: '112', touristHelpline: '092', embassy: '+34-91-700-4000' },
    nearestHospitals: [{ name: 'Hospital Clínic Barcelona', phone: '+34-932-27-54-00' }],
    currency: 'EUR',
    countryCode: 'ES',
    tags: ['city', 'beach', 'art', 'nightlife']
  },
  {
    cityName: 'Cape Town',
    country: 'South Africa',
    region: 'Africa',
    coordinates: { lat: -33.9249, lng: 18.4241 },
    avgHotelCost: { budget: 3000, mid: 7000, luxury: 18000 },
    avgFoodCostPerDay: { streetFood: 400, restaurant: 1200 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Table Mountain', type: 'Nature', description: 'Flat-topped mountain with cableway and panoramic views.', entryFeeINR: 1500, coords: { lat: -33.9628, lng: 18.4098 } },
      { name: 'Cape of Good Hope', type: 'Scenic', description: 'Dramatic cliffs at the southwestern tip of Africa.', entryFeeINR: 1200, coords: { lat: -34.3565, lng: 18.4753 } },
      { name: 'Boulders Beach', type: 'Beach', description: 'Home to a colony of endangered African penguins.', entryFeeINR: 700, coords: { lat: -34.1978, lng: 18.451 } },
      { name: 'V&A Waterfront', type: 'Shopping', description: 'Historic harbour with shops, dining and museums.', entryFeeINR: 0, coords: { lat: -33.9063, lng: 18.4216 } }
    ],
    cuisine: ['Biltong', 'Braai (BBQ)', 'Cape Malay Curry', 'Bobotie', 'Wine Tasting'],
    localTransportOptions: ['MyCiTi Bus', 'Ride-share', 'Hop-on Hop-off', 'Metro Rail'],
    bestMonths: [
      { month: 'March', reason: 'Warm end of summer, sunny and dry.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '17°C - 28°C' },
      { month: 'November', reason: 'Spring into summer, beautiful blooms.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '14°C - 24°C' },
      { month: 'December', reason: 'Peak summer, beaches at their best.', crowdLevel: 'High', priceLevel: 'High', tempRange: '16°C - 26°C' }
    ],
    safetyScore: 6.5,
    soloTravelerSafety: 6.5,
    womenSafety: 6.5,
    emergencyContacts: { police: '10111', ambulance: '10177', touristHelpline: '112', embassy: '+27-21-418-9000' },
    nearestHospitals: [{ name: 'Groote Schuur Hospital', phone: '+27-21-404-9111' }],
    currency: 'ZAR',
    countryCode: 'ZA',
    tags: ['nature', 'beach', 'wine', 'adventure']
  },
  {
    cityName: 'Marrakech',
    country: 'Morocco',
    region: 'Africa',
    coordinates: { lat: 31.6295, lng: -7.9811 },
    avgHotelCost: { budget: 2000, mid: 4500, luxury: 12000 },
    avgFoodCostPerDay: { streetFood: 300, restaurant: 900 },
    localTransportCostPerDay: 300,
    attractions: [
      { name: 'Jemaa el-Fnaa', type: 'Market', description: 'Iconic square buzzing with food stalls, performers and markets.', entryFeeINR: 0, coords: { lat: 31.6258, lng: -7.9891 } },
      { name: 'Jardin Majorelle', type: 'Nature', description: 'Striking blue botanical garden once owned by Yves Saint Laurent.', entryFeeINR: 800, coords: { lat: 31.642, lng: -8.0031 } },
      { name: 'Koutoubia Mosque', type: 'Religion', description: 'Landmark mosque with a famous 77m minaret.', entryFeeINR: 0, coords: { lat: 31.6244, lng: -7.9933 } },
      { name: 'Bahia Palace', type: 'Heritage', description: '19th-century palace with ornate courtyards and gardens.', entryFeeINR: 700, coords: { lat: 31.6224, lng: -7.9441 } }
    ],
    cuisine: ['Tagine', 'Couscous', 'Mint Tea', 'Pastilla', 'Moroccan Street Snacks'],
    localTransportOptions: ['Petit Taxis', 'Horse Carriages', 'Walking', 'Grand Taxi'],
    bestMonths: [
      { month: 'March', reason: 'Mild weather, blooming gardens.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '10°C - 23°C' },
      { month: 'April', reason: 'Pleasant spring, ideal for the souks.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '12°C - 26°C' },
      { month: 'November', reason: 'Comfortable autumn, fewer crowds.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '11°C - 23°C' }
    ],
    safetyScore: 6.5,
    soloTravelerSafety: 6,
    womenSafety: 6,
    emergencyContacts: { police: '19', ambulance: '15', touristHelpline: '112', embassy: '+212-537-67-19-00' },
    nearestHospitals: [{ name: 'Mohammed VI Hospital', phone: '+212-524-30-60-00' }],
    currency: 'MAD',
    countryCode: 'MA',
    tags: ['culture', 'markets', 'food', 'heritage']
  },
  {
    cityName: 'Cancun',
    country: 'Mexico',
    region: 'North America',
    coordinates: { lat: 21.1619, lng: -86.8515 },
    avgHotelCost: { budget: 3500, mid: 8000, luxury: 20000 },
    avgFoodCostPerDay: { streetFood: 500, restaurant: 1400 },
    localTransportCostPerDay: 400,
    attractions: [
      { name: 'Chichen Itza', type: 'Heritage', description: 'Legendary Mayan pyramid, one of the New 7 Wonders.', entryFeeINR: 1700, coords: { lat: 20.6843, lng: -88.5678 } },
      { name: 'Tulum Ruins', type: 'Heritage', description: 'Cliff-top Mayan ruins overlooking turquoise waters.', entryFeeINR: 800, coords: { lat: 20.2148, lng: -87.4291 } },
      { name: 'Isla Mujeres', type: 'Beach', description: 'Island escape with beaches, snorkeling and golf carts.', entryFeeINR: 600, coords: { lat: 21.233, lng: -86.7316 } },
      { name: 'Xcaret Park', type: 'Adventure', description: 'Eco-archaeological park with underground rivers.', entryFeeINR: 3500, coords: { lat: 20.5791, lng: -87.1205 } }
    ],
    cuisine: ['Tacos al Pastor', 'Ceviche', 'Guacamole', 'Elote', 'Margaritas'],
    localTransportOptions: ['ADO Buses', 'Taxis', 'Rental Cars', 'Collectivos'],
    bestMonths: [
      { month: 'March', reason: 'Dry, sunny weather with calm seas.', crowdLevel: 'High', priceLevel: 'High', tempRange: '22°C - 30°C' },
      { month: 'May', reason: 'Warm, fewer crowds before hurricane season.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '24°C - 32°C' },
      { month: 'November', reason: 'Post-hurricane-season, pleasant and calm.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '22°C - 30°C' }
    ],
    safetyScore: 6.5,
    soloTravelerSafety: 6.5,
    womenSafety: 6.5,
    emergencyContacts: { police: '911', ambulance: '911', touristHelpline: '078', embassy: '+52-55-5080-2000' },
    nearestHospitals: [{ name: 'Hospital General Cancun', phone: '+52-998-884-1168' }],
    currency: 'MXN',
    countryCode: 'MX',
    tags: ['beach', 'ruins', 'nightlife', 'resort']
  },
  {
    cityName: 'Queenstown',
    country: 'New Zealand',
    region: 'Oceania',
    coordinates: { lat: -45.0312, lng: 168.6626 },
    avgHotelCost: { budget: 4000, mid: 9000, luxury: 22000 },
    avgFoodCostPerDay: { streetFood: 600, restaurant: 1600 },
    localTransportCostPerDay: 500,
    attractions: [
      { name: 'Skyline Gondola & Luge', type: 'Adventure', description: 'Gondola ride with panoramic lake views and downhill luge.', entryFeeINR: 2800, coords: { lat: -45.0325, lng: 168.661 } },
      { name: 'Milford Sound', type: 'Nature', description: 'Majestic fiord with waterfalls and wildlife (day trip).', entryFeeINR: 5500, coords: { lat: -44.6772, lng: 167.9259 } },
      { name: 'Bungee Jumping', type: 'Adventure', description: 'The original Kawarau Bridge bungee, birthplace of the sport.', entryFeeINR: 6000, coords: { lat: -45.0165, lng: 168.8045 } },
      { name: 'Lake Wakatipu', type: 'Scenic', description: 'Long, fjord-like lake encircling Queenstown.', entryFeeINR: 0, coords: { lat: -45.0312, lng: 168.6 } }
    ],
    cuisine: ['Fergburger', 'Lamb', 'Green-lipped Mussels', 'Pavlova', 'Central Otago Wine'],
    localTransportOptions: ['Local Buses', 'Rental Cars', 'Taxis', 'Walking'],
    bestMonths: [
      { month: 'March', reason: 'Mild autumn, clear skies for adventure sports.', crowdLevel: 'Medium', priceLevel: 'Medium', tempRange: '8°C - 19°C' },
      { month: 'December', reason: 'Summer with long, warm days.', crowdLevel: 'High', priceLevel: 'High', tempRange: '11°C - 23°C' },
      { month: 'July', reason: 'Winter ski season at The Remarkables.', crowdLevel: 'High', priceLevel: 'High', tempRange: '-1°C - 8°C' }
    ],
    safetyScore: 9,
    soloTravelerSafety: 9,
    womenSafety: 9,
    emergencyContacts: { police: '111', ambulance: '111', touristHelpline: '111', embassy: '+64-4-473-8481' },
    nearestHospitals: [{ name: 'Lakes District Hospital', phone: '+64-3-441-0015' }],
    currency: 'NZD',
    countryCode: 'NZ',
    tags: ['adventure', 'nature', 'scenic', 'winter']
  }
];

export const routeEstimatesData = [];

// Helper to generate route estimates from major Indian cities
const sourceCities = ['Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore'];

citiesData.forEach((dest) => {
  const isIntl = dest.currency !== 'INR';

  sourceCities.forEach((src) => {
    // Skip if source is same as destination
    if (src.toLowerCase() === dest.cityName.toLowerCase()) return;

    if (isIntl) {
      // International gets Flight estimate
      routeEstimatesData.push({
        source: src,
        destination: dest.cityName,
        mode: 'flight',
        avgCostRange: {
          min: dest.cityName === 'Colombo' || dest.cityName === 'Bangkok' ? 8000 : 15000,
          max: dest.cityName === 'Paris' ? 30000 : 25000
        },
        avgDurationHrs: dest.cityName === 'Paris' ? 10 : 4,
        bookingLink: 'https://www.google.com/flights'
      });
    } else {
      // Domestic gets Train and Flight estimates
      // Flight
      routeEstimatesData.push({
        source: src,
        destination: dest.cityName,
        mode: 'flight',
        avgCostRange: { min: 3500, max: 7000 },
        avgDurationHrs: 2,
        bookingLink: 'https://www.google.com/flights'
      });

      // Train
      routeEstimatesData.push({
        source: src,
        destination: dest.cityName,
        mode: 'train',
        avgCostRange: { min: 800, max: 2000 },
        avgDurationHrs: 18,
        bookingLink: 'https://www.irctc.co.in'
      });

      // Bus (if close enough - approximate rule: let's seed bus for some routes)
      if (
        (src === 'Mumbai' && dest.cityName === 'Goa') ||
        (src === 'Delhi' && (dest.cityName === 'Manali' || dest.cityName === 'Jaipur' || dest.cityName === 'Rishikesh')) ||
        (src === 'Bangalore' && dest.cityName === 'Coorg')
      ) {
        routeEstimatesData.push({
          source: src,
          destination: dest.cityName,
          mode: 'bus',
          avgCostRange: { min: 500, max: 1200 },
          avgDurationHrs: 8,
          bookingLink: 'https://www.redbus.in'
        });
      }
    }
  });
});
