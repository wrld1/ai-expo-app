import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { triggerHapticLight } from "../../utils/haptics";
import SettingsRow from "./SettingsRow";

const GENDERS = ["Чоловіча", "Жіноча", "Інша"] as const;

interface GenderSelectorProps {
  selected: string;
  onSelect: (gender: string) => void;
}

export default function GenderSelector({ selected, onSelect }: GenderSelectorProps) {
  return (
    <SettingsRow label="Стать" style={{ paddingVertical: 8 }}>
      <View style={styles.segmentedControl}>
        {GENDERS.map((g) => {
          const isSelected = selected === g;
          return (
            <TouchableOpacity
              key={g}
              style={[styles.segmentButton, isSelected && styles.segmentButtonSelected]}
              onPress={() => {
                triggerHapticLight();
                onSelect(g);
              }}
              activeOpacity={0.8}
            >
              <Text style={[styles.segmentText, isSelected && styles.segmentTextSelected]}>
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
  segmentText: {
    color: "#8E8E93",
    fontSize: 13,
    fontWeight: "600",
  },
  segmentTextSelected: {
    color: "#FFFFFF",
  },
});
