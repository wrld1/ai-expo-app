import { zodResolver } from "@hookform/resolvers/zod";
import { Picker } from "@react-native-picker/picker";
import Ionicons from "@react-native-vector-icons/ionicons";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import * as z from "zod";

import { colors, nativeStyles } from "../constants/theme";
import { useProfile } from "../context/ProfileContext";
import {
  triggerHapticError,
  triggerHapticLight,
  triggerHapticSuccess,
} from "../utils/haptics";

const profileSchema = z.object({
  age: z.string().min(1, "Вік обов'язковий"),
  gender: z.string(),
  allergies: z.array(z.string()),
  concerns: z.array(z.string()),
});

type ProfileFormData = z.infer<typeof profileSchema>;

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

// --- Sub-components for cleaner JSX ---

function FormSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={[nativeStyles.sectionTitle, { color: colors.secondaryLabel, marginLeft: 16 }]}>
        {title}
      </Text>
      <View
        style={[
          styles.groupedCard,
          { backgroundColor: colors.secondarySystemGroupedBackground },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

function Divider() {
  return (
    <View style={[styles.divider, { backgroundColor: colors.separator }]} />
  );
}

function SettingsRow({
  label,
  value,
  onPress,
  children,
  style,
}: {
  label?: string;
  value?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: object;
}) {
  const content = (
    <View style={[styles.row, style]}>
      {label && (
        <Text style={[styles.rowLabel, { color: colors.label }]}>{label}</Text>
      )}
      {value && (
        <Text style={[styles.rowValueText, { color: colors.secondaryLabel }]}>
          {value}
        </Text>
      )}
      {children}
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
        {content}
      </TouchableOpacity>
    );
  }
  return content;
}

function ChipsGroup({
  presets,
  selectedValues,
  onToggle,
}: {
  presets: string[];
  selectedValues: string[];
  onToggle: (val: string) => void;
}) {
  return (
    <View style={styles.chipsRow}>
      {presets.map((item) => {
        const isSelected = selectedValues.includes(item);
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              isSelected && [
                styles.chipSelected,
                { borderColor: colors.accent },
              ],
            ]}
            onPress={() => onToggle(item)}
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
              {item}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

export default function ProfileView() {
  const { profile, updateProfile } = useProfile();
  const [showAgePicker, setShowAgePicker] = useState(false);
  const [customAllergy, setCustomAllergy] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  const { control, handleSubmit, setValue, watch, reset } =
    useForm<ProfileFormData>({
      resolver: zodResolver(profileSchema),
      defaultValues: {
        age: "25",
        gender: "Інша",
        allergies: [],
        concerns: [],
      },
    });

  useEffect(() => {
    reset({
      age: profile.age || "25",
      gender: profile.gender || "Інша",
      allergies: profile.allergies || [],
      concerns: profile.concerns || [],
    });
  }, [profile, reset]);

  const age = watch("age");
  const gender = watch("gender");
  const allergies = watch("allergies") || [];
  const concerns = watch("concerns") || [];

  const toggleAllergy = (allergy: string) => {
    triggerHapticLight();
    const updated = allergies.includes(allergy)
      ? allergies.filter((a) => a !== allergy)
      : [...allergies, allergy];
    setValue("allergies", updated, { shouldDirty: true });
  };

  const addCustomAllergy = () => {
    const trimmed = customAllergy.trim();
    if (trimmed && !allergies.includes(trimmed)) {
      triggerHapticLight();
      setValue("allergies", [...allergies, trimmed], { shouldDirty: true });
      setCustomAllergy("");
    }
  };

  const removeAllergy = (allergy: string) => {
    triggerHapticLight();
    setValue(
      "allergies",
      allergies.filter((a) => a !== allergy),
      { shouldDirty: true },
    );
  };

  const toggleConcern = (concern: string) => {
    triggerHapticLight();
    const updated = concerns.includes(concern)
      ? concerns.filter((c) => c !== concern)
      : [...concerns, concern];
    setValue("concerns", updated, { shouldDirty: true });
  };

  const handleSave = async (data: ProfileFormData) => {
    setIsSaving(true);
    triggerHapticSuccess();
    try {
      await updateProfile(data);
      Alert.alert("Успіх", "Профіль успішно збережено!");
    } catch {
      triggerHapticError();
      Alert.alert("Помилка", "Не вдалося зберегти профіль");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container, { backgroundColor: colors.systemGroupedBackground }]}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        <FormSection title="Персональні дані">
          {Platform.OS === "ios" ? (
            <SettingsRow
              label="Вік"
              value={`${age} років`}
              onPress={() => {
                triggerHapticLight();
                setShowAgePicker(!showAgePicker);
              }}
            />
          ) : (
            <SettingsRow label="Вік">
              <View style={styles.pickerWrapperAndroid}>
                <Picker
                  selectedValue={age}
                  onValueChange={(itemValue) =>
                    setValue("age", itemValue, { shouldDirty: true })
                  }
                  style={{ color: colors.label, width: 140 }}
                  dropdownIconColor={colors.secondaryLabel as string}
                  mode="dropdown"
                >
                  {Array.from({ length: 100 }, (_, i) => String(i + 1)).map(
                    (val) => (
                      <Picker.Item
                        key={val}
                        label={`${val} р.`}
                        value={val}
                        color="#1C1C1E"
                      />
                    ),
                  )}
                </Picker>
              </View>
            </SettingsRow>
          )}

          {Platform.OS === "ios" && showAgePicker && (
            <View style={styles.pickerContainer}>
              <Picker
                selectedValue={age}
                onValueChange={(itemValue) => {
                  triggerHapticLight();
                  setValue("age", itemValue, { shouldDirty: true });
                }}
                style={{ color: colors.label }}
              >
                {Array.from({ length: 100 }, (_, i) => String(i + 1)).map(
                  (val) => (
                    <Picker.Item key={val} label={`${val} років`} value={val} />
                  ),
                )}
              </Picker>
            </View>
          )}

          <Divider />

          <SettingsRow label="Стать" style={{ paddingVertical: 8 }}>
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
                      triggerHapticLight();
                      setValue("gender", g, { shouldDirty: true });
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
          </SettingsRow>
        </FormSection>

        <FormSection title="Алергії та обмеження">
          <View style={styles.chipsContainerRow}>
            <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
              Оберіть алергени для попередження про ризики страви:
            </Text>
            <ChipsGroup
              presets={ALLERGY_PRESETS}
              selectedValues={allergies}
              onToggle={toggleAllergy}
            />
          </View>

          <Divider />

          <SettingsRow>
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
          </SettingsRow>

          {allergies.filter((a) => !ALLERGY_PRESETS.includes(a)).length > 0 && (
            <>
              <Divider />
              <View style={styles.chipsContainerRow}>
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
                            color={colors.systemRed}
                            style={{ marginLeft: 4 }}
                          />
                        </TouchableOpacity>
                      </View>
                    ))}
                </View>
              </View>
            </>
          )}
        </FormSection>

        <FormSection title="Цілі та симптоми">
          <View style={styles.chipsContainerRow}>
            <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
              На чому сфокусувати увагу AI при аналізі?
            </Text>
            <ChipsGroup
              presets={CONCERN_PRESETS}
              selectedValues={concerns}
              onToggle={toggleConcern}
            />
          </View>
        </FormSection>

        <TouchableOpacity
          style={[styles.saveBtn, { backgroundColor: colors.accent }]}
          onPress={handleSubmit(handleSave)}
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
  sectionContainer: {
    marginBottom: 20,
  },
  groupedCard: {
    borderRadius: 14,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 48,
  },
  chipsContainerRow: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 14,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  rowSubLabel: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 8,
  },
  rowSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
  rowValueText: {
    fontSize: 16,
  },
  pickerWrapperAndroid: {
    marginRight: -10,
  },
  pickerContainer: {
    ...Platform.select({
      ios: {
        backgroundColor: "rgba(255, 255, 255, 0.02)",
        marginTop: -6,
        marginBottom: 8,
        borderRadius: 8,
        overflow: "hidden",
      },
    }),
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
    fontSize: 12,
    marginLeft: 16,
    marginTop: -8,
    marginBottom: 20,
  },
  saveBtn: {
    borderRadius: 14,
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
    fontWeight: "600",
  },
});
