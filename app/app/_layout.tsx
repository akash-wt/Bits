import { Stack, Slot, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useEffect, useState } from "react";
import { mmkvStorage } from "@/lib/storage";
import { Redirect } from "expo-router";
import "../src/polyfills";

export default function RootLayout() {
  const segments = useSegments();
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const authRaw = mmkvStorage.getItem("auth_user");
    setIsLoggedIn(!!authRaw);
  }, []);

  if (isLoggedIn === null) {
    return null; // splash/loading state
  }

  const inAuthGroup = segments[0] === "(auth)";

  if (!isLoggedIn && !inAuthGroup) {
    return <Redirect href="/(auth)/login" />;
  }

  if (isLoggedIn && inAuthGroup) {
    return <Redirect href="/(tabs)" />;
  }

  return (
    <SafeAreaProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="chat/[roomId]" />
        <Stack.Screen name="token/[mint]" />
      </Stack>
    </SafeAreaProvider>
  );
}
