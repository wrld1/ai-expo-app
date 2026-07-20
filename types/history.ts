export type AnalysisConfidence = "low" | "medium" | "high";
export type AnalysisWarning =
  | "poor_image_quality"
  | "multiple_dishes"
  | "hidden_ingredients"
  | "weight_estimation_uncertain"
  | "not_food";

export type Likelihood = "possible" | "likely" | "certain";

export interface AllergyAlert {
  allergen: string;
  label: string;
  likelihood: Likelihood;
  matchedIn: string[];
}

export interface Ingredient {
  name: string;
  weight: string;
  confidence?: AnalysisConfidence;
}

export interface DailyNorm {
  calories: number;
  percentOfNorm: number | null;
}

export interface ScanResult {
  confidence: AnalysisConfidence;
  warnings: AnalysisWarning[];
  allergyAlerts: (AllergyAlert | string)[];
  medicalAdviceRequested: boolean;
  promptVersion?: string;
  dailyNorm?: DailyNorm | null;
  foodName: string;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  ingredients: Ingredient[];
  whatIsGood: string[];
  risks: string[];
  summary: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  imageUri: string;
  result: ScanResult;
  correctionHistory?: Array<{
    userPrompt: string;
    result: ScanResult;
    resultBefore?: ScanResult;
    timestamp?: string;
  }>;
}
