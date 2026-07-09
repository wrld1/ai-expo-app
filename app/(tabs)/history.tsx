import HistoryEmptyState from "@/components/history/HistoryEmptyState";
import HistoryItemCard from "@/components/history/HistoryItemCard";
import HistoryItemModal from "@/components/history/HistoryItemModal";
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

export default function HistoryScreen() {
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
        <HistoryEmptyState
          onScanPress={() => {
            triggerHapticLight();
            router.push("/");
          }}
        />
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
});
