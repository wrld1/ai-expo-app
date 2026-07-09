import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { HistoryItem } from "../../types/history";
import Card from "../ui/Card";

interface CorrectionHistoryListProps {
  history: HistoryItem["correctionHistory"];
}

export default function CorrectionHistoryList({
  history,
}: CorrectionHistoryListProps) {
  if (!history || history.length === 0) return null;

  return (
    <View style={{ marginTop: 0 }}>
      <Text style={[styles.subSectionTitle, { color: colors.label }]}>
        Історія уточнень
      </Text>
      {history.map((corr, idx) => (
        <Card key={idx} style={styles.correctionHistoryRowOverrides}>
          <View style={styles.corrUserBubble}>
            <Text style={[styles.corrUserText, { color: colors.label }]}>
              {'Коригування: "'}
              {corr.userPrompt}
              {'"'}
            </Text>
          </View>
          <View
            style={[
              styles.corrAiBubble,
              { backgroundColor: "rgba(44, 226, 162, 0.08)" },
            ]}
          >
            <Text style={[styles.corrAiText, { color: colors.accent }]}>
              AI оновив страву на: {corr.result.foodName} (
              {corr.result.calories} ккал)
            </Text>
          </View>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 4,
    marginBottom: 8,
  },
  correctionHistoryRowOverrides: {
    padding: 12,
    marginBottom: 8,
  },
  corrUserBubble: {
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: 8,
    borderRadius: 8,
    marginBottom: 6,
  },
  corrUserText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  corrAiBubble: {
    padding: 8,
    borderRadius: 8,
  },
  corrAiText: {
    fontSize: 12,
  },
});
