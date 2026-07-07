import Ionicons from "@react-native-vector-icons/ionicons";
import * as Haptics from "expo-haptics";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useProfile } from "../context/ProfileContext";

const ALLERGY_PRESETS = [
  "Лактоза",
  "Глютен",
  "Горіхи",
  "Арахіс",
  "Риба / Морепродукти",
  "Яйця",
  "Соя",
];

const CONCERN_PRESETS = [
  "Важкість після їжі",
  "Зайва вага",
  "Рівень цукру",
  "Нестача білка",
  "Набір м'язової маси",
  "Загальний тонус",
];

const colors = {
  label: Platform.select({
    ios: PlatformColor("label") as any,
    android: PlatformColor("?attr/colorOnSurface") as any,
    default: "#FFFFFF",
  }),
  secondaryLabel: Platform.select({
    ios: PlatformColor("secondaryLabel") as any,
    android: PlatformColor("?attr/colorOnSurfaceVariant") as any,
    default: "#8E8E93",
  }),
  systemBackground: Platform.select({
    ios: PlatformColor("systemBackground") as any,
    android: PlatformColor("?attr/colorBackground") as any,
    default: "#121417",
  }),
  secondarySystemGroupedBackground: Platform.select({
    ios: PlatformColor("secondarySystemGroupedBackground") as any,
    android: PlatformColor("?attr/colorSurfaceContainer") as any,
    default: "#1C1C1E",
  }),
  separator: Platform.select({
    ios: PlatformColor("separator") as any,
    android: PlatformColor("?attr/colorOutlineVariant") as any,
    default: "rgba(255,255,255,0.08)",
  }),
  accent: Platform.select({
    ios: PlatformColor("systemGreen") as any,
    android: PlatformColor("?attr/colorPrimary") as any,
    default: "#2CE2A2",
  }),
  systemRed: Platform.select({
    ios: PlatformColor("systemRed") as any,
    android: PlatformColor("?attr/colorError") as any,
    default: "#FF453A",
  }),
  placeholder: "#6B7280",
};

export default function ProfileView() {
  const { profile, updateProfile } = useProfile();

  const [age, setAge] = useState(profile.age);
  const [gender, setGender] = useState(profile.gender);
  const [allergies, setAllergies] = useState<string[]>(profile.allergies);
  const [concerns, setConcerns] = useState<string[]>(profile.concerns);
  const [geminiApiKey, setGeminiApiKey] = useState(profile.geminiApiKey);
  const [customAllergy, setCustomAllergy] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const triggerHaptic = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => {});
    }
  };

  const toggleAllergy = (allergy: string) => {
    triggerHaptic();
    if (allergies.includes(allergy)) {
      setAllergies(allergies.filter((a) => a !== allergy));
    } else {
      setAllergies([...allergies, allergy]);
    }
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      triggerHaptic();
      setAllergies([...allergies, trimmed]);
      setCustomAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    triggerHaptic();
    setAllergies(allergies.filter((a) => a !== allergy));
  };

  const toggleConcern = (concern: string) => {
    triggerHaptic();
    if (concerns.includes(concern)) {
      setConcerns(concerns.filter((c) => c !== concern));
    } else {
      setConcerns([...concerns, concern]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
    try {
      await updateProfile({
        age,
        gender,
        allergies,
        concerns,
        geminiApiKey,
      });
      Alert.alert("Успіх", "Профіль успішно збережено!");
    } catch {
      if (Platform.OS === "ios") {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error).catch(
          () => {},
        );
      }
      Alert.alert("Помилка", "Не вдалося зберегти профіль");
    } finally {
      setIsSaving(false);
    }
  };

  const isEnvKeyLoaded = !!process.env.EXPO_PUBLIC_GEMINI_API_KEY;

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.systemBackground }]}
      keyboardVerticalOffset={Platform.OS === "ios" ? 88 : 0}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={[styles.groupHeader, { color: colors.secondaryLabel }]}>
          ПЕРСОНАЛЬНІ ДАНІ
        </Text>
        <View
          style={[
            styles.groupedCard,
            { backgroundColor: colors.secondarySystemGroupedBackground },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.label }]}>Вік</Text>
            <TextInput
              style={[styles.rowValueInput, { color: colors.label }]}
              value={age}
              onChangeText={setAge}
              placeholder="Введіть вік"
              placeholderTextColor={colors.placeholder}
              keyboardType="number-pad"
              textAlign="right"
            />
          </View>
          <View
            style={[styles.divider, { backgroundColor: colors.separator }]}
          />

          <View style={[styles.row, { paddingVertical: 8 }]}>
            <Text style={[styles.rowLabel, { color: colors.label }]}>
              Стать
            </Text>
            <View style={styles.segmentedControl}>
              {["Чоловіча", "Жіноча", "Інша"].map((g, idx) => {
                const isSelected = gender === g;
                return (
                  <TouchableOpacity
                    key={g}
                    style={[
                      styles.segmentButton,
                      isSelected && styles.segmentButtonSelected,
                      idx === 0 && styles.segmentButtonLeft,
                      idx === 2 && styles.segmentButtonRight,
                    ]}
                    onPress={() => {
                      triggerHaptic();
                      setGender(g);
                    }}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.segmentText,
                        isSelected && styles.segmentTextSelected,
                      ]}
                    >
                      {g}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={[styles.groupHeader, { color: colors.secondaryLabel }]}>
          АЛЕРГІЇ ТА ОБМЕЖЕННЯ
        </Text>
        <View
          style={[
            styles.groupedCard,
            { backgroundColor: colors.secondarySystemGroupedBackground },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                flexDirection: "column",
                alignItems: "stretch",
                paddingVertical: 12,
              },
            ]}
          >
            <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
              Оберіть алергени для попередження про ризики страви:
            </Text>

            <View style={styles.chipsRow}>
              {ALLERGY_PRESETS.map((allergy) => {
                const isSelected = allergies.includes(allergy);
                return (
                  <TouchableOpacity
                    key={allergy}
                    style={[
                      styles.chip,
                      isSelected && [
                        styles.chipSelected,
                        { borderColor: colors.accent },
                      ],
                    ]}
                    onPress={() => toggleAllergy(allergy)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && [
                          styles.chipTextSelected,
                          { color: colors.accent },
                        ],
                      ]}
                    >
                      {allergy}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          <View
            style={[styles.divider, { backgroundColor: colors.separator }]}
          />

          <View style={styles.row}>
            <TextInput
              style={[styles.customInput, { color: colors.label }]}
              value={customAllergy}
              onChangeText={setCustomAllergy}
              placeholder="Додати свій алерген..."
              placeholderTextColor={colors.placeholder}
            />
            <TouchableOpacity
              style={[styles.addBtn, { backgroundColor: colors.accent }]}
              onPress={addCustomAllergy}
              activeOpacity={0.8}
            >
              <Ionicons name="add" size={20} color="#121417" />
            </TouchableOpacity>
          </View>

          {allergies.filter((a) => !ALLERGY_PRESETS.includes(a)).length > 0 && (
            <>
              <View
                style={[styles.divider, { backgroundColor: colors.separator }]}
              />
              <View
                style={[
                  styles.row,
                  {
                    flexDirection: "column",
                    alignItems: "stretch",
                    paddingVertical: 12,
                  },
                ]}
              >
                <Text
                  style={[styles.rowSubLabel, { color: colors.secondaryLabel }]}
                >
                  Ваші додаткові алергени:
                </Text>
                <View style={styles.chipsRow}>
                  {allergies
                    .filter((a) => !ALLERGY_PRESETS.includes(a))
                    .map((allergy) => (
                      <View
                        key={allergy}
                        style={[
                          styles.customChip,
                          { borderColor: colors.systemRed },
                        ]}
                      >
                        <Text
                          style={[
                            styles.customChipText,
                            { color: colors.label },
                          ]}
                        >
                          {allergy}
                        </Text>
                        <TouchableOpacity
                          onPress={() => removeAllergy(allergy)}
                        >
                          <Ionicons
                            name="close-circle"
                            size={16}
                            color={colors.systemRed as any}
                            style={{ marginLeft: 4 }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              </View>
            </>
          )}
        </View>

        <Text style={[styles.groupHeader, { color: colors.secondaryLabel }]}>
          ЦІЛІ ТА СИМПТОМИ
        </Text>
        <View
          style={[
            styles.groupedCard,
            { backgroundColor: colors.secondarySystemGroupedBackground },
          ]}
        >
          <View
            style={[
              styles.row,
              {
                flexDirection: "column",
                alignItems: "stretch",
                paddingVertical: 12,
              },
            ]}
          >
            <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
              На чому сфокусувати увагу AI при аналізі?
            </Text>

            <View style={styles.chipsRow}>
              {CONCERN_PRESETS.map((concern) => {
                const isSelected = concerns.includes(concern);
                return (
                  <TouchableOpacity
                    key={concern}
                    style={[
                      styles.chip,
                      isSelected && [
                        styles.chipSelected,
                        { borderColor: colors.accent },
                      ],
                    ]}
                    onPress={() => toggleConcern(concern)}
                    activeOpacity={0.8}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && [
                          styles.chipTextSelected,
                          { color: colors.accent },
                        ],
                      ]}
                    >
                      {concern}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        <Text style={[styles.groupHeader, { color: colors.secondaryLabel }]}>
          AI КОНФІГУРАЦІЯ
        </Text>
        <View
          style={[
            styles.groupedCard,
            { backgroundColor: colors.secondarySystemGroupedBackground },
          ]}
        >
          <View style={styles.row}>
            <Text style={[styles.rowLabel, { color: colors.label }]}>
              API Key
            </Text>
            <View style={styles.apiKeyContainer}>
              <TextInput
                style={[styles.apiKeyInput, { color: colors.label }]}
                value={geminiApiKey}
                onChangeText={setGeminiApiKey}
                placeholder="Введіть Gemini Key"
                placeholderTextColor={colors.placeholder}
                secureTextEntry={!showApiKey}
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                onPress={() => setShowApiKey(!showApiKey)}
                style={styles.eyeBtn}
              >
                <Ionicons
                  name={showApiKey ? "eye-off-outline" : "eye-outline"}
                  size={18}
                  color={colors.secondaryLabel as any}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <Text style={[styles.cardFooterText, { color: colors.secondaryLabel }]}>
          {isEnvKeyLoaded
            ? "✓ Ключ завантажено з конфігурації (.env)"
            : "Ключ відсутній у .env. Для роботи потрібен ручний API ключ."}
        </Text>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.accent }]}
          onPress={handleSave}
          disabled={isSaving}
          activeOpacity={0.85}
        >
          <Text style={styles.saveBtnText}>
            {isSaving ? "Збереження..." : "Зберегти налаштування"}
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  groupHeader: {
    fontSize: 12,
    fontWeight: "600",
    marginLeft: 12,
    marginBottom: 8,
    marginTop: 10,
    textTransform: "uppercase",
  },
  groupedCard: {
    borderRadius: 12,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    marginBottom: 16,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 48,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "500",
  },
  rowSubLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  rowSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  rowValueInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    marginLeft: 20,
  },
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.05)",
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonSelected: {
    backgroundColor: "rgba(255,255,255,0.12)",
  },
  segmentButtonLeft: {},
  segmentButtonRight: {},
  segmentText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },
  segmentTextSelected: {
    color: "#FFFFFF",
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: "rgba(255,255,255,0.03)",
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: "rgba(44, 226, 162, 0.08)",
  },
  chipText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    fontWeight: "600",
  },
  customInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
  },
  addBtn: {
    borderRadius: 8,
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
  },
  customChip: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.04)",
    borderRadius: 18,
    borderWidth: 1,
    paddingLeft: 12,
    paddingRight: 6,
    paddingVertical: 5,
    margin: 4,
  },
  customChipText: {
    fontSize: 13,
    fontWeight: "500",
  },
  apiKeyContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginLeft: 20,
  },
  apiKeyInput: {
    flex: 1,
    fontSize: 15,
    paddingVertical: 0,
    textAlign: "right",
    marginRight: 8,
  },
  eyeBtn: {
    padding: 4,
  },
  cardFooterText: {
    fontSize: 11,
    marginLeft: 16,
    marginTop: -8,
    marginBottom: 20,
  },
  saveBtn: {
    borderRadius: 12,
    borderCurve: "continuous",
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    boxShadow: "0 4px 12px rgba(44, 226, 162, 0.15)",
  },
  saveBtnText: {
    color: "#121417",
    fontSize: 16,
    fontWeight: "700",
  },
});
