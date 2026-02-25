import { View, Text, TouchableOpacity, ActivityIndicator } from "react-native";
import { useState } from "react";
import { useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { checkUserExist } from "@/lib/walletAuth"; // your auth logic
import { mmkvStorage } from "@/lib/storage";

export default function LoginScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError(null);

      const result = await checkUserExist();

      console.log(result);
      

      if (!result?.token || !result?.publicKey) {
        throw new Error("Authentication failed");
      }

      // Store auth securely
      mmkvStorage.setItem(
        "auth_user",
        JSON.stringify({
          publicKey: result.publicKey,
          token: result.token,
        }),
      );

      // Redirect to app
      router.replace("/(tabs)");
    } catch (e: any) {
      console.log("Login error:", e);
      setError(e.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#0f172a",
        padding: 24,
      }}
    >
      <Text
        style={{
          fontSize: 28,
          fontWeight: "700",
          color: "white",
          marginBottom: 40,
        }}
      >
        Connect Wallet
      </Text>

      <TouchableOpacity
        onPress={handleLogin}
        disabled={loading}
        style={{
          backgroundColor: "#6366f1",
          paddingVertical: 14,
          paddingHorizontal: 32,
          borderRadius: 12,
          width: "100%",
          alignItems: "center",
        }}
      >
        {loading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={{ color: "white", fontWeight: "600" }}>
            Connect Solana Wallet
          </Text>
        )}
      </TouchableOpacity>

      {error && (
        <Text
          style={{
            color: "#ef4444",
            marginTop: 20,
            textAlign: "center",
          }}
        >
          {error}
        </Text>
      )}
    </SafeAreaView>
  );
}
