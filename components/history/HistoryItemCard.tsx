import { Image } from "expo-image";
import React from "react";
import { Alert, StyleSheet, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { colors } from "../../constants/theme";
import { HistoryItem } from "../../types/history";
import { formatUkDate } from "../../utils/date";
import { triggerHapticLight } from "../../utils/haptics";
import Card from "../ui/Card";

interface HistoryItemCardProps {
  item: HistoryItem;
  onPress: (item: HistoryItem) => void;
  onDelete: (id: string) => void;
}

export default function HistoryItemCard({
  item,
  onPress,
  onDelete,
}: HistoryItemCardProps) {
  const { result } = item;

  const macros = [
    { label: "ккал", value: result.calories },
    { label: "Б", value: result.protein, suffix: "г" },
    { label: "Ж", value: result.fat, suffix: "г" },
    { label: "В", value: result.carbs, suffix: "г" },
  ];

  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <Card
        style={styles.cardOverrides}
        onPress={() => {
          triggerHapticLight();
          onPress(item);
        }}
        onLongPress={() => {
          triggerHapticLight();
          Alert.alert(
            "Видалити запис?",
            "Ви впевнені, що хочете видалити цей запис з журналу?",
            [
              { text: "Скасувати", style: "cancel" },
              {
                text: "Видалити",
                style: "destructive",
                onPress: () => onDelete(item.id),
              },
            ],
          );
        }}
        activeOpacity={0.8}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.cardImage}
          contentFit="cover"
          transition={200}
        />
        <View style={styles.cardInfo}>
          <Text style={[styles.cardDate, { color: colors.secondaryLabel }]}>
            {formatUkDate(item.date)}
          </Text>
          <Text
            style={[styles.cardTitle, { color: colors.label }]}
            numberOfLines={1}
          >
            {result.foodName}
          </Text>

          <View style={styles.kbjvGrid}>
            {macros.map((macro, index, arr) => (
              <React.Fragment key={macro.label}>
                <View style={styles.kbjvItem}>
                  <Text
                    style={[styles.kbjvLabel, { color: colors.secondaryLabel }]}
                  >
                    {macro.label}
                  </Text>
                  <Text
                    style={[
                      styles.kbjvValue,
                      { color: colors.label, fontVariant: ["tabular-nums"] },
                    ]}
                  >
                    {macro.value}
                    {macro.suffix}
                  </Text>
                </View>
                {index < arr.length - 1 && (
                  <View
                    style={[
                      styles.kbjvDivider,
                      { backgroundColor: colors.separator },
                    ]}
                  />
                )}
              </React.Fragment>
            ))}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOverrides: {
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
  },
  cardImage: {
    width: 64,
    height: 64,
    borderRadius: 8,
    borderCurve: "continuous",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  cardInfo: {
    flex: 1,
    marginLeft: 12,
    marginRight: 6,
  },
  cardDate: {
    fontSize: 11,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 6,
  },
  kbjvGrid: {
    flexDirection: "row",
    alignItems: "center",
  },
  kbjvItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  kbjvValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  kbjvLabel: {
    fontSize: 12,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  kbjvDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 8,
  },
});
