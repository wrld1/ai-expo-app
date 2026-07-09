import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";
import { colors } from "../../constants/theme";

export type ButtonVariant = "default" | "outline" | "ghost" | "destructive";

interface ButtonProps extends TouchableOpacityProps {
  title?: string;
  variant?: ButtonVariant;
  icon?: React.ReactNode;
  loading?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export default function Button({
  title,
  variant = "default",
  icon,
  loading = false,
  style,
  textStyle,
  disabled,
  ...rest
}: ButtonProps) {
  const getVariantStyles = (): ViewStyle => {
    switch (variant) {
      case "outline":
        return {
          backgroundColor: "transparent",
          borderWidth: 1,
          borderColor: colors.accent,
        };
      case "ghost":
        return {
          backgroundColor: "transparent",
        };
      case "destructive":
        return {
          backgroundColor: colors.systemRed,
        };
      case "default":
      default:
        return {
          backgroundColor: colors.accent,
        };
    }
  };

  const getVariantTextStyles = (): TextStyle => {
    switch (variant) {
      case "outline":
      case "ghost":
        return {
          color: colors.accent,
        };
      case "destructive":
        return {
          color: "#FFFFFF",
        };
      case "default":
      default:
        return {
          color: "#121417",
        };
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.baseButton,
        getVariantStyles(),
        disabled && styles.disabled,
        style,
      ]}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...rest}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={variant === "default" ? "#121417" : colors.accent}
        />
      ) : (
        <>
          {icon}
          {title && (
            <Text
              style={[
                styles.baseText,
                getVariantTextStyles(),
                icon ? { marginLeft: 6 } : undefined,
                textStyle,
              ]}
            >
              {title}
            </Text>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  baseButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 9999,
  },
  baseText: {
    fontSize: 15,
    fontWeight: "700",
  },
  disabled: {
    opacity: 0.5,
  },
});
