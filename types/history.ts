export interface Ingredient {
  name: string;
  weight: string;
}

export interface ScanResult {
  foodName: string;
  calories: number | null;
  protein: number | null;
  fat: number | null;
  carbs: number | null;
  ingredients: Ingredient[];
  whatIsGood: string;
  risks: string;
  summary: string;
}

export interface HistoryItem {
  id: string;
  date: string;
  imageUri: string;
  result: ScanResult;
  correctionHistory?: Array<{ userPrompt: string; result: ScanResult }>;
}
