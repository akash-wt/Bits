import { create } from "zustand";
import { ChatMessage } from "@/types/chat";
import { persist, createJSONStorage } from "zustand/middleware";
import { mmkvStorage } from "../lib/storage";

interface ChatRoomState {
  messages: ChatMessage[];
  unreadCount: number;
}

interface ChatStore {

  chats: Record<string, ChatRoomState>;

  addMessage: (roomId: string, message: ChatMessage) => void;
  //   markMessageAsRead: (roomId: string, messageId: string) => void;
  //   markRoomAsRead: (roomId: string) => void;
  clearRoom: (roomId: string) => void;
}

export const useChatStore = create<ChatStore>()(
  persist((set, get) => ({
    chats: {},

    addMessage: (roomId, message) =>
      set((state) => {
        console.log("hi there ");

        const room = state.chats[roomId] ?? {
          messages: [],
          unreadCount: 0,
        };

        const isIncoming =
          message.status !== "read" &&
          message.senderKey !== "user1"; // current user

        return {
          chats: {
            ...state.chats,
            [roomId]: {
              messages: [...room.messages, message],
              unreadCount: isIncoming
                ? room.unreadCount + 1
                : room.unreadCount,
            },
          },
        };
      }),

    //   markMessageAsRead: (roomId, messageId) =>
    //     set((state) => {
    //       const room = state.chats[roomId];
    //       if (!room) return state;

    //       let unreadReduced = 0;

    //       const updated = room.messages.map((msg) => {
    //         if (msg.id === messageId && msg.status !== "read") {
    //           unreadReduced++;
    //           return { ...msg, status: "read" };
    //         }
    //         return msg;
    //       });

    //       return {
    //         chats: {
    //           ...state.chats,
    //           [roomId]: {
    //             messages: updated,
    //             unreadCount: Math.max(
    //               room.unreadCount - unreadReduced,
    //               0
    //             ),
    //           },
    //         },
    //       };
    //     }),

    //   markRoomAsRead: (roomId) =>
    //     set((state) => {
    //       const room = state.chats[roomId];
    //       if (!room) return state;

    //       const updatedMessages = room.messages.map((msg) =>
    //         msg.status !== "read"
    //           ? { ...msg, status: "read" }
    //           : msg
    //       );

    //       return {
    //         chats: {
    //           ...state.chats,
    //           [roomId]: {
    //             messages: updatedMessages,
    //             unreadCount: 0,
    //           },
    //         },
    //       };
    //     }),

    clearRoom: (roomId) =>
      set((state) => {
        const updated = { ...state.chats };
        delete updated[roomId];
        return { chats: updated };
      }),

  }),{
    name:"chat-storage",
    storage:createJSONStorage(()=>mmkvStorage)
  })

);