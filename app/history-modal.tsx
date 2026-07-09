import { Image } from "expo-image";
import { useLocalSearchParams, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import CorrectionHistoryList from "../components/history/CorrectionHistoryList";
import ScanResultCard from "../components/scan/ScanResultCard";
import Button from "../components/ui/Button";
import NativeIcon from "../components/ui/NativeIcon";
import { colors } from "../constants/theme";
import { useHistory } from "../context/HistoryContext";
import { formatUkDate } from "../utils/date";
import { triggerHapticLight } from "../utils/haptics";

export default function HistoryModalScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { history, deleteHistoryItem } = useHistory();
  const router = useRouter();

  const item = useMemo(() => history.find((h) => h.id === id), [history, id]);

  if (!item) {
    return (
      <View
        style={[
          styles.modalContent,
          {
            backgroundColor: colors.systemGroupedBackground,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ color: colors.secondaryLabel }}>Запис не знайдено</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.modalContent,
        { backgroundColor: colors.systemGroupedBackground },
      ]}
    >
      <View
        style={[styles.modalHeader, { borderBottomColor: colors.separator }]}
      >
        <Text
          style={[styles.modalHeaderTitle, { color: colors.label }]}
          numberOfLines={1}
        >
          {item.result.foodName}
        </Text>
        <TouchableOpacity
          style={styles.closeModalBtn}
          onPress={() => {
            triggerHapticLight();
            router.back();
          }}
        >
          <NativeIcon sf="xmark" ion="close" size={24} color={colors.label} />
        </TouchableOpacity>
      </View>

      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.modalScroll}
      >
        <Image
          source={{ uri: item.imageUri }}
          style={styles.modalImage}
          contentFit="cover"
        />

        <Text style={[styles.modalDate, { color: colors.secondaryLabel }]}>
          Проаналізовано: {formatUkDate(item.date)}
        </Text>

        <ScanResultCard result={item.result} />
        <CorrectionHistoryList history={item.correctionHistory} />

        <View style={styles.modalFooterActions}>
          <Button
            title="Видалити запис"
            variant="destructive"
            icon={
              <NativeIcon
                sf="trash"
                size={18}
                color="#FFFFFF"
                ion="trash-outline"
              />
            }
            onPress={async () => {
              triggerHapticLight();
              await deleteHistoryItem(item.id);
              router.back();
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  modalContent: {
    flex: 1,
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
    marginBottom: 12,
    textAlign: "center",
  },
  modalFooterActions: {
    alignItems: "center",
    marginTop: 8,
  },
});
