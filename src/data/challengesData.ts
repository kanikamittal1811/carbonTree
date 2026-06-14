export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string; // Lucide icon name
  color: string;
  gradient: string;
}

export interface Challenge {
  id: string;
  categoryId: 'energy' | 'transport' | 'food' | 'lifestyle';
  title: string;
  description: string;
  badge: Badge;
  days: string[]; // Exactly 7 items
  baseFollowers: number;
}

export const CHALLENGES: Challenge[] = [
  // --- HOME & ENERGY (3 challenges) ---
  {
    id: 'eco-thermostat',
    categoryId: 'energy',
    title: 'Eco Thermostat Warrior',
    description: 'Optimize heating and cooling habits to slash your home electricity footprint.',
    baseFollowers: 1243,
    badge: {
      id: 'badge-thermostat-hero',
      title: 'Thermostat Hero',
      description: 'Awarded for maintaining optimal heating/cooling efficiency for 7 consecutive days.',
      icon: 'Thermometer',
      color: '#4cae4f', gradient: 'linear-gradient(135deg, #3d8c40 0%, #4cae4f 100%)',
    },
    days: [
      'Turn down heater by 1°C (or raise AC by 1°C) to ease baseline climate control strain.',
      'Turn off heating or cooling completely when leaving your home for more than an hour.',
      'Use heavy curtains or blinds to naturally insulate your living space from outside temperatures.',
      'Wear layers or dress lighter to adjust to ambient temperatures instead of using HVAC.',
      'Spend at least 3 hours with windows open for natural ventilation instead of running HVAC.',
      'Check for air drafts around outer doors or window frames and apply basic seals.',
      'Keep your thermostat on "Eco mode" all day and overnight to solidfy your energy habits.',
    ],
  },
  {
    id: 'phantom-load',
    categoryId: 'energy',
    title: 'Phantom Load Slayer',
    description: 'Eliminate standby power drawn by idle home electronics and appliances.',
    baseFollowers: 852,
    badge: {
      id: 'badge-vampire-hunter',
      title: 'Vampire Power Hunter',
      description: 'Awarded for routing out standby power and unplugging energy leaks.',
      icon: 'Plug',
      color: '#3d8c40', gradient: 'linear-gradient(135deg, #2b612d 0%, #3d8c40 100%)',
    },
    days: [
      'Unplug chargers from sockets once your devices (phones, laptops) are fully charged.',
      'Shut off the main power strip for your TV, console, and media center overnight.',
      'Power off your computer monitor, printer, and accessories completely at the end of the day.',
      'Identify 3 kitchen appliances that stay on standby (e.g. coffee maker) and unplug them.',
      'Unplug unused guest room devices and chargers that sit in standby mode indefinitely.',
      'Do a "standby blackout" hour: turn off all standby devices and read or talk in warm lighting.',
      'Do a full sweep of your house before sleeping to make sure zero vampire loads remain active.',
    ],
  },
  {
    id: 'solar-spark',
    categoryId: 'energy',
    title: 'Solar Peak Spark',
    description: 'Time your heavy appliance runs with peak renewable energy hours.',
    baseFollowers: 560,
    badge: {
      id: 'badge-solar-champ',
      title: 'Solar Champ',
      description: 'Awarded for aligning laundry and kitchen tasks with clean daylight energy.',
      icon: 'Sun',
      color: '#8bc34b', gradient: 'linear-gradient(135deg, #6b9e32 0%, #8bc34b 100%)',
    },
    days: [
      'Run your washing machine or dishwasher strictly during solar peak hours (11 AM - 3 PM).',
      'Charge all your power banks and battery-operated electronics during high-daylight hours.',
      'Use a low-energy air fryer or microwave instead of a high-draw oven for hot meals today.',
      'Air-dry your clothes on a line or rack instead of running the high-draw dryer.',
      'Avoid running high-energy appliances during the evening grid peak (6 PM - 9 PM).',
      'Wash your clothes on a cold cycle (save 90% of washing machine energy used for heating water).',
      'Complete all electrical cooking and laundry tasks before dusk to rely fully on clean daytime energy.',
    ],
  },

  // --- TRANSPORT & TRAVEL (3 challenges) ---
  {
    id: 'active-commute',
    categoryId: 'transport',
    title: 'Active Commute Champion',
    description: 'Ditch vehicle keys and embrace active walking, cycling, or running.',
    baseFollowers: 2105,
    badge: {
      id: 'badge-pedal-power',
      title: 'Pedal Power',
      description: 'Awarded for trading petrol trips for pure muscle-powered transport.',
      icon: 'Bike',
      color: '#8bc34b', gradient: 'linear-gradient(135deg, #6b9e32 0%, #8bc34b 100%)',
    },
    days: [
      'Walk or bicycle for any short trip under 2 kilometers instead of driving.',
      'Take the stairs instead of the elevator or escalator for all trips today.',
      'Ride a bike, use a scooter, or walk to run a local chore or errand.',
      'Dedicate 30 minutes to walking outdoors for transit or exercise instead of a short drive.',
      'Plan and test an active route from your home to a regular work/social venue.',
      'Walk to your local grocery store to buy small items instead of ordering home delivery.',
      'Cover a cumulative distance of at least 5 km today by foot or bicycle.',
    ],
  },
  {
    id: 'transit-explorer',
    categoryId: 'transport',
    title: 'Transit Explorer',
    description: 'Optimize travel emissions by choosing trains, metros, buses, or carpools.',
    baseFollowers: 1420,
    badge: {
      id: 'badge-metro-pioneer',
      title: 'Metro Pioneer',
      description: 'Awarded for navigating daily routes using high-efficiency public transit networks.',
      icon: 'Train',
      color: '#cbdc38', gradient: 'linear-gradient(135deg, #99a626 0%, #cbdc38 100%)',
    },
    days: [
      'Locate your nearest public transport stops and look up schedules/routes online.',
      'Take public transport (bus, tram, metro, or train) for your primary commute trip today.',
      'Walk to the public transit hub rather than catching a taxi or driving there.',
      'Use your public transit time productively to read, listen to a podcast, or plan your week.',
      'Set up a carpool with a coworker or friend for a shared journey today.',
      'Use a combination of public transit and walking to travel to a weekend leisure spot.',
      'Execute a trip to a brand new location entirely using public transport networks.',
    ],
  },
  {
    id: 'eco-driver',
    categoryId: 'transport',
    title: 'Eco-Driver Mastery',
    description: 'Apply smart, fuel-saving driving techniques to optimize your car emissions.',
    baseFollowers: 689,
    badge: {
      id: 'badge-fuel-saver',
      title: 'Fuel Saver',
      description: 'Awarded for practicing fuel-efficient driving habits and car maintenance.',
      icon: 'Gauge',
      color: '#99a626', gradient: 'linear-gradient(135deg, #717c18 0%, #99a626 100%)',
    },
    days: [
      'Check your car\'s tire pressure (under-inflated tires increase rolling resistance and fuel use).',
      'Keep your highway cruising speed strictly under 100 km/h to optimize aerodynamics.',
      'Turn off your engine during any traffic delays or idles longer than 30 seconds.',
      'Practice smooth, progressive acceleration and gentle braking (saves up to 20% on fuel).',
      'Clean out heavy cargo or unnecessary items from your trunk to reduce vehicle weight.',
      'Consolidate multiple errands into a single, well-routed trip to avoid cold engine starts.',
      'Keep your car windows closed on the highway and rely on cabin vents to minimize drag.',
    ],
  },

  // --- FOOD & DIET (3 challenges) ---
  {
    id: 'plant-powered',
    categoryId: 'food',
    title: 'Plant-Powered Week',
    description: 'Transition your meals to delicious, low-impact plant-based foods.',
    baseFollowers: 3102,
    badge: {
      id: 'badge-green-plate',
      title: 'Green Plate',
      description: 'Awarded for exploring plant-based nutrition and avoiding heavy livestock carbon.',
      icon: 'Utensils',
      color: '#8bc34b', gradient: 'linear-gradient(135deg, #6b9e32 0%, #8bc34b 100%)',
    },
    days: [
      'Have a fully plant-based (vegan) lunch today using grains, beans, and fresh vegetables.',
      'Swap dairy milk for a low-impact plant alternative (oat, soy, almond) in your coffee or tea.',
      'Cook a completely vegetarian dinner for yourself or family from raw ingredients.',
      'Read about the carbon comparisons of beef versus plant proteins (like lentils and tofu).',
      'Replace dairy cheese or butter with plant-based spreads on your toast or cooking.',
      'Eat 100% plant-based (vegan) for all meals, snacks, and drinks today.',
      'Share a delicious plant-based meal or recipe with a friend or colleague.',
    ],
  },
  {
    id: 'zero-waste-kitchen',
    categoryId: 'food',
    title: 'Zero Waste Kitchen',
    description: 'Reduce kitchen food waste through smart meal planning and creative recipes.',
    baseFollowers: 1980,
    badge: {
      id: 'badge-compost-king',
      title: 'Compost King',
      description: 'Awarded for managing a zero-food-waste kitchen and composting scraps.',
      icon: 'Trash2',
      color: '#ffec3d', gradient: 'linear-gradient(135deg, #cca600 0%, #ffec3d 100%)',
    },
    days: [
      'Audit your refrigerator and make a meal plan specifically using expiring ingredients.',
      'Store your herbs and green vegetables in water or airtight wrap to extend their life.',
      'Cook a creative "leftovers meal" using only ingredients already opened or prepared.',
      'Collect and compost all organic kitchen scraps (peels, grounds) instead of throwing them away.',
      'Freeze excess bread, fruit, or leftovers before they have a chance to spoil.',
      'Measure and cook precise portions today to eliminate plate waste.',
      'Complete the entire day without throwing any edible food into the rubbish bin.',
    ],
  },
  {
    id: 'locavore-harvest',
    categoryId: 'food',
    title: 'Locavore Harvest',
    description: 'Support local farming and seasonal items to bypass heavy transport miles.',
    baseFollowers: 1145,
    badge: {
      id: 'badge-local-harvest',
      title: 'Local Harvest',
      description: 'Awarded for shopping locally and sourcing seasonal, low-travel foods.',
      icon: 'Sprout',
      color: '#8bc34b', gradient: 'linear-gradient(135deg, #4cae4f 0%, #8bc34b 100%)',
    },
    days: [
      'Research which vegetables and fruits are currently in season locally in your region.',
      'Purchase 3 produce ingredients sourced from farms within 100 km of your home.',
      'Avoid buying pre-packaged or processed foods that require heavy industrial shipping.',
      'Visit a local farmer\'s market, green grocer, or organic farm stand to do your shop.',
      'Make a meal where the main carbohydrates (potatoes, grain) are grown in your country.',
      'Prepare a meal entirely from scratch using local, seasonal, unrefined ingredients.',
      'Plant a small kitchen herb or vegetable seed to start growing your own food.',
    ],
  },

  // --- LIFESTYLE & WASTE (3 challenges) ---
  {
    id: 'plastic-liberator',
    categoryId: 'lifestyle',
    title: 'Zero-Single-Use Quest',
    description: 'Banish single-use plastics and packaging from your daily consumption.',
    baseFollowers: 2890,
    badge: {
      id: 'badge-plastic-liberator',
      title: 'Plastic Liberator',
      description: 'Awarded for avoiding single-use plastics and adopting durable reusables.',
      icon: 'ShoppingBag',
      color: '#ffc105', gradient: 'linear-gradient(135deg, #cc9a00 0%, #ffc105 100%)',
    },
    days: [
      'Bring reusable fabric bags for all of your purchases and shopping trips today.',
      'Say "no straw" and "no plastic cutlery" when ordering any takeaway drink or food.',
      'Carry and use a reusable water bottle and thermal coffee flask all day.',
      'Store leftover food in reusable glass or beeswax wrappers instead of plastic cling wrap.',
      'Shop for loose fruit and veg (no plastic sleeve bags) at the supermarket today.',
      'Swap out your plastic kitchen cleaning sponge for a biodegradable wooden dish brush.',
      'Go a full 24 hours without acquiring a single piece of single-use plastic waste.',
    ],
  },
  {
    id: 'thrift-legend',
    categoryId: 'lifestyle',
    title: 'Circular Fashion & Gear',
    description: 'Slow down consumerism by choosing repairs, second-hand items, and thrift options.',
    baseFollowers: 1450,
    badge: {
      id: 'badge-thrift-legend',
      title: 'Thrift Legend',
      description: 'Awarded for supporting circular shopping, repairing gear, and limiting raw purchases.',
      icon: 'Sparkles',
      color: '#ffec3d', gradient: 'linear-gradient(135deg, #cca600 0%, #ffec3d 100%)',
    },
    days: [
      'De-clutter 5 items of clothing or gear and place them in a donation or resale pile.',
      'Unsubscribe from 3 retail or online store newsletters that tempt you with fast consumption.',
      'Mend a loose button, stitch up a torn seam, or clean up an old pair of shoes.',
      'Browse local second-hand shops or online listings (like eBay/Depop) instead of buying new.',
      'Read about the heavy water and carbon footprint of manufacturing a single cotton t-shirt.',
      'Go the whole day without purchasing any non-essential new manufactured items.',
      'Find a creative way to repurpose an empty glass jar or box for household storage.',
    ],
  },
  {
    id: 'cloud-guardian',
    categoryId: 'lifestyle',
    title: 'Digital Eco Clean-up',
    description: 'Clean up unnecessary cloud databases and digital junk to reduce server power.',
    baseFollowers: 785,
    badge: {
      id: 'badge-cloud-guardian',
      title: 'Cloud Guardian',
      description: 'Awarded for reducing your digital carbon footprint by auditing servers and cloud logs.',
      icon: 'Cloud',
      color: '#ffc105', gradient: 'linear-gradient(135deg, #b38600 0%, #ffc105 100%)',
    },
    days: [
      'Delete 100 old, useless emails and unsubscribe from mailing lists you do not read.',
      'Empty the "Trash", "Spam", and "Archived" folders in your email accounts to clear server space.',
      'Clear 2 gigabytes of duplicate photos, large videos, or redundant backups in the cloud.',
      'Turn off video auto-play on streaming services (saving massive amounts of server streaming power).',
      'Shut down your home Wi-Fi router and devices fully before going to bed tonight.',
      'Audit your mobile apps and uninstall 5 apps that continuously run background data sync.',
      'Clean up your cloud desktop, document logs, and set automatic cleanups for local files.',
    ],
  },
];
