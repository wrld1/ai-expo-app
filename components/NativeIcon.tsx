import React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";

import { ColorValue } from "react-native";

interface NativeIconProps {
  sf: string;
  ion: string;
  size?: number;
  color?: ColorValue;
  style?: any;
}

export default function NativeIcon({ ion, size = 24, color, style }: NativeIconProps) {
  return (
    <Ionicons
      name={ion as any}
      size={size}
      color={color}
      style={style}
    />
  );
}
