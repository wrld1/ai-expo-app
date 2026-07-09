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
import { Controller } from "react-hook-form";
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
  const { form, isSaving, onSubmit } = useProfileForm();
  const { control } = form;

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
          <Controller
            control={control}
            name="age"
            render={({ field }) => (
              <AgePicker value={field.value} onChange={field.onChange} />
            )}
          />
          <Divider />
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <GenderSelector value={field.value} onChange={field.onChange} />
            )}
          />
        </FormSection>

        <FormSection title="Алергії та обмеження">
          <Controller
            control={control}
            name="allergies"
            render={({ field }) => (
              <AllergiesSection value={field.value || []} onChange={field.onChange} />
            )}
          />
        </FormSection>

        <FormSection title="Цілі та симптоми">
          <View style={styles.chipsContainerRow}>
            <Text style={[styles.rowSubText, { color: colors.secondaryLabel }]}>
              На чому сфокусувати увагу AI при аналізі?
            </Text>
            <Controller
              control={control}
              name="concerns"
              render={({ field }) => (
                <ChipsGroup
                  presets={CONCERN_PRESETS}
                  value={field.value || []}
                  onChange={field.onChange}
                />
              )}
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
