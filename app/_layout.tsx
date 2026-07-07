import { Stack } from "expo-router";
import { ProfileProvider } from "../context/ProfileContext";
import { HistoryProvider } from "../context/HistoryContext";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <ProfileProvider>
      <HistoryProvider>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        </Stack>
      </HistoryProvider>
    </ProfileProvider>
  );
}
