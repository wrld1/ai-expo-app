import { useRouter } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import Animated, { FadeInUp, FadeOutDown } from "react-native-reanimated";
import { colors } from "../../constants/theme";
import { triggerHapticLight } from "../../utils/haptics";
import NativeIcon from "../ui/NativeIcon";

export default function OnboardingBanner() {
  const router = useRouter();

  return (
    <Animated.View entering={FadeInUp} exiting={FadeOutDown}>
      <TouchableOpacity
        style={[
          styles.onboardingBanner,
          { backgroundColor: "rgba(44, 226, 162, 0.08)" },
        ]}
        onPress={() => {
          triggerHapticLight();
          router.push("/profile");
        }}
        activeOpacity={0.8}
      >
        <NativeIcon
          sf="info.circle"
          ion="information-circle"
          size={24}
          color={colors.accent}
        />
        <View style={styles.onboardingBannerTextContainer}>
          <Text
            style={[styles.onboardingBannerTitle, { color: colors.accent }]}
          >
            Заповніть ваш профіль
          </Text>
          <Text
            style={[
              styles.onboardingBannerSub,
              { color: colors.secondaryLabel },
            ]}
          >
            Вкажіть вік, стать, алергії та цілі, щоб AI аналізував їжу
            спеціально під ваші потреби.
          </Text>
        </View>
        <NativeIcon
          sf="chevron.right"
          ion="chevron-forward"
          size={16}
          color={colors.secondaryLabel}
        />
      </TouchableOpacity>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  onboardingBanner: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(44, 226, 162, 0.2)",
    borderRadius: 14,
    borderCurve: "continuous",
    padding: 12,
    marginBottom: 16,
  },
  onboardingBannerTextContainer: {
    flex: 1,
    marginHorizontal: 12,
  },
  onboardingBannerTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  onboardingBannerSub: {
    fontSize: 11,
    lineHeight: 15,
  },
});
