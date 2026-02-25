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

export default function ChatDetail() {
  const { roomId } = useLocalSearchParams();
  const { chats, addMessage } = useChatStore();

  const chatRoomId = String(roomId);

  const [input, setInput] = useState("");
  const flatListRef = useRef<FlatList>(null);

  const room = chatRoomId ? chats[chatRoomId] : undefined;
  const messages = room?.messages ?? [];

  const currentUser = "user1";

  const sendMessage = () => {
    if (!roomId) {
      console.log("no chat room found while sending message");
      return;
    }

    addMessage(chatRoomId, {
      id: getRandomUuid(),
      text: input.trim(),
      senderKey: currentUser,
      reciverKey: "user2",
      createdAt: Date.now(),
      status: "sent",
    });

    setInput("");

    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 50);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#0f172a" }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <FlatList
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
                  backgroundColor: isMe ? "#6366f1" : "#1e293b",
                  padding: 10,
                  borderRadius: 16,
                  marginBottom: 8,
                  maxWidth: "75%",
                }}
              >
                <Text style={{ color: "white" }}>{item.text}</Text>
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
            borderColor: "#1e293b",
            backgroundColor: "#0f172a",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            placeholderTextColor="#64748b"
            style={{
              flex: 1,
              backgroundColor: "#1e293b",
              color: "white",
              borderRadius: 25,
              paddingHorizontal: 16,
              paddingVertical: 10,
              marginRight: 10,
            }}
          />

          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: "#6366f1",
              borderRadius: 25,
              paddingHorizontal: 20,
              justifyContent: "center",
            }}
          >
            <Text style={{ color: "white" }}>Send</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
