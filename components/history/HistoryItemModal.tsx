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
import Button from "../ui/Button";
import NativeIcon from "../ui/NativeIcon";
import CorrectionHistoryList from "./CorrectionHistoryList";

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
                onPress={() => onDelete(item.id)}
              />
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
    marginBottom: 12,
    textAlign: "center",
  },
  modalFooterActions: {
    alignItems: "center",
    marginTop: 8,
  },
});
