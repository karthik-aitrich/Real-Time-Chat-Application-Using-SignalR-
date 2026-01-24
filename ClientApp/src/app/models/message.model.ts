export interface Message {
  messageId: string;
  senderId: string;
  receiverId: string;
  messageText: string;
  sentAt: Date;
  status: 'Sent' | 'Delivered' | 'Seen';
}
