import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { colors } from "../../constants/theme";
import { useHistory } from "../../context/HistoryContext";
import { HistoryItem } from "../../types/history";
import {
  triggerHapticLight,
  triggerHapticMedium,
  triggerHapticSuccess,
} from "../../utils/haptics";
import HistoryItemModal from "./HistoryItemModal";
import NativeIcon from "../ui/NativeIcon";

import HistoryItemCard from "./HistoryItemCard";

export default function HistoryView() {
  const { history, deleteHistoryItem, clearHistory } = useHistory();
  const [selectedItem, setSelectedItem] = useState<HistoryItem | null>(null);
  const router = useRouter();

  const handleDelete = (id: string) => {
    triggerHapticMedium();
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
            triggerHapticSuccess();
          },
        },
      ],
    );
  };

  const handleClearAll = () => {
    triggerHapticMedium();
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
            triggerHapticSuccess();
          },
        },
      ],
    );
  };

  const renderHistoryItem = ({ item }: { item: HistoryItem }) => (
    <HistoryItemCard
      item={item}
      onPress={setSelectedItem}
      onDelete={handleDelete}
    />
  );

  return (
    <SafeAreaView
      style={[
        styles.container,
        { backgroundColor: colors.systemGroupedBackground },
      ]}
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
            showsVerticalScrollIndicator={false}
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
              triggerHapticLight();
              router.push("/" as any);
            }}
            activeOpacity={0.8}
          >
            <Text style={styles.scanButtonText}>Скан їжі</Text>
          </TouchableOpacity>
        </View>
      )}

      <HistoryItemModal
        visible={selectedItem !== null}
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onDelete={(id) => {
          handleDelete(id);
          setSelectedItem(null);
        }}
      />
    </SafeAreaView>
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
  },
  scanButtonText: {
    color: "#121417",
    fontSize: 15,
    fontWeight: "700",
  },
});
