import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert, Platform } from "react-native";
import {
  AnalysisSessionExpiredError,
  analyzeFoodImageBackend,
  correctAnalysisBackend,
} from "../api/analyze";
import { useHistory } from "../context/HistoryContext";
import { useProfile } from "../context/ProfileContext";
import { ScanResult } from "../types/history";
import {
  triggerHapticError,
  triggerHapticLight,
  triggerHapticMedium,
  triggerHapticSuccess,
} from "../utils/haptics";

export function useFoodScanner() {
  const { profile } = useProfile();
  const { addHistoryItem, updateHistoryItemResult } = useHistory();

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScanResult | null>(null);
  const [historyId, setHistoryId] = useState<string | null>(null);
  const [isCorrecting, setIsCorrecting] = useState(false);

  const requestPermissions = async () => {
    if (Platform.OS !== "web") {
      const cameraPerm = await ImagePicker.requestCameraPermissionsAsync();
      const libraryPerm =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      return cameraPerm.granted && libraryPerm.granted;
    }
    return true;
  };

  const handleImagePick = async (source: "camera" | "gallery") => {
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

      const options: ImagePicker.ImagePickerOptions = {
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1.0,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (!result.canceled && result.assets && result.assets.length > 0) {
        triggerHapticSuccess();
        setImageUri(result.assets[0].uri);
        setScanResult(null);
        setHistoryId(null);
      }
    } catch (error) {
      console.error(`${source} failed`, error);
      triggerHapticError();
      Alert.alert(
        "Помилка",
        `Не вдалося відкрити ${source === "camera" ? "камеру" : "галерею"}.`,
      );
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

  const handleCorrection = async (correctionText: string) => {
    if (!imageUri || !scanResult || !historyId || !correctionText.trim())
      return;

    const text = correctionText.trim();

    triggerHapticMedium();
    setIsCorrecting(true);
    try {
      let updatedResult: ScanResult;

      if (scanResult.analysisId) {
        try {
          updatedResult = await correctAnalysisBackend(
            scanResult.analysisId,
            text,
          );
        } catch (error) {
          if (!(error instanceof AnalysisSessionExpiredError)) throw error;
          updatedResult = await analyzeFoodImageBackend(
            imageUri,
            profile,
            text,
          );
        }
      } else {
        updatedResult = await analyzeFoodImageBackend(imageUri, profile, text);
      }

      setScanResult(updatedResult);
      await updateHistoryItemResult(historyId, updatedResult, text);
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
  };

  return {
    imageUri,
    isAnalyzing,
    scanResult,
    isCorrecting,
    canCorrect: historyId !== null,
    handleImagePick,
    handleAnalyze,
    handleCorrection,
    handleReset,
  };
}
