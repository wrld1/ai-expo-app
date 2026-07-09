import React from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { colors } from "../../constants/theme";
import { useProfile } from "../../context/ProfileContext";
import { useFoodScanner } from "../../hooks/useFoodScanner";
import OnboardingBanner from "../shared/OnboardingBanner";
import NativeIcon from "../ui/NativeIcon";
import CorrectionCard from "./CorrectionCard";
import ImagePreviewCard from "./ImagePreviewCard";
import ScanResultCard from "./ScanResultCard";
import UploadPlaceholderCard from "./UploadPlaceholderCard";

export default function ScanView() {
  const { profile } = useProfile();
  const isProfileIncomplete = !profile.age || !profile.gender;

  const {
    imageUri,
    isAnalyzing,
    scanResult,
    correctionText,
    isCorrecting,
    setCorrectionText,
    handleImagePick,
    handleAnalyze,
    handleCorrection,
    handleReset,
  } = useFoodScanner();


  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.systemGroupedBackground }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        {isProfileIncomplete && <OnboardingBanner />}

        {!imageUri ? (
          <UploadPlaceholderCard
            onTakePhoto={() => handleImagePick("camera")}
            onPickImage={() => handleImagePick("gallery")}
          />
        ) : (
          <View>
            <ImagePreviewCard imageUri={imageUri} onReset={handleReset} />

            {!scanResult && !isAnalyzing && (
              <TouchableOpacity
                style={[
                  styles.analyzeButton,
                  { backgroundColor: colors.accent },
                ]}
                onPress={handleAnalyze}
                activeOpacity={0.85}
              >
                <NativeIcon
                  sf="bolt.fill"
                  ion="flash"
                  size={18}
                  color="#121417"
                  style={{ marginRight: 6 }}
                />
                <Text style={styles.analyzeButtonText}>
                  Аналізувати тарілку
                </Text>
              </TouchableOpacity>
            )}

            {isAnalyzing && (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={colors.accent} />
                <Text style={[styles.loadingText, { color: colors.label }]}>
                  AI сканує вашу страву...
                </Text>
                <Text
                  style={[styles.loadingSub, { color: colors.secondaryLabel }]}
                >
                  Рахуємо калорії та оцінюємо КБЖВ
                </Text>
              </View>
            )}

            {scanResult && (
              <LayoutAnimationConfig skipEntering>
                <Animated.View
                  entering={FadeInUp}
                  style={styles.resultsContainer}
                >
                  <ScanResultCard result={scanResult} />

                  <View style={styles.warningCard}>
                    <NativeIcon
                      sf="exclamationmark.circle"
                      ion="alert-circle-outline"
                      size={18}
                      color={colors.secondaryLabel}
                    />
                    <Text
                      style={[
                        styles.warningText,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      Увага: Дані КБЖВ є орієнтовними. Цей аналіз не є заміною
                      медичної консультації чи професійних діагнозів.
                    </Text>
                  </View>

                  <CorrectionCard
                    correctionText={correctionText}
                    setCorrectionText={setCorrectionText}
                    isCorrecting={isCorrecting}
                    onCorrectionSubmit={handleCorrection}
                  />
                </Animated.View>
              </LayoutAnimationConfig>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  analyzeButton: {
    borderRadius: 12,
    borderCurve: "continuous",
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 4px 12px rgba(44, 226, 162, 0.15)",
    marginBottom: 16,
  },
  analyzeButtonText: {
    color: "#121417",
    fontSize: 15,
    fontWeight: "700",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 24,
  },
  loadingText: {
    fontSize: 15,
    fontWeight: "600",
    marginTop: 14,
  },
  loadingSub: {
    fontSize: 12,
    marginTop: 4,
  },
  resultsContainer: {},
  warningCard: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.02)",
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 10,
    marginBottom: 12,
    alignItems: "flex-start",
  },
  warningText: {
    fontSize: 11,
    lineHeight: 15,
    marginLeft: 8,
    flex: 1,
  },
});
