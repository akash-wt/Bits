import { View, Text, TouchableOpacity, Alert, StatusBar } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { mmkvStorage } from "@/lib/storage";
import { Ionicons } from "@expo/vector-icons";

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
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000" }}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          paddingVertical: 12,
        }}
      >
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>

        <Text
          style={{
            color: "#fff",
            marginLeft: 12,
            fontSize: 22,
            fontFamily: "VT323_400Regular",
            letterSpacing: 2,
          }}
        >
          ACCOUNT
        </Text>
      </View>

      {/* Content */}
      <View style={{ padding: 20 }}>
        {/* Public Key Card */}
        <View
          style={{
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#222",
            padding: 20,
            marginBottom: 20,
          }}
        >
          <Text
            style={{
              color: "#888",
              fontSize: 14,
              marginBottom: 8,
            }}
          >
            SOLANA PUBLIC KEY
          </Text>

          <Text
            style={{
              color: "#fff",
              fontSize: 20,
              fontFamily: "VT323_400Regular",
              letterSpacing: 2,
            }}
          >
            {shortenKey(user?.publicKey || "")}
          </Text>

          <Text
            style={{
              color: "#666",
              fontSize: 12,
              marginTop: 8,
            }}
          >
            {user?.publicKey}
          </Text>
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          onPress={handleLogout}
          style={{
            backgroundColor: "#111",
            borderWidth: 1,
            borderColor: "#ff4444",
            paddingVertical: 14,
            alignItems: "center",
          }}
        >
          <Text
            style={{
              color: "#ff4444",
              fontSize: 18,
              fontFamily: "VT323_400Regular",
              letterSpacing: 2,
            }}
          >
            LOGOUT
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
