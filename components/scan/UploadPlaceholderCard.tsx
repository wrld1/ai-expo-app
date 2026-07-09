import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors, nativeStyles } from "../../constants/theme";
import Button from "../ui/Button";
import NativeIcon from "../ui/NativeIcon";

interface UploadPlaceholderCardProps {
  onTakePhoto: () => void;
  onPickImage: () => void;
}

export default function UploadPlaceholderCard({
  onTakePhoto,
  onPickImage,
}: UploadPlaceholderCardProps) {
  return (
    <Animated.View entering={FadeInUp}>
      <View
        style={[
          styles.uploadPlaceholderCard,
          { backgroundColor: colors.secondarySystemGroupedBackground },
        ]}
      >
        <View style={[nativeStyles.emptyStateIconContainer]}>
          <NativeIcon
            sf="fork.knife"
            ion="restaurant"
            size={42}
            color={colors.accent}
          />
        </View>
        <Text style={[nativeStyles.emptyStateTitle, { color: colors.label }]}>
          Завантажте фото вашої страви
        </Text>
        <Text
          style={[
            nativeStyles.emptyStateSubtitle,
            { color: colors.secondaryLabel },
          ]}
        >
          Зробіть фото вашої тарілки або завантажте зображення з галереї для
          миттєвого підрахунку КБЖВ
        </Text>

        <View style={styles.actionButtonsRow}>
          <Button
            title="Камера"
            variant="default"
            icon={
              <NativeIcon
                sf="camera.fill"
                ion="camera"
                size={20}
                color="#121417"
              />
            }
            onPress={onTakePhoto}
            style={{ flex: 1, marginHorizontal: 4 }}
          />

          <Button
            title="Галерея"
            variant="outline"
            icon={
              <NativeIcon
                sf="photo.fill"
                ion="image"
                size={20}
                color={colors.accent}
              />
            }
            onPress={onPickImage}
            style={{ flex: 1, marginHorizontal: 4 }}
          />
        </View>
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  uploadPlaceholderCard: {
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 24,
    alignItems: "center",
    marginTop: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
