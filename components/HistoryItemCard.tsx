import { Image } from "expo-image";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { colors } from "../constants/theme";
import { HistoryItem } from "../types/history";
import { formatUkDate } from "../utils/date";
import { triggerHapticLight } from "../utils/haptics";
import NativeIcon from "./NativeIcon";

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
  return (
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <TouchableOpacity
        style={[
          styles.card,
          {
            backgroundColor: colors.secondarySystemGroupedBackground,
            borderColor: colors.separator,
          },
        ]}
        onPress={() => {
          triggerHapticLight();
          onPress(item);
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
            <View style={styles.kbjvItem}>
              <Text
                style={[
                  styles.kbjvValue,
                  { color: colors.label, fontVariant: ["tabular-nums"] },
                ]}
              >
                {result.calories}
              </Text>
              <Text
                style={[styles.kbjvLabel, { color: colors.secondaryLabel }]}
              >
                ккал
              </Text>
            </View>
            <View
              style={[
                styles.kbjvDivider,
                { backgroundColor: colors.separator },
              ]}
            />
            <View style={styles.kbjvItem}>
              <Text
                style={[
                  styles.kbjvValue,
                  { color: colors.label, fontVariant: ["tabular-nums"] },
                ]}
              >
                {result.protein}г
              </Text>
              <Text
                style={[styles.kbjvLabel, { color: colors.secondaryLabel }]}
              >
                Б
              </Text>
            </View>
            <View
              style={[
                styles.kbjvDivider,
                { backgroundColor: colors.separator },
              ]}
            />
            <View style={styles.kbjvItem}>
              <Text
                style={[
                  styles.kbjvValue,
                  { color: colors.label, fontVariant: ["tabular-nums"] },
                ]}
              >
                {result.fat}г
              </Text>
              <Text
                style={[styles.kbjvLabel, { color: colors.secondaryLabel }]}
              >
                Ж
              </Text>
            </View>
            <View
              style={[
                styles.kbjvDivider,
                { backgroundColor: colors.separator },
              ]}
            />
            <View style={styles.kbjvItem}>
              <Text
                style={[
                  styles.kbjvValue,
                  { color: colors.label, fontVariant: ["tabular-nums"] },
                ]}
              >
                {result.carbs}г
              </Text>
              <Text
                style={[styles.kbjvLabel, { color: colors.secondaryLabel }]}
              >
                В
              </Text>
            </View>
          </View>
        </View>
        <TouchableOpacity
          style={styles.cardDeleteBtn}
          onPress={() => onDelete(item.id)}
          activeOpacity={0.7}
        >
          <NativeIcon
            sf="trash"
            color={colors.systemRed}
            size={18}
            ion="trash-outline"
          />
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 16,
    borderCurve: "continuous",
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
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
    flexDirection: "column",
  },
  kbjvValue: {
    fontSize: 12,
    fontWeight: "700",
  },
  kbjvLabel: {
    fontSize: 9,
    fontWeight: "500",
    textTransform: "uppercase",
  },
  kbjvDivider: {
    width: 1,
    height: 14,
    marginHorizontal: 8,
  },
  cardDeleteBtn: {
    padding: 8,
  },
});
