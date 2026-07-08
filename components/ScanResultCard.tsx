import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../constants/theme";
import { ScanResult } from "../context/HistoryContext";
import NativeIcon from "./NativeIcon";

interface ScanResultCardProps {
  result: ScanResult;
}

export default function ScanResultCard({ result }: ScanResultCardProps) {
  const renderMacroProgress = (
    value: number | null,
    total: number,
    label: string,
    color: string,
    suffix: string = "г",
  ) => {
    const displayValue = value === null ? "-" : `${value}${suffix}`;
    const numericValue = value === null ? 0 : value;

    const maxVal = total > 0 ? total : 100;
    const progress = Math.min(numericValue / maxVal, 1);

    return (
      <View style={styles.macroProgressContainer}>
        <View style={styles.macroHeaderRow}>
          <Text style={[styles.macroLabel, { color: colors.label }]}>
            {label}
          </Text>
          <Text
            style={[
              styles.macroValue,
              { color, fontVariant: ["tabular-nums"] },
            ]}
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
  };

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.resultHeaderCard,
          {
            backgroundColor: colors.secondarySystemGroupedBackground,
          },
        ]}
      >
        <Text style={[styles.resultLabel, { color: colors.secondaryLabel }]}>
          AI розпізнав страву:
        </Text>
        <Text
          style={[styles.resultFoodName, { color: colors.label }]}
          selectable
        >
          {result.foodName}
        </Text>
      </View>

      <View
        style={[
          styles.resultsCard,
          {
            backgroundColor: colors.secondarySystemGroupedBackground,
          },
        ]}
      >
        <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
          КБЖВ показники
        </Text>

        {renderMacroProgress(
          result.calories,
          1000,
          "Калорійність",
          "#FF5252",
          " ккал",
        )}
        {renderMacroProgress(result.protein, 80, "Білки", "#4CAF50")}
        {renderMacroProgress(result.fat, 70, "Жири", "#FFC107")}
        {renderMacroProgress(result.carbs, 150, "Вуглеводи", "#00BCD4")}
      </View>

      {result.ingredients && result.ingredients.length > 0 && (
        <View
          style={[
            styles.resultsCard,
            {
              backgroundColor: colors.secondarySystemGroupedBackground,
            },
          ]}
        >
          <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
            Інгредієнти на тарілці
          </Text>
          {result.ingredients.map((ing, idx) => (
            <View
              key={idx}
              style={[
                styles.ingredientRow,
                { borderBottomColor: colors.separator },
              ]}
            >
              <Text style={[styles.ingredientName, { color: colors.label }]}>
                • {ing.name}
              </Text>
              <Text style={[styles.ingredientWeight, { color: colors.accent }]}>
                {ing.weight}
              </Text>
            </View>
          ))}
        </View>
      )}

      <View
        style={[
          styles.resultsCard,
          {
            backgroundColor: colors.secondarySystemGroupedBackground,
          },
        ]}
      >
        <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
          Персональний аналіз
        </Text>

        <Text
          style={[styles.subSectionLabel, { color: colors.secondaryLabel }]}
        >
          Що чудово у цій страві:
        </Text>
        <View style={[styles.insightRow, styles.goodInsightBorder]}>
          <NativeIcon
            sf="checkmark.circle.fill"
            ion="checkmark-circle-outline"
            size={18}
            color={colors.accent}
          />
          <Text
            style={[styles.insightText, { color: colors.label }]}
            selectable
          >
            {result.whatIsGood}
          </Text>
        </View>

        <Text
          style={[styles.subSectionLabel, { color: colors.secondaryLabel }]}
        >
          Потенційні ризики для вас:
        </Text>
        <View style={[styles.insightRow, styles.riskInsightBorder]}>
          <NativeIcon
            sf="exclamationmark.triangle.fill"
            ion="warning-outline"
            size={18}
            color={colors.systemOrange}
          />
          <Text
            style={[styles.insightText, { color: colors.label }]}
            selectable
          >
            {result.risks}
          </Text>
        </View>

        <Text
          style={[styles.subSectionLabel, { color: colors.secondaryLabel }]}
        >
          Висновок дієтолога:
        </Text>
        <View style={styles.summaryBox}>
          <Text
            style={[styles.summaryText, { color: colors.label }]}
            selectable
          >
            {result.summary}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  resultHeaderCard: {
    padding: 16,
    borderRadius: 14,
    borderCurve: "continuous",
    marginBottom: 16,
    alignItems: "center",
  },
  resultLabel: {
    fontSize: 13,
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "uppercase",
  },
  resultFoodName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  resultsCard: {
    padding: 16,
    borderRadius: 14,
    borderCurve: "continuous",
    marginBottom: 16,
  },
  resultsCardTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
  },
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
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  ingredientName: {
    fontSize: 15,
    flex: 1,
  },
  ingredientWeight: {
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 10,
  },
  subSectionLabel: {
    fontSize: 13,
    fontWeight: "600",
    marginTop: 16,
    marginBottom: 8,
    textTransform: "uppercase",
  },
  insightRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 12,
    borderRadius: 10,
    borderCurve: "continuous",
    borderLeftWidth: 3,
  },
  goodInsightBorder: {
    borderLeftColor: colors.accent,
  },
  riskInsightBorder: {
    borderLeftColor: colors.systemOrange,
  },
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    marginLeft: 10,
  },
  summaryBox: {
    backgroundColor: "rgba(255,255,255,0.03)",
    padding: 14,
    borderRadius: 10,
    borderCurve: "continuous",
    marginTop: 4,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
});
