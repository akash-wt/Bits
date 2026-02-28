import { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { useChatStore } from "@/stores/chats";
import { SafeAreaView } from "react-native-safe-area-context";
import getRandomUuid from "@/helper/UUID";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { shortenKey } from "@/lib/trimString";

export default function ChatDetail() {
  const { reciverKey } = useLocalSearchParams();
  const { chats, addMessage } = useChatStore();
  const router = useRouter();
  const chatRoomId = String(reciverKey);

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const room = chatRoomId ? chats[chatRoomId] : undefined;
  const messages = room?.messages ?? [];

  const currentUser = "user2";

  const sendMessage = () => {
    if (!reciverKey) {
      console.log("no chat room found while sending message");
      return;
    }

    addMessage(chatRoomId, {
      id: getRandomUuid(),
      text: input.trim(),
      senderKey: currentUser,
      reciverKey: "user1",
      createdAt: Date.now(),
      status: "sent",
    });

    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#000000" }}>
      {/* Back Button */}
      <TouchableOpacity
        style={{
          backgroundColor: "#000000",
          paddingLeft: 15,
          flexDirection: "row",
          alignItems: "center",
          marginBottom: 10,
          paddingBottom: 10,
          paddingTop: 10,
        }}
        onPress={() => router.back()}
      >
        <Ionicons name="arrow-back" size={24} color="#ffffff" />
        <Text
          style={{
            color: "#fff",
            marginLeft: 8,
            fontFamily: "VT323_400Regular",
            fontSize: 20,
            letterSpacing: 2,
          }}
        >
          {shortenKey(reciverKey.toString())}
        </Text>
      </TouchableOpacity>

      <FlatList
        style={{ backgroundColor: "#ffffff" }}
        ref={flatListRef}
        data={messages}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => {
          const isMe = item.senderId === currentUser;

          return (
            <View
              style={{
                alignSelf: isMe ? "flex-end" : "flex-start",
                backgroundColor: isMe ? "#000000" : "#000000",
                padding: 10,
                marginBottom: 8,
                maxWidth: "75%",
              }}
            >
              <Text
                style={{
                  color: "#ffffff",
                  fontFamily: "VT323_400Regular",
                  fontSize: 18,
                  letterSpacing: 0.5,
                }}
              >
                {item.text}
              </Text>
              <Text
                style={{
                  fontSize: 10,
                  color: "#cbd5e1",
                  marginTop: 4,
                  textAlign: "right",
                }}
              >
                {new Date(item.createdAt).toLocaleTimeString()}
              </Text>
            </View>
          );
        }}
      />

      {/* Input */}
      <View
        style={{
          flexDirection: "row",
          padding: 12,
          borderTopWidth: 1,
          backgroundColor: "#ffffff",
        }}
      >
        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Type a message..."
          placeholderTextColor="#ffffff"
          style={{
            flex: 1,
            fontFamily: "VT323_400Regular",
            fontSize: 18,
            letterSpacing: 2,
            backgroundColor: "#000000",
            color: "#ffffff",
            paddingHorizontal: 16,
            paddingVertical: 10,
            marginRight: 10,
          }}
        />

        <TouchableOpacity
          onPress={sendMessage}
          style={{
            backgroundColor: "#000000",
            paddingHorizontal: 20,
            justifyContent: "center",
          }}
        >
          <Text
            style={{
              color: "#ffffff",
              fontFamily: "VT323_400Regular",
              fontSize: 18,
              letterSpacing: 2,
            }}
          >
            Send
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
