import React from "react";
import { StyleSheet, View } from "react-native";
import { colors } from "../../constants/theme";

export default function Divider() {
  return <View style={[styles.divider, { backgroundColor: colors.separator }]} />;
}

const styles = StyleSheet.create({
  divider: {
    height: StyleSheet.hairlineWidth,
    width: "100%",
  },
});
