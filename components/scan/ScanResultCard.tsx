import { StyleSheet, Text, View } from "react-native";
import { colors, nativeStyles } from "../../constants/theme";
import { ScanResult } from "../../types/history";
import MacroProgress from "./MacroProgress";
import Card from "../ui/Card";
import NativeIcon from "../ui/NativeIcon";

interface ScanResultCardProps {
  result: ScanResult;
}

export default function ScanResultCard({ result }: ScanResultCardProps) {
  return (
    <View style={styles.container}>
      <Card style={styles.resultHeaderCardOverrides}>
        <Text style={[nativeStyles.sectionTitle, { marginBottom: 4 }]}>
          AI проаналізував фото:
        </Text>
        <Text
          style={[styles.resultFoodName, { color: colors.label }]}
          selectable
        >
          {result.foodName}
        </Text>
      </Card>

      <Card style={styles.resultsCardOverrides}>
        <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
          Макронутрієнти
        </Text>

        <MacroProgress
          value={result.calories}
          total={1000}
          label="Калорійність"
          color="#FF5252"
          suffix=" ккал"
        />
        <MacroProgress
          value={result.protein}
          total={80}
          label="Білки"
          color="#4CAF50"
        />
        <MacroProgress
          value={result.fat}
          total={70}
          label="Жири"
          color="#FFC107"
        />
        <MacroProgress
          value={result.carbs}
          total={150}
          label="Вуглеводи"
          color="#00BCD4"
        />
      </Card>

      {result.ingredients && result.ingredients.length > 0 && (
        <Card style={styles.resultsCardOverrides}>
          <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
            Виявлені інгредієнти
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
        </Card>
      )}

      <Card style={styles.resultsCardOverrides}>
        <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
          Детальний аналіз
        </Text>

        <View style={styles.sectionHeaderRow}>
          <NativeIcon
            sf="checkmark.circle.fill"
            ion="checkmark-circle-outline"
            size={18}
            color={colors.accent}
          />
          <Text
            style={[
              nativeStyles.sectionTitle,
              { marginTop: 0, marginBottom: 0, marginLeft: 8 },
            ]}
          >
            Плюси страви:
          </Text>
        </View>
        <View style={[nativeStyles.innerBox]}>
          <Text
            style={[styles.insightText, { color: colors.label }]}
            selectable
          >
            {result.whatIsGood}
          </Text>
        </View>

        <View style={styles.sectionHeaderRow}>
          <NativeIcon
            sf="exclamationmark.triangle.fill"
            ion="warning-outline"
            size={18}
            color={colors.systemOrange}
          />
          <Text
            style={[
              nativeStyles.sectionTitle,
              { marginTop: 0, marginBottom: 0, marginLeft: 8 },
            ]}
          >
            Потенційні ризики для вас:
          </Text>
        </View>
        <View style={[nativeStyles.innerBox]}>
          <Text
            style={[styles.insightText, { color: colors.label }]}
            selectable
          >
            {result.risks}
          </Text>
        </View>

        <Text style={[nativeStyles.sectionTitle, { marginTop: 16 }]}>
          Висновок AI:
        </Text>
        <View style={[nativeStyles.innerBox]}>
          <Text
            style={[styles.summaryText, { color: colors.label }]}
            selectable
          >
            {result.summary}
          </Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
  },
  resultHeaderCardOverrides: {
    padding: 16,
    marginBottom: 16,
    alignItems: "center",
  },
  resultFoodName: {
    fontSize: 22,
    fontWeight: "700",
    textAlign: "center",
  },
  resultsCardOverrides: {
    padding: 16,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
    marginTop: 8,
    marginLeft: 16,
  },
  resultsCardTitle: {
    fontSize: 18,
    fontWeight: "700",
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
  insightText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 22,
    fontWeight: "500",
  },
});
