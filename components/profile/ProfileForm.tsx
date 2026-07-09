import AgePicker from "@/components/profile/AgePicker";
import AllergiesSection from "@/components/profile/AllergiesSection";
import ChipsGroup from "@/components/profile/ChipsGroup";
import FormSection from "@/components/profile/FormSection";
import GenderSelector from "@/components/profile/GenderSelector";
import Button from "@/components/ui/Button";
import Divider from "@/components/ui/Divider";
import { CONCERN_PRESETS } from "@/constants/profile";
import React from "react";
import { Control, Controller } from "react-hook-form";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { ProfileFormData } from "../../hooks/useProfileForm";

interface ProfileFormProps {
  control: Control<ProfileFormData>;
  isSaving: boolean;
  onSubmit: () => void;
}

export default function ProfileForm({
  control,
  isSaving,
  onSubmit,
}: ProfileFormProps) {
  return (
    <>
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
            <AllergiesSection
              value={field.value || []}
              onChange={field.onChange}
            />
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
      />
    </>
  );
}

const styles = StyleSheet.create({
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
