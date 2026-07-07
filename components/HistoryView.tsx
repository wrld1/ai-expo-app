import * as Haptics from "expo-haptics";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Modal,
  Platform,
  PlatformColor,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { HistoryItem, useHistory } from "../context/HistoryContext";
import NativeIcon from "./NativeIcon";

const formatUkDate = (dateString: string) => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();

    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeOptions: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };
    const timeStr = date.toLocaleTimeString("uk-UA", timeOptions);

    if (isToday) {
      return `Сьогодні о ${timeStr}`;
    }
    if (isYesterday) {
      return `Вчора о ${timeStr}`;
    }

    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "long",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("uk-UA", options);
  } catch {
    return dateString;
  }
};

const colors = {
  label: Platform.select({
    ios: PlatformColor("label") as any,
    android: PlatformColor("?attr/colorOnSurface") as any,
    default: "#FFFFFF",
  }),
  secondaryLabel: Platform.select({
    ios: PlatformColor("secondaryLabel") as any,
    android: PlatformColor("?attr/colorOnSurfaceVariant") as any,
    default: "#8E8E93",
  }),
  systemBackground: Platform.select({
    ios: PlatformColor("systemBackground") as any,
    android: PlatformColor("?attr/colorBackground") as any,
    default: "#121417",
  }),
  secondarySystemGroupedBackground: Platform.select({
    ios: PlatformColor("secondarySystemGroupedBackground") as any,
    android: PlatformColor("?attr/colorSurfaceContainer") as any,
    default: "#1C1C1E",
  }),
  separator: Platform.select({
    ios: PlatformColor("separator") as any,
    android: PlatformColor("?attr/colorOutlineVariant") as any,
    default: "rgba(255,255,255,0.08)",
  }),
  accent: Platform.select({
    ios: PlatformColor("systemGreen") as any,
    android: PlatformColor("?attr/colorPrimary") as any,
    default: "#2CE2A2",
  }),
  systemRed: Platform.select({
    ios: PlatformColor("systemRed") as any,
    android: PlatformColor("?attr/colorError") as any,
    default: "#FF453A",
  }),
  systemOrange: Platform.select({
    ios: PlatformColor("systemOrange") as any,
    android: PlatformColor("?attr/colorTertiary") as any,
    default: "#FF9500",
  }),
  placeholder: "#6B7280",
};

export default function HistoryView() {
  const { history, deleteHistoryItem, clearHistory } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const router = useRouter();

  const triggerHaptic = (
    style: Haptics.ImpactFeedbackStyle = Haptics.ImpactFeedbackStyle.Light,
  ) => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(style).catch(() => {});
    }
  };

  const triggerSuccessHaptic = () => {
    if (Platform.OS === "ios") {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(
        () => {},
      );
    }
  };

  const handleDelete = (id: string) => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Видалити запис?",
      "Ви впевнені, що хочете видалити цей аналіз з історії?",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Видалити",
          style: "destructive",
          onPress: async () => {
            await deleteHistoryItem(id);
            if (selectedItem?.id === id) {
              setSelectedItem(null);
            }
            triggerSuccessHaptic();
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    triggerHaptic(Haptics.ImpactFeedbackStyle.Medium);
    Alert.alert(
      "Очистити історію?",
      "Це видалить всі проаналізовані страви. Цю дію неможливо скасувати.",
      [
        { text: "Скасувати", style: "cancel" },
        {
          text: "Очистити",
          style: "destructive",
          onPress: async () => {
            await clearHistory();
            setSelectedItem(null);
            triggerSuccessHaptic();
          },
        },
      ],
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => {
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
            triggerHaptic();
            setSelectedItem(item);
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
            onPress={() => handleDelete(item.id)}
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
  };

  return (
    <View
      style={[styles.container, { backgroundColor: colors.systemBackground }]}
    >
      {history.length > 0 ? (
        <View style={{ flex: 1 }}>
          <View style={styles.headerBar}>
            <Text style={[styles.countText, { color: colors.secondaryLabel }]}>
              Всього страв: {history.length}
            </Text>
            <TouchableOpacity
              onPress={handleClearAll}
              style={styles.clearAllBtn}
            >
              <Text
                style={[styles.clearAllBtnText, { color: colors.systemRed }]}
              >
                Очистити все
              </Text>
            </TouchableOpacity>
          </View>
          <FlatList
            data={history}
            keyExtractor={(item) => item.id}
            renderItem={renderHistoryItem}
            contentContainerStyle={styles.listContent}
            contentInsetAdjustmentBehavior="automatic"
          />
        </View>
      ) : (
        <View style={styles.emptyContainer}>
          <View
            style={[
              styles.emptyIconCircle,
              { backgroundColor: "rgba(44, 226, 162, 0.1)" },
            ]}
          >
            <NativeIcon
              sf="book.closed"
              ion="journal-outline"
              size={42}
              color={colors.accent}
            />
          </View>
          <Text style={[styles.emptyTitle, { color: colors.label }]}>
            Журнал порожній
          </Text>
          <Text
            style={[styles.emptySubtitle, { color: colors.secondaryLabel }]}
          >
            {
              "Тут з'являтимуться страви, які ви сфотографуєте та проаналізуєте."
            }
          </Text>
          <TouchableOpacity
            style={[styles.scanButton, { backgroundColor: colors.accent }]}
            onPress={() => {
              triggerHaptic();
              router.push("/" as any);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.scanButtonText}>Скан їжі</Text>
          </TouchableOpacity>
        </View>
      )}

      <Modal
        visible={selectedItem !== null}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedItem(null)}
      >
        {selectedItem && (
          <View style={styles.modalOverlay}>
            <View
              style={[
                styles.modalContent,
                { backgroundColor: colors.systemBackground },
              ]}
            >
              <View
                style={[
                  styles.modalHeader,
                  { borderBottomColor: colors.separator },
                ]}
              >
                <Text
                  style={[styles.modalHeaderTitle, { color: colors.label }]}
                  numberOfLines={1}
                >
                  {selectedItem.result.foodName}
                </Text>
                <TouchableOpacity
                  style={styles.closeModalBtn}
                  onPress={() => {
                    triggerHaptic();
                    setSelectedItem(null);
                  }}
                >
                  <NativeIcon
                    sf="xmark"
                    ion="close"
                    size={24}
                    color={colors.label}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                contentContainerStyle={styles.modalScroll}
              >
                <Image
                  source={{ uri: selectedItem.imageUri }}
                  style={styles.modalImage}
                  contentFit="cover"
                />

                <Text
                  style={[styles.modalDate, { color: colors.secondaryLabel }]}
                >
                  Проаналізовано: {formatUkDate(selectedItem.date)}
                </Text>

                <View style={styles.modalKbjvContainer}>
                  <View
                    style={[
                      styles.modalKbjvCard,
                      {
                        backgroundColor:
                          colors.secondarySystemGroupedBackground,
                        borderColor: colors.separator,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalKbjvValue,
                        { color: colors.label, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {selectedItem.result.calories}
                    </Text>
                    <Text
                      style={[
                        styles.modalKbjvLabel,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      Калорії
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalKbjvCard,
                      {
                        backgroundColor:
                          colors.secondarySystemGroupedBackground,
                        borderColor: colors.separator,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalKbjvValue,
                        { color: colors.label, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {selectedItem.result.protein}г
                    </Text>
                    <Text
                      style={[
                        styles.modalKbjvLabel,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      Білки
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalKbjvCard,
                      {
                        backgroundColor:
                          colors.secondarySystemGroupedBackground,
                        borderColor: colors.separator,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalKbjvValue,
                        { color: colors.label, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {selectedItem.result.fat}г
                    </Text>
                    <Text
                      style={[
                        styles.modalKbjvLabel,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      Жири
                    </Text>
                  </View>
                  <View
                    style={[
                      styles.modalKbjvCard,
                      {
                        backgroundColor:
                          colors.secondarySystemGroupedBackground,
                        borderColor: colors.separator,
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.modalKbjvValue,
                        { color: colors.label, fontVariant: ["tabular-nums"] },
                      ]}
                    >
                      {selectedItem.result.carbs}г
                    </Text>
                    <Text
                      style={[
                        styles.modalKbjvLabel,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      Вуглеводи
                    </Text>
                  </View>
                </View>

                <Text style={[styles.subSectionTitle, { color: colors.label }]}>
                  Інгредієнти страви
                </Text>
                <View
                  style={[
                    styles.ingredientsCard,
                    {
                      backgroundColor: colors.secondarySystemGroupedBackground,
                      borderColor: colors.separator,
                    },
                  ]}
                >
                  {selectedItem.result.ingredients.map((ing, idx) => (
                    <View
                      key={idx}
                      style={[
                        styles.ingredientRow,
                        { borderBottomColor: colors.separator },
                      ]}
                    >
                      <Text
                        style={[styles.ingredientName, { color: colors.label }]}
                      >
                        • {ing.name}
                      </Text>
                      <Text
                        style={[
                          styles.ingredientWeight,
                          { color: colors.accent },
                        ]}
                      >
                        {ing.weight}
                      </Text>
                    </View>
                  ))}
                </View>

                <Text style={[styles.subSectionTitle, { color: colors.label }]}>
                  Чому це корисно
                </Text>
                <View
                  style={[
                    styles.insightCard,
                    styles.goodInsightBorder,
                    {
                      backgroundColor: colors.secondarySystemGroupedBackground,
                    },
                  ]}
                >
                  <NativeIcon
                    sf="checkmark.circle.fill"
                    ion="checkmark-circle-outline"
                    size={20}
                    color={colors.accent}
                  />
                  <Text
                    style={[styles.insightText, { color: colors.label }]}
                    selectable
                  >
                    {selectedItem.result.whatIsGood}
                  </Text>
                </View>

                <Text style={[styles.subSectionTitle, { color: colors.label }]}>
                  Застереження та ризики
                </Text>
                <View
                  style={[
                    styles.insightCard,
                    styles.riskInsightBorder,
                    {
                      backgroundColor: colors.secondarySystemGroupedBackground,
                    },
                  ]}
                >
                  <NativeIcon
                    sf="exclamationmark.triangle.fill"
                    ion="warning-outline"
                    size={20}
                    color={colors.systemOrange}
                  />
                  <Text
                    style={[styles.insightText, { color: colors.label }]}
                    selectable
                  >
                    {selectedItem.result.risks}
                  </Text>
                </View>

                <Text style={[styles.subSectionTitle, { color: colors.label }]}>
                  Загальний висновок
                </Text>
                <View
                  style={[
                    styles.summaryCard,
                    {
                      backgroundColor: colors.secondarySystemGroupedBackground,
                      borderColor: colors.separator,
                    },
                  ]}
                >
                  <Text
                    style={[styles.summaryText, { color: colors.label }]}
                    selectable
                  >
                    {selectedItem.result.summary}
                  </Text>
                </View>

                {selectedItem.correctionHistory &&
                  selectedItem.correctionHistory.length > 0 && (
                    <View style={{ marginTop: 10 }}>
                      <Text
                        style={[
                          styles.subSectionTitle,
                          { color: colors.label },
                        ]}
                      >
                        Історія уточнень
                      </Text>
                      {selectedItem.correctionHistory.map((corr, idx) => (
                        <View
                          key={idx}
                          style={[
                            styles.correctionHistoryRow,
                            {
                              backgroundColor:
                                colors.secondarySystemGroupedBackground,
                              borderColor: colors.separator,
                            },
                          ]}
                        >
                          <View style={styles.corrUserBubble}>
                            <Text
                              style={[
                                styles.corrUserText,
                                { color: colors.label },
                              ]}
                            >
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
                            <Text
                              style={[
                                styles.corrAiText,
                                { color: colors.accent },
                              ]}
                            >
                              AI оновив страву на: {corr.result.foodName} (
                              {corr.result.calories} ккал)
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  )}

                <View style={styles.modalFooterActions}>
                  <TouchableOpacity
                    style={[
                      styles.modalDeleteBtn,
                      { backgroundColor: colors.systemRed },
                    ]}
                    onPress={() => handleDelete(selectedItem.id)}
                  >
                    <NativeIcon
                      sf="trash"
                      size={18}
                      color="#FFFFFF"
                      ion="trash-outline"
                      style={{ marginRight: 6 }}
                    />
                    <Text style={styles.modalDeleteBtnText}>
                      Видалити запис
                    </Text>
                  </TouchableOpacity>
                </View>
              </ScrollView>
            </View>
          </View>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 6,
  },
  countText: {
    fontSize: 13,
    fontWeight: "500",
  },
  clearAllBtn: {
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  clearAllBtnText: {
    fontSize: 13,
    fontWeight: "500",
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
  },
  card: {
    borderRadius: 12,
    borderCurve: "continuous",
    flexDirection: "row",
    padding: 12,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
  emptyIconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 20,
  },
  scanButton: {
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 12,
    paddingHorizontal: 28,
    boxShadow: "0 4px 12px rgba(44, 226, 162, 0.15)",
  },
  scanButtonText: {
    color: "#121417",
    fontSize: 15,
    fontWeight: "700",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "flex-end",
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderCurve: "continuous",
    height: "90%",
    width: "100%",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalHeaderTitle: {
    fontSize: 17,
    fontWeight: "700",
    flex: 1,
    marginRight: 10,
  },
  closeModalBtn: {
    padding: 4,
  },
  modalScroll: {
    padding: 16,
    paddingBottom: 40,
  },
  modalImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
    borderCurve: "continuous",
    marginBottom: 12,
    backgroundColor: "rgba(255, 255, 255, 0.02)",
  },
  modalDate: {
    fontSize: 12,
    marginBottom: 16,
    textAlign: "center",
  },
  modalKbjvContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  modalKbjvCard: {
    flex: 1,
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 12,
    alignItems: "center",
    marginHorizontal: 3,
    borderWidth: 1,
  },
  modalKbjvValue: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 2,
  },
  modalKbjvLabel: {
    fontSize: 10,
    fontWeight: "500",
  },
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  ingredientsCard: {
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 12,
    borderWidth: 1,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 6,
    borderBottomWidth: 1,
  },
  ingredientName: {
    fontSize: 14,
  },
  ingredientWeight: {
    fontSize: 14,
    fontWeight: "600",
  },
  insightCard: {
    flexDirection: "row",
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 12,
    borderLeftWidth: 4,
    alignItems: "flex-start",
  },
  goodInsightBorder: {
    borderLeftColor: "#2CE2A2",
  },
  riskInsightBorder: {
    borderLeftColor: "#FF9500",
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 10,
    flex: 1,
  },
  summaryCard: {
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 12,
    borderWidth: 1,
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
  correctionHistoryRow: {
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
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
    borderLeftWidth: 2,
    borderLeftColor: "#2CE2A2",
  },
  corrAiText: {
    fontSize: 12,
  },
  modalFooterActions: {
    marginTop: 24,
    alignItems: "center",
  },
  modalDeleteBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    borderCurve: "continuous",
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  modalDeleteBtnText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
  },
});
