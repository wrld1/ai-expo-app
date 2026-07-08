import { ThemeColors } from "@/types/theme";
import { ColorValue, Platform, PlatformColor, StyleSheet } from "react-native";

const safePlatformColor = (colorName: string, fallback: string): ColorValue => {
  if (Platform.OS === "web") {
    return fallback;
  }
  return PlatformColor(colorName);
};

export const colors: ThemeColors = {
  label: Platform.select<ColorValue>({
    ios: safePlatformColor("label", "#FFFFFF"),
    android: safePlatformColor("?attr/colorOnSurface", "#FFFFFF"),
    default: "#FFFFFF",
  })!,
  secondaryLabel: Platform.select<ColorValue>({
    ios: safePlatformColor("secondaryLabel", "#8E8E93"),
    android: safePlatformColor("?attr/colorOnSurfaceVariant", "#8E8E93"),
    default: "#8E8E93",
  })!,
  systemBackground: Platform.select<ColorValue>({
    ios: safePlatformColor("systemBackground", "#121417"),
    android: safePlatformColor("?attr/colorBackground", "#121417"),
    default: "#121417",
  })!,
  systemGroupedBackground: Platform.select<ColorValue>({
    ios: safePlatformColor("systemGroupedBackground", "#000000"),
    android: safePlatformColor("?attr/colorSurface", "#000000"),
    default: "#000000",
  })!,
  secondarySystemGroupedBackground: Platform.select<ColorValue>({
    ios: safePlatformColor("secondarySystemGroupedBackground", "#1C1C1E"),
    android: safePlatformColor("?attr/colorSurfaceContainer", "#1C1C1E"),
    default: "#1C1C1E",
  })!,
  separator: Platform.select<ColorValue>({
    ios: safePlatformColor("separator", "rgba(255,255,255,0.08)"),
    android: safePlatformColor(
      "?attr/colorOutlineVariant",
      "rgba(255,255,255,0.08)",
    ),
    default: "rgba(255,255,255,0.08)",
  })!,
  accent: Platform.select<ColorValue>({
    ios: safePlatformColor("systemGreen", "#2CE2A2"),
    android: safePlatformColor("?attr/colorPrimary", "#2CE2A2"),
    default: "#2CE2A2",
  })!,
  systemRed: Platform.select<ColorValue>({
    ios: safePlatformColor("systemRed", "#FF453A"),
    android: safePlatformColor("?attr/colorError", "#FF453A"),
    default: "#FF453A",
  })!,
  systemOrange: Platform.select<ColorValue>({
    ios: safePlatformColor("systemOrange", "#FF9500"),
    android: safePlatformColor("?attr/colorTertiary", "#FF9500"),
    default: "#FF9500",
  })!,
  placeholder: "#6B7280",
};

export const nativeStyles = StyleSheet.create({
  card: {
    borderRadius: 16,
    ...Platform.select({
      ios: {
        borderCurve: "continuous",
        borderWidth: 0,
      },
      android: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
        elevation: 2,
      },
      default: {
        borderWidth: 1,
        borderColor: "rgba(255,255,255,0.08)",
      },
    }),
  },
});
