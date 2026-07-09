import * as ImageManipulator from "expo-image-manipulator";
import { Platform } from "react-native";
import {
  AnalysisConfidence,
  AnalysisWarning,
  ScanResult,
} from "../types/history";
import { ProfileData } from "../types/profile";

const API_URL =
  process.env.EXPO_PUBLIC_API_URL ||
  (Platform.OS === "android"
    ? "http://10.0.2.2:3000/api/analyze"
    : "http://localhost:3000/api/analyze");

export async function analyzeFoodImageBackend(
  imageUri: string,
  profile: ProfileData,
  correctionText?: string,
): Promise<ScanResult> {
  const formData = new FormData();

  let finalUri = imageUri;
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      imageUri,
      [{ resize: { width: 800 } }],
      { compress: 0.7, format: ImageManipulator.SaveFormat.JPEG },
    );
    finalUri = manipResult.uri;
  } catch (err) {
    console.warn("Failed to compress image, using original:", err);
  }

  formData.append("image", {
    uri: finalUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  formData.append("userInfo", JSON.stringify(profile));

  if (correctionText) {
    formData.append("correctionPrompt", correctionText);
  }

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      let errorMsg = "Помилка сервера";
      try {
        const errorJson = await response.json();
        errorMsg = errorJson.error || errorMsg;
      } catch {}
      throw new Error(errorMsg);
    }

    const data: any = await response.json();

    const userAllergies = (profile.allergies || []).map((a) => a.toLowerCase());
    const allergyAlerts: string[] = [];

    if (userAllergies.length > 0) {
      for (const food of data.detected_food) {
        const foodNameLower = (food as any).name.toLowerCase();
        for (const allergy of userAllergies) {
          if (foodNameLower.includes(allergy)) {
            if (!allergyAlerts.includes(allergy)) {
              allergyAlerts.push(allergy);
            }
          }
        }
      }
    }

    const safeNumber = (val: unknown): number | null => {
      if (typeof val === "number") return val;
      return null;
    };

    return {
      confidence: data.confidence as AnalysisConfidence,
      warnings: data.warnings as AnalysisWarning[],
      medicalAdviceRequested: data.medical_advice_requested,
      allergyAlerts,
      foodName: data.detected_food[0]?.name || "Невідома страва",
      calories: safeNumber(data.total.calories),
      protein: safeNumber(data.total.protein),
      fat: safeNumber(data.total.fat),
      carbs: safeNumber(data.total.carbs),
      ingredients: data.detected_food.map((food: any) => ({
        name: food.name,
        weight: food.estimated_weight || "Невідомо",
        confidence: food.estimated_weight_confidence as
          | AnalysisConfidence
          | undefined,
      })),
      whatIsGood: Array.isArray(data.good_points)
        ? data.good_points.map((p: any) => `• ${p}`).join("\n")
        : "Немає даних",
      risks: Array.isArray(data.bad_points)
        ? data.bad_points.map((p: any) => `• ${p}`).join("\n") || "Немає даних"
        : "Немає даних",
      summary: data.personalized_summary || "",
    };
  } catch (error: any) {
    throw error;
  }
}
