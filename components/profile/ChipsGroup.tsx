import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { colors } from "../../constants/theme";

interface ChipsGroupProps {
  presets: string[];
  selectedValues: string[];
  onToggle: (val: string) => void;
}

export default function ChipsGroup({ presets, selectedValues, onToggle }: ChipsGroupProps) {
  return (
    <View style={styles.chipsRow}>
      {presets.map((item) => {
        const isSelected = selectedValues.includes(item);
        return (
          <TouchableOpacity
            key={item}
            style={[
              styles.chip,
              isSelected && [styles.chipSelected, { borderColor: colors.accent }],
            ]}
            onPress={() => onToggle(item)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                styles.chipText,
                isSelected && [styles.chipTextSelected, { color: colors.accent }],
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

const styles = StyleSheet.create({
  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginHorizontal: -4,
  },
  chip: {
    backgroundColor: colors.secondarySystemGroupedBackground,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.separator,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
  },
  chipSelected: {
    backgroundColor: "rgba(44, 226, 162, 0.08)",
  },
  chipText: {
    color: colors.secondaryLabel,
    fontSize: 13,
    fontWeight: "500",
  },
  chipTextSelected: {
    fontWeight: "600",
  },
});
