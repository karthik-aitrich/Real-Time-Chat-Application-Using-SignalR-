export interface RealtimeChatMessage {
  messageId: string;
  senderId: string;
  receiverId: string;
  senderName: string;
  messageText: string;
  sentAt: string;
}
