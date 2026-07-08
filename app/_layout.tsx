import { Stack } from "expo-router";
import { ProfileProvider } from "../context/ProfileContext";
import { HistoryProvider } from "../context/HistoryContext";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <HistoryProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar style="light" />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          </Stack>
        </GestureHandlerRootView>
      </HistoryProvider>
    </ProfileProvider>
  );
}
