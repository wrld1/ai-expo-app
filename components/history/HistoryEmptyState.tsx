import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors, nativeStyles } from "../../constants/theme";
import Button from "../ui/Button";
import NativeIcon from "../ui/NativeIcon";

interface HistoryEmptyStateProps {
  onScanPress: () => void;
}

export default function HistoryEmptyState({
  onScanPress,
}: HistoryEmptyStateProps) {
  return (
    <View style={styles.emptyContainer}>
      <View style={[nativeStyles.emptyStateIconContainer]}>
        <NativeIcon
          sf="book.closed"
          ion="journal-outline"
          size={42}
          color={colors.accent}
        />
      </View>
      <Text style={[nativeStyles.emptyStateTitle, { color: colors.label }]}>
        Журнал порожній
      </Text>
      <Text
        style={[
          nativeStyles.emptyStateSubtitle,
          { color: colors.secondaryLabel },
        ]}
      >
        {"Тут з'являтимуться страви, які ви сфотографуєте та проаналізуєте."}
      </Text>

      <Button
        title="Скан їжі"
        variant="default"
        onPress={onScanPress}
        style={{ paddingHorizontal: 28 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 32,
  },
});
