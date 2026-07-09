import React from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../../constants/theme";
import NativeIcon from "../ui/NativeIcon";
import Button from "../ui/Button";

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
        <View
          style={[
            styles.placeholderIconContainer,
            { backgroundColor: "rgba(44, 226, 162, 0.1)" },
          ]}
        >
          <NativeIcon
            sf="fork.knife"
            ion="restaurant"
            size={42}
            color={colors.accent}
          />
        </View>
        <Text style={[styles.placeholderTitle, { color: colors.label }]}>
          Завантажте фото вашої страви
        </Text>
        <Text
          style={[styles.placeholderSub, { color: colors.secondaryLabel }]}
        >
          Зробіть фото вашої тарілки або завантажте зображення з галереї для
          миттєвого підрахунку КБЖВ
        </Text>

        <View style={styles.actionButtonsRow}>
          <Button
            title="Камера"
            variant="default"
            icon={<NativeIcon sf="camera.fill" ion="camera" size={20} color="#121417" />}
            onPress={onTakePhoto}
            style={{ flex: 1, marginHorizontal: 4 }}
          />

          <Button
            title="Галерея"
            variant="outline"
            icon={<NativeIcon sf="photo.fill" ion="image" size={20} color={colors.accent} />}
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
  placeholderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
});
