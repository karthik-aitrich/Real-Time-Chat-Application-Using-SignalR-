import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Message } from '../app/models/message.model';

@Injectable({ providedIn: 'root' })
export class ChatService {

  private hubConnection?: signalR.HubConnection;
  private connectionPromise?: Promise<void>;

  private hubUrl = 'http://localhost:5146/chatHub';
  private apiUrl = 'http://localhost:5146/api/v1/chat';
  private isConnected = false;
  private connectionReady = false;



  constructor(private http: HttpClient) {}

  // ===============================
  // START / ENSURE CONNECTION
  // ===============================

async startConnection(): Promise<void> {
  if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
    this.connectionReady = true;
    return;
  }

  if (this.connectionPromise) {
    await this.connectionPromise;
    return;
  }

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5146/chatHub', {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  this.connectionPromise = this.hubConnection.start()
    .then(() => {
      this.connectionReady = true;
      console.log('SignalR ready');
    })
    .catch(err => {
      this.connectionReady = false;
      this.connectionPromise = undefined;
      throw err;
    });

  await this.connectionPromise;
}

isReady(): boolean {
  return this.connectionReady;
}


  // ===============================
  // MESSAGE METHODS
  // ===============================
  async sendMessage(senderId: string, receiverId: string, message: string) {
    await this.startConnection();
    return this.hubConnection!.invoke(
      'SendMessage',
      senderId,
      receiverId,
      message
    );
  }

  isSignalRConnected(): boolean {
  return this.isConnected;
}

  onMessageReceived(callback: (msg: any) => void) {
    this.hubConnection?.off('ReceiveMessage'); // 👈 prevent duplicate handlers
    this.hubConnection?.on('ReceiveMessage', callback);
  }

  // ===============================
  // HISTORY
  // ===============================
  getHistory(user1: string, user2: string) {
    return this.http.get<any[]>(
      `${this.apiUrl}/history/${user1}/${user2}`
    );
  }

  async joinGroup(groupId: string) {
  await this.startConnection();
  return this.hubConnection!.invoke('JoinGroup', groupId);
}

async sendGroupMessage(groupId: string, senderId: string, message: string) {
  await this.startConnection();
  return this.hubConnection!.invoke(
    'SendGroupMessage',
    groupId,
    senderId,
    message
  );
}

onGroupMessageReceived(callback: (msg: any) => void) {
  this.hubConnection?.off('ReceiveGroupMessage'); // 👈 prevent duplicates
  this.hubConnection?.on('ReceiveGroupMessage', callback);
}

onMessageSeen(callback: (messageId: string) => void) {
  this.hubConnection?.off('MessageSeen');
  this.hubConnection?.on('MessageSeen', callback);
}
async markMessageSeen(messageId: string, senderId: string) {
  await this.startConnection();

  return this.hubConnection!.invoke(
    'MessageSeen',
    messageId,
    senderId
  );
}

getGroupHistory(groupId: string) {
  return this.http.get<any[]>(
    `http://localhost:5146/api/v1/GroupChat/group/${groupId}`
  );
}


}
