import { AnalysisConfidence, AnalysisWarning, Likelihood } from "./history";

export interface AllergyAlertResponse {
  allergen: string;
  label: string;
  likelihood: Likelihood;
  matchedIn: string[];
  sources: ("dictionary" | "ai")[];
}

export interface AnalyzeResponse {
  prompt_version: string;
  confidence: AnalysisConfidence;
  warnings: AnalysisWarning[];
  medical_advice_requested: boolean;
  detected_food: {
    name: string;
    estimated_weight?: string;
    estimated_weight_confidence?: AnalysisConfidence;
  }[];
  ingredients_normalized: string[];
  allergen_risk: {
    allergen: string;
    likelihood: Likelihood;
    reason?: string;
  }[];
  allergy_alerts: AllergyAlertResponse[];
  daily_norm: {
    calories: number;
    percent_of_norm: number | null;
  } | null;
  total: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
  };
  good_points: string[];
  bad_points: string[];
  personalized_summary: string;
}
