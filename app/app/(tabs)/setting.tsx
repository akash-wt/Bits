import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { mmkvStorage } from "@/lib/storage";

function shortenKey(key: string) {
  return key.slice(0, 4) + "..." + key.slice(-4);
}

export default function AccountScreen() {
  const router = useRouter();

  const authRaw = mmkvStorage.getItem("auth_user");
  const user = authRaw ? JSON.parse(authRaw) : null;

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => {
          mmkvStorage.removeItem("auth_user");
          router.replace("/(auth)/login");
        },
      },
    ]);
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#0a0f1e",
        padding: 24,
      }}
    >
      <StatusBar barStyle="light-content" />

      {/* Title */}
      <Text
        style={{
          fontSize: 28,
          color: "white",
          marginBottom: 30,
        }}
      >
        Account
      </Text>

      {/* Public Key Card */}
      <View
        style={{
          backgroundColor: "#111827",
          padding: 20,
          borderRadius: 12,
          marginBottom: 20,
        }}
      >
        <Text
          style={{
            color: "#94a3b8",
            fontSize: 14,
            marginBottom: 8,
          }}
        >
          Public Key
        </Text>

        <Text
          style={{
            color: "#ffffff",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          {shortenKey(user?.publicKey || "")}
        </Text>

        <Text
          style={{
            color: "#64748b",
            fontSize: 12,
            marginTop: 6,
          }}
        >
          {user?.publicKey}
        </Text>
      </View>

      {/* Logout Button */}
      <TouchableOpacity
        onPress={handleLogout}
        style={{
          backgroundColor: "#ef4444",
          paddingVertical: 14,
          borderRadius: 10,
          alignItems: "center",
        }}
      >
        <Text
          style={{
            color: "white",
            fontWeight: "600",
            fontSize: 16,
          }}
        >
          Logout
        </Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}
