export const ALLERGY_PRESETS = [
  "Лактоза",
  "Глютен",
  "Горіхи",
  "Арахіс",
  "Риба / Морепродукти",
  "Яйця",
  "Соя",
];

export const CONCERN_PRESETS = [
  "Важкість після їжі",
  "Зайва вага",
  "Рівень цукру",
  "Нестача білка",
  "Набір м'язової маси",
  "Загальний тонус",
];

export const AGE_VALUES = Array.from({ length: 100 }, (_, i) => String(i + 1));

export const GENDERS = ["Чоловіча", "Жіноча", "Інша"];

export const WEIGHT_VALUES = Array.from({ length: 181 }, (_, i) =>
  String(i + 30),
);

export const HEIGHT_VALUES = Array.from({ length: 121 }, (_, i) =>
  String(i + 120),
);

export const ACTIVITY_OPTIONS = [
  { value: "sedentary", label: "Сидячий спосіб життя" },
  { value: "light", label: "Легка активність (1-2 рази на тиждень)" },
  { value: "moderate", label: "Помірна (3-5 разів на тиждень)" },
  { value: "active", label: "Висока (6-7 разів на тиждень)" },
  { value: "very_active", label: "Дуже висока (робота + спорт)" },
] as const;
