import { ScanResult } from "../context/HistoryContext";
import { ProfileData } from "../context/ProfileContext";

const getBackendUrl = () => {
  return (
    process.env.EXPO_PUBLIC_API_URL + "/api/analyze" ||
    "http://localhost:3000/api/analyze"
  );
};

export async function analyzeFoodImageBackend(
  imageUri: string,
  profile: ProfileData,
  correctionText?: string,
): Promise<ScanResult> {
  const url = getBackendUrl();
  const formData = new FormData();

  formData.append("image", {
    uri: imageUri,
    name: "photo.jpg",
    type: "image/jpeg",
  } as unknown as Blob);

  formData.append("userInfo", JSON.stringify(profile));

  if (correctionText) {
    formData.append("correctionPrompt", correctionText);
  }

  const response = await fetch(url, {
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

  const rawResult = await response.json();

  const safeNumber = (val: unknown): number | null => {
    if (typeof val === "number") return val;
    return null;
  };

  return {
    foodName: rawResult.detected_food?.[0]?.name || "Невідома страва",
    calories: safeNumber(rawResult.total?.calories),
    protein: safeNumber(rawResult.total?.protein),
    fat: safeNumber(rawResult.total?.fat),
    carbs: safeNumber(rawResult.total?.carbs),
    ingredients: (rawResult.detected_food || []).map((food: { name: string; estimated_weight?: string }) => ({
      name: food.name,
      weight: food.estimated_weight || "Невідомо",
    })),
    whatIsGood:
      rawResult.good_points?.map((p: string) => `• ${p}`).join("\n") ||
      "Немає даних",
    risks:
      rawResult.bad_points?.map((p: string) => `• ${p}`).join("\n") ||
      "Немає даних",
    summary: rawResult.personalized_summary || "",
  };
}
