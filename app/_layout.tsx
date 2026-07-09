import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { HistoryProvider } from "../context/HistoryContext";
import { ProfileProvider } from "../context/ProfileContext";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <HistoryProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <StatusBar />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="history-modal" options={{ presentation: 'modal' }} />
          </Stack>
        </GestureHandlerRootView>
      </HistoryProvider>
    </ProfileProvider>
  );
}
