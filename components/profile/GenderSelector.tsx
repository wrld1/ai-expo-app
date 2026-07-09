import { GENDERS } from "@/constants/profile";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";
import { triggerHapticLight } from "../../utils/haptics";
import SettingsRow from "./SettingsRow";

interface GenderSelectorProps {
  value: string;
  onChange: (gender: string) => void;
}

export default function GenderSelector({
  value,
  onChange,
}: GenderSelectorProps) {
  return (
    <SettingsRow label="Стать" style={{ paddingVertical: 8 }}>
      <View style={styles.segmentedControl}>
        {GENDERS.map((g) => {
          const isSelected = value === g;
          return (
            <TouchableOpacity
              key={g}
              style={[
                styles.segmentButton,
                isSelected && styles.segmentButtonSelected,
              ]}
              onPress={() => {
                triggerHapticLight();
                onChange(g);
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
  );
}

const styles = StyleSheet.create({
  segmentedControl: {
    flexDirection: "row",
    backgroundColor: colors.secondarySystemGroupedBackground,
    borderRadius: 8,
    padding: 2,
    borderWidth: 1,
    borderColor: colors.separator,
  },
  segmentButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  segmentButtonSelected: {
    backgroundColor: colors.systemGroupedBackground,
  },
  segmentText: {
    color: colors.secondaryLabel,
    fontSize: 13,
    fontWeight: "600",
  },
  segmentTextSelected: {
    color: colors.label,
  },
});
