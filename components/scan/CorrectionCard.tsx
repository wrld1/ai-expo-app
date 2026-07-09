import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
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
  isCorrecting: boolean;
  onCorrectionSubmit: (text: string) => void;
}

export default function CorrectionCard({
  isCorrecting,
  onCorrectionSubmit,
}: CorrectionCardProps) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (!text.trim() || isCorrecting) return;
    onCorrectionSubmit(text.trim());
    setText("");
  };
  return (
    <Card
      style={[
        styles.correctionCardOverrides,
        {
          borderColor: colors.separator,
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
          value={text}
          onChangeText={setText}
          placeholder="Напишіть уточнення тут..."
          placeholderTextColor={colors.placeholder}
          multiline
        />
        <TouchableOpacity
          style={[
            styles.sendCorrectionBtn,
            { backgroundColor: colors.accent },
            (!text.trim() || isCorrecting) && styles.sendCorrectionBtnDisabled,
          ]}
          onPress={handleSubmit}
          disabled={!text.trim() || isCorrecting}
          activeOpacity={0.8}
        >
          {isCorrecting ? (
            <ActivityIndicator size="small" color={colors.secondaryLabel} />
          ) : (
            <NativeIcon
              sf="paperplane.fill"
              ion="send"
              size={18}
              color={
                !text.trim() || isCorrecting ? colors.placeholder : "#121417"
              }
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
    backgroundColor: colors.secondarySystemGroupedBackground,
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "center",
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  correctionInput: {
    flex: 1,
    fontSize: 14,
    paddingHorizontal: 10,
    paddingTop: Platform.OS === "ios" ? 10 : 8,
    paddingBottom: Platform.OS === "ios" ? 10 : 8,
    minHeight: 36,
    maxHeight: 80,
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
    backgroundColor: "transparent",
  },
});
