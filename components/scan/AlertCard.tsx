import Ionicons from "@react-native-vector-icons/ionicons";
import React, { ComponentProps } from "react";
import { StyleSheet, Text, View } from "react-native";
import { colors } from "../../constants/theme";
import NativeIcon from "../ui/NativeIcon";

export type AlertVariant = "danger" | "warning" | "info";

interface AlertCardProps {
  variant: AlertVariant;
  title?: string;
  children: React.ReactNode;
}

export default function AlertCard({
  variant,
  title,
  children,
}: AlertCardProps) {
  let themeColor = colors.systemYellow;
  let bgColor = "rgba(255, 204, 0, 0.1)";
  let sfIcon = "exclamationmark.triangle.fill";
  let ionIcon: ComponentProps<typeof Ionicons>["name"] = "warning";

  if (variant === "danger") {
    themeColor = colors.systemRed;
    bgColor = "rgba(255, 59, 48, 0.1)";
    sfIcon = "exclamationmark.octagon.fill";
    ionIcon = "alert-circle";
  } else if (variant === "warning") {
    themeColor = colors.systemOrange;
    bgColor = "rgba(255, 149, 0, 0.1)";
    sfIcon = "waveform.path.ecg";
    ionIcon = "medical";
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor, borderColor: themeColor },
      ]}
    >
      {title && (
        <View style={styles.header}>
          <View style={styles.iconWrapper}>
            <NativeIcon
              sf={sfIcon}
              ion={ionIcon}
              size={16}
              color={themeColor}
            />
          </View>
          <Text style={[styles.title, { color: themeColor }]}>{title}</Text>
        </View>
      )}

      <View
        style={title ? styles.contentWithTitle : styles.contentWithoutTitle}
      >
        {!title && (
          <View style={[styles.iconWrapper, { marginRight: 6 }]}>
            <NativeIcon
              sf={sfIcon}
              ion={ionIcon}
              size={16}
              color={themeColor}
            />
          </View>
        )}
        <View style={styles.childrenWrapper}>
          {typeof children === "string" ? (
            <Text style={styles.text}>{children}</Text>
          ) : (
            children
          )}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 12,
    marginBottom: 12,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    marginRight: 6,
    height: 20,
  },
  title: {
    fontSize: 15,
    fontWeight: "700",
    flex: 1,
    lineHeight: 20,
  },
  contentWithTitle: {
    paddingLeft: 22,
  },
  contentWithoutTitle: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  childrenWrapper: {
    flex: 1,
  },
  text: {
    color: colors.label,
    fontSize: 13,
    lineHeight: 18,
  },
});
