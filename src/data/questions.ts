export interface AnswersState {
  [questionId: string]: string | number | boolean;
}

export interface SelectOption {
  value: string;
  label: string;
  description: string;
  icon: string; // Lucide icon name
  impact: number; // base carbon impact in kg CO2/year
}

export interface SliderOption {
  label: string;
  impactMultiplier: number;
}

export interface Question {
  id: string;
  category: 'energy' | 'transport' | 'food' | 'lifestyle';
  title: string;
  description: string;
  type: 'select' | 'slider' | 'toggle';
  // Optional based on type
  options?: SelectOption[];
  sliderOptions?: SliderOption[];
  toggleLabel?: string;
  toggleImpactMultiplier?: number; // e.g. 0.15 for renewable (means 85% reduction, multiplier of 0.15)
  defaultValue: string | number | boolean;
}

export interface Category {
  id: 'energy' | 'transport' | 'food' | 'lifestyle';
  title: string;
  icon: string;
  color: string;
  gradient: string;
}

export const CATEGORIES: Category[] = [
  {
    id: 'energy',
    title: 'Home & Energy',
    icon: 'Home',
    color: '#4cae4f',
    gradient: 'linear-gradient(135deg, #3d8c40 0%, #4cae4f 100%)',
  },
  {
    id: 'transport',
    title: 'Transport & Travel',
    icon: 'Car',
    color: '#8bc34b',
    gradient: 'linear-gradient(135deg, #6b9e32 0%, #8bc34b 100%)',
  },
  {
    id: 'food',
    title: 'Food & Diet',
    icon: 'Utensils',
    color: '#cbdc38',
    gradient: 'linear-gradient(135deg, #99a626 0%, #cbdc38 100%)',
  },
  {
    id: 'lifestyle',
    title: 'Lifestyle & Waste',
    icon: 'ShoppingBag',
    color: '#ffc105',
    gradient: 'linear-gradient(135deg, #cc9a00 0%, #ffc105 100%)',
  },
];

export const QUESTIONS: Question[] = [
  // --- Category 1: Energy ---
  {
    id: 'housing-type',
    category: 'energy',
    title: 'What type of home do you live in?',
    description: 'The size and structure of your home plays a major role in heating, cooling, and power needs.',
    type: 'select',
    defaultValue: 'apartment',
    options: [
      {
        value: 'apartment',
        label: 'Apartment / Condo',
        description: 'Compact space, shared walls retain heat efficiently.',
        icon: 'Building2',
        impact: 1200,
      },
      {
        value: 'townhouse',
        label: 'Townhouse / Duplex',
        description: 'Medium size, shared walls on sides.',
        icon: 'Building',
        impact: 2200,
      },
      {
        value: 'detached',
        label: 'Single-Family House',
        description: 'Standard stand-alone home with yard.',
        icon: 'Home',
        impact: 4000,
      },
      {
        value: 'villa',
        label: 'Large Villa / Mansion',
        description: 'Spacious, high ceilings, large heating footprint.',
        icon: 'Castle',
        impact: 6500,
      },
    ],
  },
  {
    id: 'household-size',
    category: 'energy',
    title: 'How many people live in your household?',
    description: 'Shared utilities divide the total footprint. Single occupants consume more energy per capita.',
    type: 'select',
    defaultValue: '2-people',
    options: [
      {
        value: 'alone',
        label: 'Living Alone',
        description: 'You carry the full energy burden of the home.',
        icon: 'User',
        impact: 1.0, // multiplier
      },
      {
        value: '2-people',
        label: '2 People',
        description: 'Shared energy splits overheads partially.',
        icon: 'Users',
        impact: 0.65, // multiplier
      },
      {
        value: '3-4-people',
        label: '3–4 People',
        description: 'Family or shared space, high utility efficiency.',
        icon: 'Users2',
        impact: 0.48, // multiplier
      },
      {
        value: '5-plus',
        label: '5+ People',
        description: 'Highly shared space, minimal individual energy share.',
        icon: 'Flame', // Custom or alternative group icon
        impact: 0.35, // multiplier
      },
    ],
  },
  {
    id: 'heating-ac-usage',
    category: 'energy',
    title: 'How intense is your heating & cooling usage?',
    description: 'HVAC is typically the single largest driver of residential electricity and gas use.',
    type: 'slider',
    defaultValue: 1, // index of options
    sliderOptions: [
      { label: 'Eco / Minimal (Rarely run heater/AC, set high in summer)', impactMultiplier: 0.65 },
      { label: 'Moderate / Seasonal (Only run in peak cold/hot months)', impactMultiplier: 1.0 },
      { label: 'Comfort / Continuous (Always keep temperature perfectly adjusted)', impactMultiplier: 1.45 },
    ],
  },
  {
    id: 'renewable-energy',
    category: 'energy',
    title: 'Do you use green energy in your home?',
    description: 'Using solar panels or purchasing green tariffs from your utility provider overrides fossil fuel power.',
    type: 'toggle',
    defaultValue: false,
    toggleLabel: 'We use solar power / 100% green energy tariffs',
    toggleImpactMultiplier: 0.15, // 85% carbon reduction in home electricity/heat footprint
  },

  // --- Category 2: Transport ---
  {
    id: 'commute-mode',
    category: 'transport',
    title: 'How do you usually commute or travel locally?',
    description: 'Your chosen daily mode of travel has a compounding weekly impact on fuel emissions.',
    type: 'select',
    defaultValue: 'public',
    options: [
      {
        value: 'active',
        label: 'Walk / Bike / Run',
        description: 'Zero direct fuel burning, pure active travel.',
        icon: 'Bike',
        impact: 0,
      },
      {
        value: 'public',
        label: 'Public Transit',
        description: 'Buses, trains, subways share emissions over hundreds.',
        icon: 'Train',
        impact: 420,
      },
      {
        value: 'electric-car',
        label: 'Electric Vehicle (EV)',
        description: 'Charged from grid power, clean local operations.',
        icon: 'Zap',
        impact: 750,
      },
      {
        value: 'hybrid-car',
        label: 'Hybrid Vehicle',
        description: 'Petrol-electric combo, efficient mileage.',
        icon: 'Gauge',
        impact: 1600,
      },
      {
        value: 'petrol-car',
        label: 'Petrol / Diesel Car',
        description: 'Standard internal combustion engine, high fuel burn.',
        icon: 'Car',
        impact: 3800,
      },
    ],
  },
  {
    id: 'commute-time',
    category: 'transport',
    title: 'How much time do you spend commuting weekly?',
    description: 'Adapts your commute mode selection based on total time spent in traffic.',
    type: 'slider',
    defaultValue: 1, // Average index
    sliderOptions: [
      { label: 'Occasional (Under 3 hours / week)', impactMultiplier: 0.45 },
      { label: 'Average (3 – 12 hours / week)', impactMultiplier: 1.0 },
      { label: 'Heavy Commuter (12 – 25 hours / week)', impactMultiplier: 1.85 },
      { label: 'Road Warrior (25+ hours / week)', impactMultiplier: 2.75 },
    ],
  },
  {
    id: 'flights',
    category: 'transport',
    title: 'How often do you take flights?',
    description: 'Aviation creates high-altitude emissions that carry multiple times the warming power of ground carbon.',
    type: 'select',
    defaultValue: 'rarely',
    options: [
      {
        value: 'rarely',
        label: 'Rarely / Never',
        description: 'Only ground travel, or flight once in a few years.',
        icon: 'PlaneX',
        impact: 0,
      },
      {
        value: 'occasional',
        label: '1–2 Short Flights / year',
        description: 'Typical holiday or domestic business trips.',
        icon: 'Compass',
        impact: 600,
      },
      {
        value: 'frequent-short',
        label: '3–6 Short Flights / year',
        description: 'Frequent domestic hop-overs or short getaways.',
        icon: 'PlaneTakeoff',
        impact: 1800,
      },
      {
        value: 'long-haul',
        label: 'Long-Haul International Flights',
        description: 'At least 1-2 major trans-oceanic roundtrips per year.',
        icon: 'Globe',
        impact: 4800,
      },
    ],
  },

  // --- Category 3: Diet & Food ---
  {
    id: 'diet-type',
    category: 'food',
    title: 'Which of these best describes your eating habits?',
    description: 'Food production (especially livestock) represents up to a quarter of global greenhouse emissions.',
    type: 'select',
    defaultValue: 'average-meat',
    options: [
      {
        value: 'vegan',
        label: '100% Plant-Based (Vegan)',
        description: 'Zero meat, dairy, or animal product footprints.',
        icon: 'Leaf',
        impact: 650,
      },
      {
        value: 'vegetarian',
        label: 'Vegetarian',
        description: 'No meat, but consumes dairy, eggs, and cheese.',
        icon: 'Salad',
        impact: 1250,
      },
      {
        value: 'flexitarian',
        label: 'Flexitarian / Low-Meat',
        description: 'Mostly plant-based, eat meat occasionally.',
        icon: 'Fish',
        impact: 1750,
      },
      {
        value: 'average-meat',
        label: 'Average Meat Eater',
        description: 'Balanced diet, chicken/pork/beef a few times a week.',
        icon: 'Beef',
        impact: 2600,
      },
      {
        value: 'heavy-meat',
        label: 'Meat Lover / High-Beef',
        description: 'Eat red meat (beef, lamb) or poultry daily.',
        icon: 'FlameKindling',
        impact: 3900,
      },
    ],
  },
  {
    id: 'food-waste',
    category: 'food',
    title: 'How would you describe your food sourcing and waste habits?',
    description: 'Organic farming, local sourcing, and planning meals to avoid spoilage can lower diet impact.',
    type: 'slider',
    defaultValue: 1, // Average
    sliderOptions: [
      { label: 'Eco-conscious (Buy organic/local, zero waste composting)', impactMultiplier: 0.75 },
      { label: 'Average (Supermarket shop, some leftovers thrown out)', impactMultiplier: 1.0 },
      { label: 'High-waste (Pre-packaged meals, discard uneaten food often)', impactMultiplier: 1.35 },
    ],
  },

  // --- Category 4: Lifestyle & Spending ---
  {
    id: 'shopping-spending',
    category: 'lifestyle',
    title: 'What are your retail and shopping habits?',
    description: 'Manufacturing clothes, electronics, and goods creates heavy industrial supply chain emissions.',
    type: 'select',
    defaultValue: 'average-shopper',
    options: [
      {
        value: 'minimalist',
        label: 'Minimalist / Second-Hand',
        description: 'Only buy essentials, repair items, prefer thrift shops.',
        icon: 'Sparkles',
        impact: 450,
      },
      {
        value: 'average-shopper',
        label: 'Average Consumer',
        description: 'Occasional fashion/tech shopping as needed.',
        icon: 'ShoppingBag',
        impact: 1400,
      },
      {
        value: 'enthusiast',
        label: 'Trend Follower / High-Spender',
        description: 'Regular online deliveries, fast fashion, annual tech upgrades.',
        icon: 'ShoppingBag', // or PackageOpen / CreditCard
        impact: 3200,
      },
    ],
  },
  {
    id: 'recycling-habits',
    category: 'lifestyle',
    title: 'What are your recycling and sorting habits?',
    description: 'Diverting materials from landfills cuts down on methane and heavy manufacturing impacts.',
    type: 'select',
    defaultValue: 'recycle-some',
    options: [
      {
        value: 'recycle-all',
        label: 'Recycle Everything',
        description: 'Compost organic waste, recycle plastic, paper, and glass.',
        icon: 'Recycle',
        impact: -350, // negative footprint offset
      },
      {
        value: 'recycle-some',
        label: 'Recycle Selectively',
        description: 'Recycle plastics and cardboard, trash the rest.',
        icon: 'Package',
        impact: -100, // smaller offset
      },
      {
        value: 'no-recycle',
        label: 'No Recycling',
        description: 'All waste goes directly to the landfill.',
        icon: 'Trash2',
        impact: 0,
      },
    ],
  },
];
