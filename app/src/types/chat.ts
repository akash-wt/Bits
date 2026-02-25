
export interface ChatMessage {
    id: string;
    text: string;
    senderKey: string;
    reciverKey: string;
    createdAt: number; // store as timestamp
    status: MessageStatus
}
export type MessageStatus = "sent" | "delivered" | "read";
export interface ChatRoom {
    roomId: string;
    message: ChatMessage[]
}