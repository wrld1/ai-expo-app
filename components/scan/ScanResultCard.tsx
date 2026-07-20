import { getWarningText } from "@/constants/warning-text";
import { StyleSheet, Text, View } from "react-native";
import { colors, nativeStyles } from "../../constants/theme";
import { AllergyAlert, Likelihood, ScanResult } from "../../types/history";
import Card from "../ui/Card";
import Divider from "../ui/Divider";
import NativeIcon from "../ui/NativeIcon";
import ShimmerOverlay from "../ui/ShimmerOverlay";
import AlertCard from "./AlertCard";
import MacroProgress from "./MacroProgress";

interface ScanResultCardProps {
  result: ScanResult;
  isCorrecting?: boolean;
}

const LIKELIHOOD_TEXT: Record<Likelihood, string> = {
  certain: "виявлено у складі",
  likely: "ймовірно присутній",
  possible: "можливий",
};

/** Записи зі старої історії зберігалися як рядок — показуємо і їх. */
function normalizeAllergyAlert(
  alert: AllergyAlert | string,
): { label: string; likelihood?: Likelihood; matchedIn: string[] } {
  if (typeof alert === "string") {
    return { label: alert, matchedIn: [] };
  }
  return {
    label: alert.label || alert.allergen,
    likelihood: alert.likelihood,
    matchedIn: alert.matchedIn ?? [],
  };
}

export default function ScanResultCard({ result, isCorrecting }: ScanResultCardProps) {
  return (
    <View style={[styles.container, isCorrecting && { opacity: 0.8 }]}>
      <Card style={styles.resultHeaderCardOverrides}>
        <Text style={[nativeStyles.sectionTitle, { marginBottom: 4 }]}>
          Результат аналізу:
        </Text>
        <Text
          style={[styles.resultFoodName, { color: colors.label }]}
          selectable
        >
          {result.foodName}
        </Text>
        {isCorrecting && <ShimmerOverlay />}
      </Card>

      {result.allergyAlerts && result.allergyAlerts.length > 0 && (
        <AlertCard variant="danger" title="Увага! Алергени">
          {result.allergyAlerts.map((alert, idx) => {
            const item = normalizeAllergyAlert(alert);
            return (
              <Text
                key={idx}
                style={{
                  color: colors.label,
                  fontSize: 13,
                  lineHeight: 18,
                  marginBottom: 4,
                }}
              >
                • <Text style={{ fontWeight: "700" }}>{item.label}</Text>
                {item.likelihood ? ` — ${LIKELIHOOD_TEXT[item.likelihood]}` : ""}
                {item.matchedIn.length > 0 ? ` (${item.matchedIn.join(", ")})` : ""}
              </Text>
            );
          })}
          <Text
            style={{
              color: colors.secondaryLabel,
              fontSize: 12,
              lineHeight: 16,
              marginTop: 4,
            }}
          >
            Це оцінка AI, а не гарантія складу. При серйозній алергії перевіряйте
            склад у виробника.
          </Text>
        </AlertCard>
      )}

      {result.medicalAdviceRequested && (
        <AlertCard variant="warning" title="Медичне застереження">
          Штучний інтелект не може надавати медичні діагнози або поради.
        </AlertCard>
      )}

      {result.warnings && result.warnings.length > 0 && (
        <AlertCard variant="info" title="Зауваження щодо аналізу">
          {result.warnings.map((w, idx) => (
            <Text
              key={idx}
              style={{
                color: colors.label,
                fontSize: 13,
                lineHeight: 18,
                marginBottom: 4,
              }}
            >
              • {getWarningText(w)}
            </Text>
          ))}
        </AlertCard>
      )}

      {result.confidence === "low" &&
        (!result.warnings || result.warnings.length === 0) && (
          <AlertCard variant="info">
            <Text
              style={{
                color: colors.systemYellow,
                fontSize: 13,
                fontWeight: "600",
              }}
            >
              Низька впевненість розпізнавання. Будь ласка, перевірте
              результати.
            </Text>
          </AlertCard>
        )}

      <Card style={styles.resultsCardOverrides}>
        {isCorrecting && <ShimmerOverlay />}
        <Text
          style={[
            styles.resultsCardTitle,
            { color: colors.label, marginBottom: 12 },
          ]}
        >
          Макронутрієнти
        </Text>

        {result.dailyNorm?.percentOfNorm != null && (
          <Text
            style={{
              color: colors.secondaryLabel,
              fontSize: 13,
              marginBottom: 12,
            }}
          >
            {result.dailyNorm.percentOfNorm}% вашої добової норми (
            {result.dailyNorm.calories} ккал)
          </Text>
        )}

        <MacroProgress
          value={result.calories}
          total={result.dailyNorm?.calories ?? 1000}
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
          {isCorrecting && <ShimmerOverlay />}
          <Text
            style={[
              styles.resultsCardTitle,
              { color: colors.label, marginBottom: 4 },
            ]}
          >
            Виявлені інгредієнти
          </Text>
          {result.ingredients.map((ing, idx) => (
            <View key={idx}>
              <View style={styles.ingredientRow}>
                <Text style={[styles.ingredientName, { color: colors.label }]}>
                  • {ing.name}
                </Text>
                <Text
                  style={[styles.ingredientWeight, { color: colors.accent }]}
                >
                  {ing.weight}
                </Text>
              </View>
              {idx < result.ingredients!.length - 1 && <Divider />}
            </View>
          ))}
        </Card>
      )}

      <Card style={styles.resultsCardOverrides}>
        {isCorrecting && <ShimmerOverlay />}
        <Text style={[styles.resultsCardTitle, { color: colors.label }]}>
          Детальний аналіз
        </Text>

        {result.whatIsGood && result.whatIsGood.length > 0 && (
          <View>
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
              {result.whatIsGood.map((item, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.insightText,
                    { color: colors.label, marginBottom: 4 },
                  ]}
                  selectable
                >
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        {result.risks && result.risks.length > 0 && (
          <View>
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
              {result.risks.map((item, idx) => (
                <Text
                  key={idx}
                  style={[
                    styles.insightText,
                    { color: colors.label, marginBottom: 4 },
                  ]}
                  selectable
                >
                  • {item}
                </Text>
              ))}
            </View>
          </View>
        )}

        <View style={styles.sectionHeaderRow}>
          <NativeIcon
            sf="brain.head.profile"
            ion="bulb-outline"
            size={18}
            color={colors.accent}
          />
          <Text
            style={[
              nativeStyles.sectionTitle,
              { marginTop: 0, marginBottom: 0, marginLeft: 8 },
            ]}
          >
            Висновок AI:
          </Text>
        </View>
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
    marginTop: 16,
  },
  resultsCardTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
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
