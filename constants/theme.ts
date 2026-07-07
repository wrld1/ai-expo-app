import { Platform, PlatformColor, ColorValue, StyleSheet } from "react-native";

export interface ThemeColors {
  label: ColorValue;
  secondaryLabel: ColorValue;
  systemBackground: ColorValue;
  secondarySystemGroupedBackground: ColorValue;
  separator: ColorValue;
  accent: ColorValue;
  systemRed: ColorValue;
  systemOrange: ColorValue;
  placeholder: string;
}

export const colors: ThemeColors = {
  label: Platform.select<ColorValue>({
    ios: PlatformColor("label"),
    android: PlatformColor("?attr/colorOnSurface"),
    default: "#FFFFFF",
  })!,
  secondaryLabel: Platform.select<ColorValue>({
    ios: PlatformColor("secondaryLabel"),
    android: PlatformColor("?attr/colorOnSurfaceVariant"),
    default: "#8E8E93",
  })!,
  systemBackground: Platform.select<ColorValue>({
    ios: PlatformColor("systemBackground"),
    android: PlatformColor("?attr/colorBackground"),
    default: "#121417",
  })!,
  secondarySystemGroupedBackground: Platform.select<ColorValue>({
    ios: PlatformColor("secondarySystemGroupedBackground"),
    android: PlatformColor("?attr/colorSurfaceContainer"),
    default: "#1C1C1E",
  })!,
  separator: Platform.select<ColorValue>({
    ios: PlatformColor("separator"),
    android: PlatformColor("?attr/colorOutlineVariant"),
    default: "rgba(255,255,255,0.08)",
  })!,
  accent: Platform.select<ColorValue>({
    ios: PlatformColor("systemGreen"),
    android: PlatformColor("?attr/colorPrimary"),
    default: "#2CE2A2",
  })!,
  systemRed: Platform.select<ColorValue>({
    ios: PlatformColor("systemRed"),
    android: PlatformColor("?attr/colorError"),
    default: "#FF453A",
  })!,
  systemOrange: Platform.select<ColorValue>({
    ios: PlatformColor("systemOrange"),
    android: PlatformColor("?attr/colorTertiary"),
    default: "#FF9500",
  })!,
  placeholder: "#6B7280",
};

export const nativeStyles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        borderCurve: "continuous",
      },
      android: {
        elevation: 2,
      },
    }),
  },
});
