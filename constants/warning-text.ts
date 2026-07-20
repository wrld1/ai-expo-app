import { AnalysisWarning } from "@/types/history";

export const getWarningText = (warning: AnalysisWarning) => {
  switch (warning) {
    case "poor_image_quality":
      return "Погана якість фото. Результати можуть бути неточними.";
    case "multiple_dishes":
      return "Виявлено кілька страв. Аналіз може бути узагальненим.";
    case "hidden_ingredients":
      return "Можливі приховані інгредієнти (наприклад, у соусі чи начинці).";
    case "weight_estimation_uncertain":
      return "Складно визначити точну вагу порції.";
    case "not_food":
      return "На фото не вдалося розпізнати їжу.";
    default:
      return "Увага: результати можуть бути неточними.";
  }
};
