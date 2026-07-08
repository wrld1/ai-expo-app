import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Animated, {
  FadeInUp,
  FadeOutDown,
  LayoutAnimationConfig,
} from "react-native-reanimated";
import { analyzeFoodImageBackend } from "../api/analyze";
import { colors } from "../constants/theme";
import { ScanResult, useHistory } from "../context/HistoryContext";
import { useProfile } from "../context/ProfileContext";
import {
  triggerHapticError,
  triggerHapticLight,
  triggerHapticMedium,
  triggerHapticSuccess,
} from "../utils/haptics";
import NativeIcon from "./NativeIcon";
import ScanResultCard from "./ScanResultCard";

export default function ScanView() {
  const { profile } = useProfile();
  const { addHistoryItem, updateHistoryItemResult } = useHistory();
  const router = useRouter();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [correctionText, setCorrectionText] = useState("");
  const [isCorrecting, setIsCorrecting] = useState(false);

  const isProfileIncomplete = !profile.age || !profile.gender;

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPerm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return cameraPerm.granted && libraryPerm.granted;
    }
    return true;
  };

  const handleTakePhoto = async () => {
    triggerHapticLight();
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        triggerHapticError();
        Alert.alert(
          "Доступ обмежено",
          "Будь ласка, дозвольте доступ до камери та галереї у налаштуваннях пристрою.",
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        triggerHapticSuccess();
        setImageUri(result.assets[0].uri);
        setScanResult(null);
        setHistoryId(null);
        setCorrectionText("");
      }
    } catch (error) {
      console.error("Camera capture failed", error);
      triggerHapticError();
      Alert.alert("Помилка", "Не вдалося відкрити камеру.");
    }
  };

  const handlePickImage = async () => {
    triggerHapticLight();
    try {
      const hasPermission = await requestPermissions();
      if (!hasPermission) {
        triggerHapticError();
        Alert.alert(
          "Доступ обмежено",
          "Будь ласка, дозвольте доступ до камери та галереї у налаштуваннях пристрою.",
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        triggerHapticSuccess();
        setImageUri(result.assets[0].uri);
        setScanResult(null);
        setHistoryId(null);
        setCorrectionText("");
      }
    } catch (error) {
      console.error("Gallery picker failed", error);
      triggerHapticError();
      Alert.alert("Помилка", "Не вдалося відкрити галерею.");
    }
  };

  const handleAnalyze = async () => {
    if (!imageUri) return;

    triggerHapticMedium();
    setIsAnalyzing(true);
    try {
      const result = await analyzeFoodImageBackend(imageUri, profile);
      setScanResult(result);

      const savedItem = await addHistoryItem(imageUri, result);
      setHistoryId(savedItem.id);
      triggerHapticSuccess();
    } catch (error: any) {
      triggerHapticError();
      Alert.alert(
        "Помилка аналізу",
        error.message || "Сталася невідома помилка.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCorrection = async () => {
    if (!imageUri || !scanResult || !historyId || !correctionText.trim())
      return;

    triggerHapticMedium();
    setIsCorrecting(true);
    try {
      const updatedResult = await analyzeFoodImageBackend(
        imageUri,
        profile,
        correctionText.trim(),
      );

      setScanResult(updatedResult);
      await updateHistoryItemResult(
        historyId,
        updatedResult,
        correctionText.trim(),
      );
      setCorrectionText("");
      triggerHapticSuccess();
      Alert.alert("Успіх", "Аналіз страви успішно оновлено!");
    } catch (error: any) {
      triggerHapticError();
      Alert.alert(
        "Помилка оновлення",
        error.message || "Не вдалося оновити аналіз.",
      );
    } finally {
      setIsCorrecting(false);
    }
  };

  const handleReset = () => {
    triggerHapticLight();
    setImageUri(null);
    setScanResult(null);
    setHistoryId(null);
    setCorrectionText("");
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={{ flex: 1, backgroundColor: colors.systemBackground }}
    >
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        contentContainerStyle={styles.scrollContent}
      >
        {isProfileIncomplete && (
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
                  style={[
                    styles.onboardingBannerTitle,
                    { color: colors.accent },
                  ]}
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
        )}

        {!imageUri ? (
          <Animated.View entering={FadeInUp}>
            <View
              style={[
                styles.uploadPlaceholderCard,
                { backgroundColor: colors.secondarySystemGroupedBackground },
              ]}
            >
              <View
                style={[
                  styles.placeholderIconContainer,
                  { backgroundColor: "rgba(44, 226, 162, 0.1)" },
                ]}
              >
                <NativeIcon
                  sf="fork.knife"
                  ion="restaurant"
                  size={42}
                  color={colors.accent}
                />
              </View>
              <Text style={[styles.placeholderTitle, { color: colors.label }]}>
                Що ви сьогодні їсте?
              </Text>
              <Text
                style={[
                  styles.placeholderSub,
                  { color: colors.secondaryLabel },
                ]}
              >
                Зробіть фото вашої тарілки або завантажте зображення з галереї
                для миттєвого підрахунку КБЖВ
              </Text>

              <View style={styles.actionButtonsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    styles.cameraBtn,
                    { backgroundColor: colors.accent },
                  ]}
                  onPress={handleTakePhoto}
                  activeOpacity={0.8}
                >
                  <NativeIcon
                    sf="camera.fill"
                    ion="camera"
                    size={20}
                    color="#121417"
                  />
                  <Text style={styles.actionBtnTextDark}>Камера</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    styles.galleryBtn,
                    { borderColor: "rgba(44, 226, 162, 0.3)" },
                  ]}
                  onPress={handlePickImage}
                  activeOpacity={0.8}
                >
                  <NativeIcon
                    sf="photo.fill"
                    ion="image"
                    size={20}
                    color={colors.accent}
                  />
                  <Text
                    style={[
                      styles.actionBtnTextLight,
                      { color: colors.accent },
                    ]}
                  >
                    Галерея
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>
        ) : (
          <View>
            <Animated.View
              entering={FadeInUp}
              style={styles.imagePreviewContainer}
            >
              <Image source={{ uri: imageUri }} style={styles.previewImage} />
              <TouchableOpacity
                style={styles.resetImageBtn}
                onPress={handleReset}
                activeOpacity={0.8}
              >
                <NativeIcon sf="xmark" ion="close" size={18} color="#FFFFFF" />
              </TouchableOpacity>
            </Animated.View>

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

                  <View
                    style={[
                      styles.correctionCard,
                      {
                        backgroundColor:
                          colors.secondarySystemGroupedBackground,
                        borderColor: "rgba(44, 226, 162, 0.15)",
                      },
                    ]}
                  >
                    <Text
                      style={[styles.correctionTitle, { color: colors.label }]}
                    >
                      Бачите неточність? Виправте AI:
                    </Text>
                    <Text
                      style={[
                        styles.correctionSubtitle,
                        { color: colors.secondaryLabel },
                      ]}
                    >
                      {
                        'Наприклад: "Тут немає рису, замість нього гречка" або "Шматок м\'яса більший, десь 200г"'
                      }
                    </Text>

                    <View
                      style={[
                        styles.correctionInputContainer,
                        { borderColor: colors.separator },
                      ]}
                    >
                      <TextInput
                        style={[
                          styles.correctionInput,
                          { color: colors.label },
                        ]}
                        value={correctionText}
                        onChangeText={setCorrectionText}
                        placeholder="Напишіть уточнення тут..."
                        placeholderTextColor={colors.placeholder}
                        multiline
                      />
                      <TouchableOpacity
                        style={[
                          styles.sendCorrectionBtn,
                          { backgroundColor: colors.accent },
                          (!correctionText.trim() || isCorrecting) &&
                            styles.sendCorrectionBtnDisabled,
                        ]}
                        onPress={handleCorrection}
                        disabled={!correctionText.trim() || isCorrecting}
                        activeOpacity={0.8}
                      >
                        {isCorrecting ? (
                          <ActivityIndicator size="small" color="#121417" />
                        ) : (
                          <NativeIcon
                            sf="paperplane.fill"
                            ion="send"
                            size={18}
                            color="#121417"
                          />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
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
  uploadPlaceholderCard: {
    borderRadius: 16,
    borderCurve: "continuous",
    padding: 24,
    alignItems: "center",
    marginTop: 10,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  placeholderIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  placeholderTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 6,
  },
  placeholderSub: {
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },
  actionButtonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    borderRadius: 10,
    borderCurve: "continuous",
    marginHorizontal: 4,
  },
  cameraBtn: {},
  galleryBtn: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  actionBtnTextDark: {
    color: "#121417",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  actionBtnTextLight: {
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 6,
  },
  imagePreviewContainer: {
    width: "100%",
    height: 240,
    borderRadius: 16,
    borderCurve: "continuous",
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
  },
  previewImage: {
    width: "100%",
    height: "100%",
  },
  resetImageBtn: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(18, 20, 23, 0.7)",
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.15)",
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
  resultHeaderCard: {
    borderRadius: 12,
    borderCurve: "continuous",
    padding: 14,
    marginBottom: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  resultLabel: {
    fontSize: 12,
    marginBottom: 4,
  },
  resultFoodName: {
    fontSize: 18,
    fontWeight: "700",
  },
  resultsCard: {
    borderRadius: 14,
    borderCurve: "continuous",
    padding: 16,
    marginBottom: 12,
    boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
  },
  resultsCardTitle: {
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 12,
  },
  macroProgressContainer: {
    marginBottom: 10,
  },
  macroHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },
  macroLabel: {
    fontSize: 13,
  },
  macroValue: {
    fontSize: 13,
    fontWeight: "700",
  },
  macroTrack: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderRadius: 4,
    overflow: "hidden",
  },
  macroBar: {
    height: "100%",
    borderRadius: 4,
  },
  ingredientRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  ingredientName: {
    fontSize: 14,
  },
  ingredientWeight: {
    fontSize: 14,
    fontWeight: "600",
  },
  subSectionLabel: {
    fontSize: 12,
    fontWeight: "600",
    marginTop: 8,
    marginBottom: 6,
  },
  insightRow: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 10,
    marginBottom: 10,
    alignItems: "flex-start",
    borderLeftWidth: 3,
  },
  goodInsightBorder: {
    borderLeftColor: "#2CE2A2",
  },
  riskInsightBorder: {
    borderLeftColor: "#FF9500",
  },
  insightText: {
    fontSize: 13,
    lineHeight: 18,
    marginLeft: 8,
    flex: 1,
  },
  summaryBox: {
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    borderCurve: "continuous",
    padding: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.04)",
  },
  summaryText: {
    fontSize: 13,
    lineHeight: 18,
    fontStyle: "italic",
  },
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
  correctionCard: {
    borderRadius: 14,
    borderCurve: "continuous",
    padding: 16,
    borderWidth: 1,
  },
  correctionTitle: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 2,
  },
  correctionSubtitle: {
    fontSize: 11,
    lineHeight: 15,
    marginBottom: 10,
  },
  correctionInputContainer: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.03)",
    borderRadius: 10,
    borderCurve: "continuous",
    borderWidth: 1,
    alignItems: "flex-end",
    paddingRight: 6,
    paddingBottom: 6,
  },
  correctionInput: {
    flex: 1,
    fontSize: 14,
    padding: 10,
    maxHeight: 80,
    textAlignVertical: "top",
  },
  sendCorrectionBtn: {
    borderRadius: 8,
    borderCurve: "continuous",
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
    marginLeft: 6,
  },
  sendCorrectionBtnDisabled: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.04)",
  },
});
