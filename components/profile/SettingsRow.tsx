import React from "react";
import { StyleSheet, Text, TouchableOpacity, View, ViewStyle } from "react-native";
import { colors } from "../../constants/theme";

interface SettingsRowProps {
  label?: string;
  value?: string;
  onPress?: () => void;
  children?: React.ReactNode;
  style?: ViewStyle;
}

export default function SettingsRow({ label, value, onPress, children, style }: SettingsRowProps) {
  const content = (
    <View style={[styles.row, style]}>
      {label && (
        <Text style={[styles.rowLabel, { color: colors.label }]}>{label}</Text>
      )}
      {value && (
        <Text style={[styles.rowValueText, { color: colors.secondaryLabel }]}>{value}</Text>
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

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    minHeight: 48,
  },
  rowLabel: {
    fontSize: 16,
    fontWeight: "400",
  },
  rowValueText: {
    fontSize: 16,
  },
});
