import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, nativeStyles } from "../../constants/theme";

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

export default function FormSection({ title, children }: FormSectionProps) {
  return (
    <View style={styles.sectionContainer}>
      <Text style={nativeStyles.sectionTitle}>{title}</Text>
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

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 20,
  },
  groupedCard: {
    borderRadius: 14,
    borderCurve: "continuous",
    paddingHorizontal: 16,
    overflow: "hidden",
  },
});
