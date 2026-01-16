export interface Message {
  messageId?: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  sentAt: string;
}
