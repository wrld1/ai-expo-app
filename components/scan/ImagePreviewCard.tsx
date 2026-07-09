import { Image } from "expo-image";
import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";
import Animated, { FadeInUp } from "react-native-reanimated";
import NativeIcon from "../ui/NativeIcon";

interface ImagePreviewCardProps {
  imageUri: string;
  onReset: () => void;
}

export default function ImagePreviewCard({
  imageUri,
  onReset,
}: ImagePreviewCardProps) {
  return (
    <Animated.View entering={FadeInUp} style={styles.imagePreviewContainer}>
      <Image source={{ uri: imageUri }} style={styles.previewImage} />
      <TouchableOpacity
        style={styles.resetImageBtn}
        onPress={onReset}
        activeOpacity={0.8}
      >
        <NativeIcon sf="xmark" ion="close" size={18} color="#FFFFFF" />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  imagePreviewContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  resetImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(18, 20, 23, 0.7)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
  },
});
