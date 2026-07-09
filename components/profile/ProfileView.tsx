import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { CONCERN_PRESETS } from "@/constants/profile";
import { colors } from "../../constants/theme";
import { useProfileForm } from "../../hooks/useProfileForm";
import Button from "../ui/Button";
import Divider from "../ui/Divider";
import AgePicker from "./AgePicker";
import AllergiesSection from "./AllergiesSection";
import ChipsGroup from "./ChipsGroup";
import FormSection from "./FormSection";
import GenderSelector from "./GenderSelector";

export default function ProfileView() {
  const {
    age,
    gender,
    allergies,
    concerns,
    customAllergy,
    setCustomAllergy,
    showAgePicker,
    toggleAgePicker,
    isSaving,
    setAge,
    setGender,
    toggleAllergy,
    addCustomAllergy,
    removeAllergy,
    toggleConcern,
    onSubmit,
  } = useProfileForm();

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
          <AgePicker
            age={age}
            showPicker={showAgePicker}
            onTogglePicker={toggleAgePicker}
            onAgeChange={setAge}
          />
          <Divider />
          <GenderSelector selected={gender} onSelect={setGender} />
        </FormSection>

        <FormSection title="Алергії та обмеження">
          <AllergiesSection
            allergies={allergies}
            customAllergy={customAllergy}
            setCustomAllergy={setCustomAllergy}
            onToggle={toggleAllergy}
            onAdd={addCustomAllergy}
            onRemove={removeAllergy}
          />
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

        <Button
          title={isSaving ? "Збереження..." : "Зберегти налаштування"}
          variant="default"
          onPress={onSubmit}
          disabled={isSaving}
          loading={isSaving}
          style={{ marginTop: 10, boxShadow: "0 4px 12px rgba(44, 226, 162, 0.15)" }}
        />
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
  chipsContainerRow: {
    flexDirection: "column",
    alignItems: "stretch",
    paddingVertical: 14,
  },
  rowSubText: {
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 12,
  },
});
