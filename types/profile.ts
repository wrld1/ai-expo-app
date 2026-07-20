export type ActivityLevel =
  | "sedentary"
  | "light"
  | "moderate"
  | "active"
  | "very_active";

export interface ProfileData {
  age: string;
  gender: string;
  weightKg?: string;
  heightCm?: string;
  activityLevel?: ActivityLevel;
  allergies: string[];
  concerns: string[];
  geminiApiKey?: string;
}
