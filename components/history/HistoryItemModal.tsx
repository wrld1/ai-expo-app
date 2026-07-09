import { Image } from "expo-image";
import React from "react";
import {
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/theme";
import { HistoryItem } from "../../types/history";
import { formatUkDate } from "../../utils/date";
import { triggerHapticLight } from "../../utils/haptics";
import ScanResultCard from "../scan/ScanResultCard";
import Card from "../ui/Card";
import NativeIcon from "../ui/NativeIcon";

interface HistoryItemModalProps {
  visible: boolean;
  item: HistoryItem | null;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function HistoryItemModal({
  visible,
  item,
  onClose,
  onDelete,
}: HistoryItemModalProps) {
  if (!item) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.systemGroupedBackground },
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
              {item.result.foodName}
            </Text>
            <TouchableOpacity
              style={styles.closeModalBtn}
              onPress={() => {
                triggerHapticLight();
                onClose();
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
              source={{ uri: item.imageUri }}
              style={styles.modalImage}
              contentFit="cover"
            />

            <Text style={[styles.modalDate, { color: colors.secondaryLabel }]}>
              Проаналізовано: {formatUkDate(item.date)}
            </Text>

            <ScanResultCard result={item.result} />

            {item.correctionHistory && item.correctionHistory.length > 0 && (
              <View style={{ marginTop: 10 }}>
                <Text style={[styles.subSectionTitle, { color: colors.label }]}>
                  Історія уточнень
                </Text>
                {item.correctionHistory.map((corr, idx) => (
                  <Card key={idx} style={styles.correctionHistoryRowOverrides}>
                    <View style={styles.corrUserBubble}>
                      <Text
                        style={[styles.corrUserText, { color: colors.label }]}
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
                        style={[styles.corrAiText, { color: colors.accent }]}
                      >
                        AI оновив страву на: {corr.result.foodName} (
                        {corr.result.calories} ккал)
                      </Text>
                    </View>
                  </Card>
                ))}
              </View>
            )}

            <View style={styles.modalFooterActions}>
              <TouchableOpacity
                style={[
                  styles.modalDeleteBtn,
                  { backgroundColor: colors.systemRed },
                ]}
                onPress={() => onDelete(item.id)}
              >
                <NativeIcon
                  sf="trash"
                  size={18}
                  color="#FFFFFF"
                  ion="trash-outline"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.modalDeleteBtnText}>Видалити запис</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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
  subSectionTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
  },
  correctionHistoryRowOverrides: {
    padding: 12,
    marginBottom: 8,
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
