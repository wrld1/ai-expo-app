import React from "react";
import { StyleProp, TouchableOpacity, View, ViewStyle } from "react-native";
import { colors, nativeStyles } from "../../constants/theme";

export interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  onLongPress?: () => void;
  activeOpacity?: number;
}

export default function Card({
  children,
  style,
  onPress,
  onLongPress,
  activeOpacity = 0.8,
}: CardProps) {
  const cardStyle = [
    nativeStyles.card,
    {
      backgroundColor: colors.secondarySystemGroupedBackground,
    },
    style,
  ];

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        style={cardStyle}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={activeOpacity}
      >
        {children}
      </TouchableOpacity>
    );
  }

  return <View style={cardStyle}>{children}</View>;
}
