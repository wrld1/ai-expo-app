export interface AnalyzeResponse {
  confidence: string;
  warnings: string[];
  medical_advice_requested: boolean;
  detected_food: {
    name: string;
    estimated_weight?: string;
    estimated_weight_confidence?: string;
  }[];
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
