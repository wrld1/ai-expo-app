import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { ProfileData } from "../../types/profile";
import Divider from "../ui/Divider";
import FormSection from "./FormSection";
import SettingsRow from "./SettingsRow";

interface ProfileDetailsProps {
  profile: ProfileData;
}

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  return (
    <View style={styles.container}>
      <FormSection title="Персональні дані">
        <SettingsRow
          label="Вік"
          value={profile.age ? `${profile.age} років` : "Не вказано"}
        />
        <Divider />
        <SettingsRow label="Стать" value={profile.gender || "Не вказано"} />
      </FormSection>

      <FormSection title="Алергії та обмеження">
        {profile.allergies && profile.allergies.length > 0 ? (
          <View style={styles.chipsRow}>
            {profile.allergies.map((allergy) => (
              <View
                key={allergy}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.secondarySystemGroupedBackground,
                    borderColor: colors.separator,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.label }]}>
                  {allergy}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <SettingsRow label="Немає" />
        )}
      </FormSection>

      <FormSection title="Цілі та симптоми">
        {profile.concerns && profile.concerns.length > 0 ? (
          <View style={styles.chipsRow}>
            {profile.concerns.map((concern) => (
              <View
                key={concern}
                style={[
                  styles.chip,
                  {
                    backgroundColor: colors.secondarySystemGroupedBackground,
                    borderColor: colors.separator,
                  },
                ]}
              >
                <Text style={[styles.chipText, { color: colors.label }]}>
                  {concern}
                </Text>
              </View>
            ))}
          </View>
        ) : (
          <SettingsRow label="Немає" />
        )}
      </FormSection>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 8,
  },
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingVertical: 12,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    borderWidth: 1,
  },
  chipText: {
    fontSize: 14,
    fontWeight: "500",
  },
});
