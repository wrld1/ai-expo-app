import { AnalyzeResponse } from "@/types/analyze";
import { ImageManipulator, SaveFormat } from "expo-image-manipulator";
import { ScanResult } from "../types/history";
import { ProfileData } from "../types/profile";

const API_URL =
  (process.env.EXPO_PUBLIC_API_URL || "http://localhost:3000") + "/api/analyze";

function formatFoodName(detected: AnalyzeResponse["detected_food"]): string {
  const [first, ...rest] = detected ?? [];
  if (!first) return "Невідома страва";
  return rest.length > 0 ? `${first.name} +${rest.length}` : first.name;
}

export async function analyzeFoodImageBackend(
  imageUri: string,
  profile: ProfileData,
  correctionText?: string,
): Promise<ScanResult> {
  const formData = new FormData();

  let finalUri = imageUri;
  try {
    const imageRef = await ImageManipulator.manipulate(imageUri)
      .resize({ width: 1280 })
      .renderAsync();

    const manipResult = await imageRef.saveAsync({
      compress: 0.85,
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

    const safeNumber = (val: unknown): number | null => {
      if (typeof val === "number") return val;
      return null;
    };

    return {
      confidence: data.confidence,
      warnings: data.warnings ?? [],
      medicalAdviceRequested: data.medical_advice_requested,
      allergyAlerts: data.allergy_alerts ?? [],
      promptVersion: data.prompt_version,
      dailyNorm: data.daily_norm
        ? {
            calories: data.daily_norm.calories,
            percentOfNorm: data.daily_norm.percent_of_norm,
          }
        : null,
      foodName: formatFoodName(data.detected_food),
      calories: safeNumber(data.total.calories),
      protein: safeNumber(data.total.protein),
      fat: safeNumber(data.total.fat),
      carbs: safeNumber(data.total.carbs),
      ingredients: data.detected_food.map((food) => ({
        name: food.name,
        weight: food.estimated_weight || "Невідомо",
        confidence: food.estimated_weight_confidence,
      })),
      whatIsGood: Array.isArray(data.good_points) ? data.good_points : [],
      risks: Array.isArray(data.bad_points) ? data.bad_points : [],
      summary: data.personalized_summary || "",
    };
  } catch (error) {
    throw error;
  }
}
