import { QUESTIONS, AnswersState } from '../data/questions';

export interface CategoryBreakdown {
  energy: number;
  transport: number;
  food: number;
  lifestyle: number;
}

export interface CalculationResult {
  breakdown: CategoryBreakdown;
  totalCO2: number; // in kg CO2/year
  treesCut: number; // number of trees cut per year equivalent
  averageComparison: number; // percentage of average (e.g. 5000 kg is average global)
}

// Global baseline: average global footprint is ~5000 kg CO2 / year. 
// A mature tree absorbs 22 kg of CO2 / year.
export const TREE_ABSORPTION_FACTOR = 22; 
export const GLOBAL_AVERAGE_FOOTPRINT = 5000; 

export function calculateCarbonFootprint(answers: AnswersState): CalculationResult {
  // 1. ENERGY CATEGORY
  const housingTypeBase = getOptionImpact('housing-type', answers['housing-type'] as string);
  const householdSizeMult = getOptionImpact('household-size', answers['household-size'] as string);
  const heatingAcMult = getSliderMultiplier('heating-ac-usage', answers['heating-ac-usage'] as number);
  const isRenewable = answers['renewable-energy'] as boolean;
  const renewableMult = getToggleMultiplier('renewable-energy');

  const energyCO2 = Math.round(
    housingTypeBase * 
    householdSizeMult * 
    heatingAcMult * 
    (isRenewable ? renewableMult : 1.0)
  );

  // 2. TRANSPORT CATEGORY
  const commuteBase = getOptionImpact('commute-mode', answers['commute-mode'] as string);
  const commuteMult = getSliderMultiplier('commute-time', answers['commute-time'] as number);
  const flightsBase = getOptionImpact('flights', answers['flights'] as string);

  const transportCO2 = Math.round((commuteBase * commuteMult) + flightsBase);

  // 3. FOOD CATEGORY
  const dietBase = getOptionImpact('diet-type', answers['diet-type'] as string);
  const foodWasteMult = getSliderMultiplier('food-waste', answers['food-waste'] as number);

  const foodCO2 = Math.round(dietBase * foodWasteMult);

  // 4. LIFESTYLE & WASTE CATEGORY
  const shoppingBase = getOptionImpact('shopping-spending', answers['shopping-spending'] as string);
  const recyclingOffset = getOptionImpact('recycling-habits', answers['recycling-habits'] as string);

  const lifestyleCO2 = Math.max(100, Math.round(shoppingBase + recyclingOffset));

  // AGGREGATE RESULTS
  const totalCO2 = Math.max(300, energyCO2 + transportCO2 + foodCO2 + lifestyleCO2);
  const treesCut = Math.round(totalCO2 / TREE_ABSORPTION_FACTOR);
  
  // Percentage of global average footprint
  const averageComparison = Math.round((totalCO2 / GLOBAL_AVERAGE_FOOTPRINT) * 100);

  return {
    breakdown: {
      energy: energyCO2,
      transport: transportCO2,
      food: foodCO2,
      lifestyle: lifestyleCO2
    },
    totalCO2,
    treesCut,
    averageComparison
  };
}

// Helpers
function getOptionImpact(questionId: string, optionValue: string): number {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question || !question.options) return 0;
  const option = question.options.find(o => o.value === optionValue);
  return option ? option.impact : 0;
}

function getSliderMultiplier(questionId: string, sliderIndex: number): number {
  const question = QUESTIONS.find(q => q.id === questionId);
  if (!question || !question.sliderOptions) return 1.0;
  const option = question.sliderOptions[sliderIndex];
  return option ? option.impactMultiplier : 1.0;
}

function getToggleMultiplier(questionId: string): number {
  const question = QUESTIONS.find(q => q.id === questionId);
  return question && question.toggleImpactMultiplier !== undefined ? question.toggleImpactMultiplier : 1.0;
}
