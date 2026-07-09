import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import { HistoryItem } from "../../types/history";
import { formatUkDate } from "../../utils/date";
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
            <Text style={[styles.corrUserLabel, { color: colors.label }]}>
              {"Коригування: "}
            </Text>
            <Text style={[styles.corrUserText, { color: colors.label }]}>
              {'"'}
              {corr.userPrompt}
              {'"'}
            </Text>
            {corr.timestamp && (
              <Text style={styles.corrTimestampText}>
                {formatUkDate(corr.timestamp)}
              </Text>
            )}
          </View>
          <View
            style={[
              styles.corrAiBubble,
              { backgroundColor: "rgba(44, 226, 162, 0.08)" },
            ]}
          >
            {corr.resultBefore ? (
              <Text style={[styles.corrAiText, { color: colors.accent }]}>
                AI оновив страву: {corr.resultBefore.foodName} (
                {corr.resultBefore.calories} ккал) ➔ {corr.result.foodName} (
                {corr.result.calories} ккал)
              </Text>
            ) : (
              <Text style={[styles.corrAiText, { color: colors.accent }]}>
                AI оновив страву на: {corr.result.foodName} (
                {corr.result.calories} ккал)
              </Text>
            )}
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
    paddingBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  corrUserLabel: {
    fontSize: 12,
    fontWeight: "600",
  },
  corrUserText: {
    fontSize: 12,
    fontStyle: "italic",
  },
  corrTimestampText: {
    fontSize: 10,
    marginTop: 4,
    color: "#8E8E93",
    marginLeft: 8,
  },
  corrAiBubble: {
    padding: 8,
    borderRadius: 8,
  },
  corrAiText: {
    fontSize: 12,
  },
});
