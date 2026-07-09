import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import { colors } from "../../constants/theme";
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
          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.cameraBtn,
              { backgroundColor: colors.accent },
            ]}
            onPress={onTakePhoto}
            activeOpacity={0.8}
          >
            <NativeIcon
              sf="camera.fill"
              ion="camera"
              size={20}
              color="#121417"
            />
            <Text style={styles.actionBtnTextDark}>Камера</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.actionBtn,
              styles.galleryBtn,
              { borderColor: "rgba(44, 226, 162, 0.3)" },
            ]}
            onPress={onPickImage}
            activeOpacity={0.8}
          >
            <NativeIcon
              sf="photo.fill"
              ion="image"
              size={20}
              color={colors.accent}
            />
            <Text
              style={[styles.actionBtnTextLight, { color: colors.accent }]}
            >
              Галерея
            </Text>
          </TouchableOpacity>
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
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderCurve: "continuous",
    marginHorizontal: 4,
  },
  cameraBtn: {},
  galleryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  actionBtnTextDark: {
    color: "#121417",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  actionBtnTextLight: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
});
