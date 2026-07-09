import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";

interface MacroProgressProps {
  value: number | null;
  total: number;
  label: string;
  color: string;
  suffix?: string;
}

export default function MacroProgress({
  value,
  total,
  label,
  color,
  suffix = "г",
}: MacroProgressProps) {
  const displayValue = value === null ? "-" : `${value}${suffix}`;
  const numericValue = value === null ? 0 : value;

  const maxVal = total > 0 ? total : 100;
  const progress = Math.min(numericValue / maxVal, 1);

  return (
    <View style={styles.macroProgressContainer}>
      <View style={styles.macroHeaderRow}>
        <Text style={[styles.macroLabel, { color: colors.label }]}>{label}</Text>
        <Text
          style={[styles.macroValue, { color, fontVariant: ["tabular-nums"] }]}
        >
          {displayValue}
        </Text>
      </View>
      <View style={styles.macroTrack}>
        <View
          style={[
            styles.macroBar,
            { backgroundColor: color, width: `${progress * 100}%` },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  macroProgressContainer: {
    marginBottom: 16,
  },
  macroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  macroLabel: {
    fontSize: 15,
    fontWeight: "500",
  },
  macroValue: {
    fontSize: 15,
    fontWeight: "700",
  },
  macroTrack: {
    height: 8,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  macroBar: {
    height: "100%",
    borderRadius: 4,
  },
});
