// Canonical list of destinations Voyago recognizes as real, bookable cities.
// Used to filter Surprise Me / Check Budget results so junk CityData docs
// created from partial user inputs (e.g. "da", "Mos") never appear.
// Kept in sync with client/src/data/cities.js.
export const validDestinationCities = [
  // India
  'Delhi', 'Mumbai', 'Kolkata', 'Chennai', 'Bangalore', 'Hyderabad', 'Pune', 'Ahmedabad', 'Goa',
  'Manali', 'Jaipur', 'Udaipur', 'Jodhpur', 'Varanasi', 'Rishikesh', 'Haridwar', 'Agra', 'Darjeeling',
  'Andaman Islands', 'Lakshadweep', 'Coorg', 'Munnar', 'Alleppey', 'Kochi', 'Mysore', 'Ooty',
  'Pondicherry', 'Gangtok', 'Leh', 'Ladakh', 'Srinagar', 'Gulmarg', 'Shimla', 'Amritsar',
  'Ranthambore', 'Khajuraho', 'Hampi', 'Madurai', 'Kodaikanal', 'Dharamshala', 'Spiti Valley',
  'Nainital', 'Mussoorie', 'Kaziranga', 'Aurangabad', 'Bodh Gaya', 'Tirupati', 'Daman',
  'Diu', 'Bikaner', 'Jaisalmer', 'Mount Abu', 'Tawang', 'Chandigarh', 'Rann of Kutch',
  // Southeast Asia
  'Bangkok', 'Phuket', 'Chiang Mai', 'Bali', 'Jakarta', 'Yogyakarta', 'Kuala Lumpur', 'Langkawi',
  'Singapore', 'Hanoi', 'Ho Chi Minh City', 'Vietnam', 'Manila', 'Cebu', 'Phnom Penh', 'Angkor Wat',
  'Luang Prabang', 'Yangon', 'Maldives', 'Sri Lanka', 'Colombo', 'Kandy',
  // East Asia
  'Tokyo', 'Kyoto', 'Osaka', 'Fukuoka', 'Hokkaido', 'Seoul', 'Busan', 'Jeju Island', 'Beijing',
  'Shanghai', 'Hong Kong', 'Taipei', 'Guangzhou', 'Chengdu', 'Xian', 'Shenzhen',
  // Middle East & Central Asia
  'Dubai', 'Abu Dhabi', 'Doha', 'Doha Qatar', 'Muscat', 'Tel Aviv', 'Jerusalem', 'Amman', 'Petra',
  'Riyadh', 'Jeddah', 'Kuwait City', 'Manama', 'Istanbul', 'Cappadocia', 'Antalya', 'Tbilisi',
  'Baku', 'Tashkent', 'Samarkand', 'Almaty', 'Bishkek',
  // Europe
  'Paris', 'London', 'Edinburgh', 'Manchester', 'Barcelona', 'Madrid', 'Seville', 'Rome', 'Milan',
  'Venice', 'Florence', 'Naples', 'Amalfi Coast', 'Santorini', 'Athens', 'Mykonos', 'Lisbon',
  'Porto', 'Zurich', 'Geneva', 'Zermatt', 'Interlaken', 'Vienna', 'Salzburg', 'Prague', 'Budapest',
  'Berlin', 'Munich', 'Frankfurt', 'Amsterdam', 'Rotterdam', 'Brussels', 'Bruges', 'Copenhagen',
  'Stockholm', 'Oslo', 'Bergen', 'Helsinki', 'Reykjavik', 'Dublin', 'Dubrovnik',
  'Krakow', 'Warsaw', 'Bucharest', 'Sofia', 'Belgrade', 'Moscow', 'Saint Petersburg',
  'Kyiv', 'Lviv', 'Tallinn', 'Riga', 'Vilnius', 'Nice', 'Monaco', 'Marseille', 'Lyon', 'Cannes',
  'Zagreb', 'Ljubljana', 'Valletta',
  // Africa
  'Cairo', 'Giza', 'Luxor', 'Marrakech', 'Fes', 'Casablanca', 'Cape Town', 'Johannesburg',
  'Durban', 'Victoria Falls', 'Zanzibar', 'Nairobi', 'Mombasa', 'Serengeti', 'Kruger National Park',
  'Dakar', 'Accra', 'Lagos', 'Addis Ababa', 'Sharm El Sheikh', 'Tunis',
  // North America
  'New York', 'Los Angeles', 'San Francisco', 'Las Vegas', 'Miami', 'Chicago', 'Seattle', 'Boston',
  'Washington D.C.', 'Orlando', 'New Orleans', 'San Diego', 'Phoenix', 'Denver', 'Portland',
  'Honolulu', 'Hawaii', 'Yellowstone', 'Grand Canyon', 'Niagara Falls', 'Toronto', 'Vancouver',
  'Montreal', 'Quebec City', 'Banff', 'Whistler', 'Cancun', 'Tulum', 'Mexico City', 'Oaxaca',
  'Puerto Vallarta', 'San Juan', 'Havana', 'Panama City', 'San Jose', 'Guatemala City',
  // South America
  'Rio de Janeiro', 'Sao Paulo', 'Buenos Aires', 'Bogota', 'Lima', 'Cusco', 'Machu Picchu',
  'Santiago', 'Quito', 'Galapagos Islands', 'Medellin', 'Cartagena', 'Montevideo', 'La Paz',
  'Ushuaia', 'Iguazu Falls', 'Salar de Uyuni',
  // Oceania
  'Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Gold Coast', 'Cairns', 'Great Barrier Reef',
  'Uluru', 'Auckland', 'Queenstown', 'Wellington', 'Christchurch', 'Fiji', 'Tahiti', 'Bora Bora',
  'New Caledonia', 'Vanuatu', 'Samoa', 'Tonga',
];

// Also include the seeded 32 destinations (subset of the list above).
export const isValidDestination = (name) => {
  if (!name) return false;
  const n = String(name).trim();
  if (n.length < 3) return false;
  return validDestinationCities.some((c) => c.toLowerCase() === n.toLowerCase());
};
