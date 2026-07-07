import { ScanResult } from "../context/HistoryContext";
import { ProfileData } from "../context/ProfileContext";

const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent";

const uriToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        const base64Data = result.split(",")[1];
        resolve(base64Data);
      };
      reader.onerror = (error) => {
        reject(error);
      };
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error("Failed to convert image to base64", error);
    throw new Error(
      "Не вдалося обробити фотографію. Перевірте файл зображення.",
    );
  }
};

export const analyzeFoodImage = async (
  imageUri: string,
  profile: ProfileData,
  apiKey: string,
  correctionPrompt?: string,
  previousResult?: ScanResult,
): Promise<ScanResult> => {
  if (!apiKey || apiKey.trim() === "") {
    throw new Error(
      "Будь ласка, вкажіть ваш Gemini API Key у вкладці 'Профіль' або налаштуйте файл конфігурації (.env).",
    );
  }

  const base64Image = await uriToBase64(imageUri);

  const allergyContext =
    profile.allergies.length > 0
      ? `Алергії користувача: ${profile.allergies.join(", ")}.`
      : "У користувача немає відомих алергій.";

  const concernContext =
    profile.concerns.length > 0
      ? `Цілі або симптоми користувача (на що звернути увагу): ${profile.concerns.join(", ")}.`
      : "Немає особливих скарг або занепокоєнь щодо здоров'я.";

  const demographicContext = `Дані користувача: Вік - ${profile.age || "не вказано"}, Стать - ${profile.gender || "не вказано"}.`;

  let prompt = `Ти — професійний дієтолог та експерт з харчування.
Проаналізуй їжу на цьому зображенні та вирахуй приблизні КБЖВ (Калорії, Білки, Жири, Вуглеводи) страви.

${demographicContext}
${allergyContext}
${concernContext}

Твої висновки повинні БУТИ СТРОГО СФОКУСОВАНІ на даних користувача. Звертай увагу на алергії (попереджай, якщо є ризик) та скарги користувача (наприклад, якщо користувача турбує важкість після їжі, а на тарілці жирна їжа — вкажи це як ризик; якщо турбує цукор, оціни глікемічний вплив; якщо турбує нестача білка — проаналізуй кількість білка).

ВАЖЛИВО: Надавай лише об'єктивні поради з харчування, уникай встановлення медичних діагнозів. Додай примітку, що це приблизний аналіз.`;

  if (correctionPrompt && previousResult) {
    prompt += `
\n---
УВАГА: Користувач надіслав коригування до попереднього аналізу.
Попередній аналіз, який ти зробив:
- Назва: ${previousResult.foodName}
- Калорії: ${previousResult.calories} ккал
- Білки: ${previousResult.protein} г, Жири: ${previousResult.fat} г, Вуглеводи: ${previousResult.carbs} г
- Інгредієнти: ${JSON.stringify(previousResult.ingredients)}

Текст коригування від користувача: "${correctionPrompt}"

Будь ласка, перерахуй КБЖВ, інгредієнти та скоригуй опис страви відповідно до цього зауваження (наприклад, заміни один інгредієнт на інший, збільш або зменш порції, скоригуй КБЖВ) та оригінального фото.
`;
  }

  const requestBody = {
    contents: [
      {
        parts: [
          { text: prompt },
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image,
            },
          },
        ],
      },
    ],
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: {
        type: "OBJECT",
        properties: {
          foodName: { type: "STRING" },
          calories: { type: "NUMBER" },
          protein: { type: "NUMBER" },
          fat: { type: "NUMBER" },
          carbs: { type: "NUMBER" },
          ingredients: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                name: { type: "STRING" },
                weight: { type: "STRING" },
              },
              required: ["name", "weight"],
            },
          },
          whatIsGood: { type: "STRING" },
          risks: { type: "STRING" },
          summary: { type: "STRING" },
        },
        required: [
          "foodName",
          "calories",
          "protein",
          "fat",
          "carbs",
          "ingredients",
          "whatIsGood",
          "risks",
          "summary",
        ],
      },
    },
  };

  try {
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorJson = await response.json().catch(() => ({}));
      const errorMessage =
        errorJson.error?.message ||
        `Помилка запиту до API (${response.status})`;
      throw new Error(errorMessage);
    }

    const responseData = await response.json();
    const textResult = responseData.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textResult) {
      throw new Error(
        "Не вдалося отримати відповідь від AI. Спробуйте ще раз.",
      );
    }

    const parsedResult: ScanResult = JSON.parse(textResult);
    return parsedResult;
  } catch (error: any) {
    console.error("Gemini API call failed", error);
    throw new Error(error.message || "Сталася помилка під час аналізу страви.");
  }
};
