import { AnalyzeResponse } from "@/types/analyze";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import {
  AnalysisConfidence,
  AnalysisWarning,
  ScanResult,
} from "../types/history";
import { ProfileData } from "../types/profile";

const API_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000") + "/api/analyze";

export async function analyzeFoodImageBackend(
  imageUri: string,
  profile: ProfileData,
  correctionText?: string,
): Promise<ScanResult> {
  const formData = new FormData();

  let finalUri = imageUri;
  try {
    const imageRef = await ImageManipulator.manipulate(imageUri)
      .resize({ width: 800 })
      .renderAsync();

    const manipResult = await imageRef.saveAsync({
      compress: 0.7,
      format: SaveFormat.JPEG,
    });
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

    const data: AnalyzeResponse = await response.json();

    const userAllergies = (profile.allergies || []).map((a) => a.toLowerCase());
    const allergyAlerts: string[] = [];

    if (userAllergies.length > 0) {
      for (const food of data.detected_food) {
        const foodNameLower = food.name.toLowerCase();
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
      ingredients: data.detected_food.map((food) => ({
        name: food.name,
        weight: food.estimated_weight || "Невідомо",
        confidence: food.estimated_weight_confidence as
          | AnalysisConfidence
          | undefined,
      })),
      whatIsGood: Array.isArray(data.good_points) ? data.good_points : [],
      risks: Array.isArray(data.bad_points) ? data.bad_points : [],
      summary: data.personalized_summary || "",
    };
  } catch (error) {
    throw error;
  }
}
