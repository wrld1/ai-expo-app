import Ionicons from "@react-native-vector-icons/ionicons";
import React, { ComponentProps } from "react";
import { ColorValue, StyleProp, TextStyle } from "react-native";

interface NativeIconProps {
  sf: string;
  ion: ComponentProps<typeof Ionicons>["name"];
  size?: number;
  color?: ColorValue;
  style?: StyleProp<TextStyle>;
}

export default function NativeIcon({
  ion,
  size = 24,
  color,
  style,
}: NativeIconProps) {
  return <Ionicons name={ion} size={size} color={color} style={style} />;
}
