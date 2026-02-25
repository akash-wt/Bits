import { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  FlatList,
  StyleSheet,
  StatusBar,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useChatStore } from "@/stores/chats";
import { ChatMessage } from "@/types/chat";

export default function ChatScreen() {
  const router = useRouter();
  const { chats } = useChatStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "unread">("all");

  // Converts rooms object → array
  const rooms = Object.entries(chats).map(([roomId, room]) => {
    const lastMessage = room.messages[room.messages.length - 1];

    return {
      roomId,
      lastMessage,
      unreadCount: room.unreadCount,
    };
  });

  const totalUnread = rooms.reduce((sum, room) => sum + room.unreadCount, 0);

  const filtered = rooms.filter((room) => {
    const matchSearch =
      room.roomId.toLowerCase().includes(search.toLowerCase()) ||
      room.lastMessage?.text.toLowerCase().includes(search.toLowerCase());

    if (filter === "unread") {
      return matchSearch && room.unreadCount > 0;
    }

    return matchSearch;
  });

  function ChatRow({
    room,
    onPress,
  }: {
    room: {
      roomId: string;
      lastMessage?: ChatMessage;
      unreadCount: number;
    };
    onPress: () => void;
  }) {
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <View style={styles.chatInfo}>
          <View style={styles.chatTop}>
            <Text style={styles.chatName} numberOfLines={1}>
              {room.roomId}
            </Text>

            {room.lastMessage && (
              <Text style={styles.chatTime}>
                {new Date(room.lastMessage.createdAt).toLocaleTimeString()}
              </Text>
            )}
          </View>

          <View style={styles.chatBottom}>
            <Text style={styles.lastMsg} numberOfLines={1}>
              {room.lastMessage?.text || "No messages yet"}
            </Text>

            {room.unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>
                  {room.unreadCount > 9 ? "9+" : room.unreadCount}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor="#0a0f1e" />

      {/* Search */}
      <View style={styles.searchWrap}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Search messages..."
          placeholderTextColor="#475569"
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch("")}>
            <Text style={styles.clearBtn}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity onPress={() => router.push(`chat/${123}`)}>
        <Text style={{ color: "red" }}>New Chat</Text>
      </TouchableOpacity>

      {/* Filter */}
      <View style={styles.filterRow}>
        <TouchableOpacity
          style={filter === "all" ? styles.tabActive : styles.tab}
          onPress={() => setFilter("all")}
        >
          <Text
            style={filter === "all" ? styles.tabTextActive : styles.tabText}
          >
            All
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={filter === "unread" ? styles.tabActive : styles.tab}
          onPress={() => setFilter("unread")}
        >
          <Text
            style={filter === "unread" ? styles.tabTextActive : styles.tabText}
          >
            Unread {totalUnread > 0 ? `(${totalUnread})` : ""}
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.roomId}
        renderItem={({ item }) => (
          <ChatRow
            room={item}
            onPress={() => router.push(`chat/${item.roomId}`)}
          />
        )}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🕳️</Text>
            <Text style={styles.emptyText}>No chats found</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
        contentContainerStyle={filtered.length === 0 ? { flex: 1 } : undefined}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#0a0f1e" },

  searchWrap: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 20,
    marginBottom: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    paddingHorizontal: 14,
    paddingVertical: 10,
    gap: 10,
  },

  searchIcon: { fontSize: 14, opacity: 0.5 },
  searchInput: {
    flex: 1,
    color: "#e2e8f0",
    fontSize: 15,
  },

  clearBtn: {
    color: "#64748b",
    fontSize: 13,
  },

  filterRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    marginBottom: 8,
    gap: 8,
  },

  tab: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.1)",
  },

  tabActive: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#6366f1",
    backgroundColor: "rgba(99,102,241,0.15)",
  },

  tabText: { color: "#64748b", fontSize: 13 },
  tabTextActive: {
    color: "#a5b4fc",
    fontSize: 13,
    fontWeight: "600",
  },

  chatItem: {
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.04)",
  },

  chatInfo: { flex: 1 },

  chatTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 4,
  },

  chatName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#f1f5f9",
  },

  chatTime: {
    fontSize: 12,
    color: "#475569",
  },

  chatBottom: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  lastMsg: {
    fontSize: 14,
    color: "#64748b",
    flex: 1,
    marginRight: 8,
  },

  badge: {
    backgroundColor: "#6366f1",
    borderRadius: 10,
    paddingHorizontal: 7,
    paddingVertical: 2,
  },

  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },

  empty: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  emptyIcon: { fontSize: 40, marginBottom: 12 },
  emptyText: { color: "#94a3b8", fontSize: 15 },
});
