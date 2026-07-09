import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { colors } from "../../constants/theme";
import Card from "../ui/Card";
import NativeIcon from "../ui/NativeIcon";

interface CorrectionCardProps {
  correctionText: string;
  setCorrectionText: (text: string) => void;
  isCorrecting: boolean;
  onCorrectionSubmit: () => void;
}

export default function CorrectionCard({
  correctionText,
  setCorrectionText,
  isCorrecting,
  onCorrectionSubmit,
}: CorrectionCardProps) {
  return (
    <Card
      style={[
        styles.correctionCardOverrides,
        {
          borderColor: "rgba(44, 226, 162, 0.15)",
        },
      ]}
    >
      <Text style={[styles.correctionTitle, { color: colors.label }]}>
        Бачите неточність? Виправте AI:
      </Text>
      <Text
        style={[styles.correctionSubtitle, { color: colors.secondaryLabel }]}
      >
        {
          'Наприклад: "Тут немає рису, замість нього гречка" або "Шматок м\'яса більший, десь 200г"'
        }
      </Text>

      <View
        style={[
          styles.correctionInputContainer,
          { borderColor: colors.separator },
        ]}
      >
        <TextInput
          style={[styles.correctionInput, { color: colors.label }]}
          value={correctionText}
          onChangeText={setCorrectionText}
          placeholder="Напишіть уточнення тут..."
          placeholderTextColor={colors.placeholder}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendCorrectionBtn,
            { backgroundColor: colors.accent },
            (!correctionText.trim() || isCorrecting) &&
              styles.sendCorrectionBtnDisabled,
          ]}
          onPress={onCorrectionSubmit}
          disabled={!correctionText.trim() || isCorrecting}
          activeOpacity={0.8}
        >
          {isCorrecting ? (
            <ActivityIndicator size="small" color="#121417" />
          ) : (
            <NativeIcon
              sf="paperplane.fill"
              ion="send"
              size={18}
              color="#121417"
            />
          )}
        </TouchableOpacity>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  correctionCardOverrides: {
    padding: 16,
  },
  correctionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  correctionSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  correctionInputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 6,
  },
  correctionInput: {
    flex: 1,
    fontSize: 14,
    padding: 10,
    maxHeight: 80,
    textAlignVertical: "top",
  },
  sendCorrectionBtn: {
    borderRadius: 8,
    borderCurve: "continuous",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  sendCorrectionBtnDisabled: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
});
