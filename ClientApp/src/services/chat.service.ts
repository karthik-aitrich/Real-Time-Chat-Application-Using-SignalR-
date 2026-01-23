import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { HttpClient } from '@angular/common/http';
import { Message } from '../app/models/message.model';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private baseUrl = 'http://localhost:5146/api/v1/chat';
  private hubConnection!: signalR.HubConnection;

  constructor(private http: HttpClient) {}

 startConnection() {
  if (this.hubConnection) return;  // 👈 prevent duplicate

  this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5146/chatHub', {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  this.hubConnection.start()
    .then(() => console.log('SignalR Connected'))
    .catch(err => console.error('SignalR Error:', err));
}

async ensureConnected(): Promise<void> {
  // If connection not created yet → start it
  if (!this.hubConnection) {
    this.startConnection();
  }

  // If connection exists but not connected → wait
  if (this.hubConnection.state !== signalR.HubConnectionState.Connected) {
    try {
      await this.hubConnection.start();
      console.log('SignalR ensured connected');
    } catch (err) {
      console.error('SignalR ensureConnected failed:', err);
    }
  }
}



  getHistory(user1: string, user2: string) {
    return this.http.get<Message[]>(
      `${this.baseUrl}/history/${user1}/${user2}`
    );
  }

  sendMessage(senderId: string, receiverId: string, message: string) {
    return this.hubConnection.invoke('SendMessage', senderId, receiverId, message);
  }

  onMessageReceived(callback: (msg: Message) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }

  onUserStatusChange(callback: (userId: string, isOnline: boolean) => void) {
    this.hubConnection.on('UserStatusChanged', callback);
  }

  logout() {
  return this.http.post('http://localhost:5146/api/v1/Auth/logout', {});
}


joinGroup(groupId: string) {
  this.hubConnection.invoke('JoinGroup', groupId);
}

sendGroupMessage(groupId: string, senderId: string, message: string) {
  this.hubConnection.invoke('SendGroupMessage', groupId, senderId, message);
}

onGroupMessageReceived(callback: (msg: any) => void) {
  this.hubConnection.on('ReceiveGroupMessage', callback);
}


onUserTyping(callback: (senderId: string) => void) {
  this.hubConnection.on('UserTyping', callback);
}

getUserById(id: string) {
  return this.http.get<any>(`${this.baseUrl}/user/${id}`);
}



onUserStoppedTyping(callback: (senderId: string) => void) {
  this.hubConnection.on('UserStoppedTyping', callback);
}

sendTyping(senderId: string, receiverId: string) {
  this.hubConnection.invoke('UserTyping', senderId, receiverId);
}

stopTyping(senderId: string, receiverId: string) {
  this.hubConnection.invoke('UserStoppedTyping', senderId, receiverId);
}

// getHistory(user1: string, user2: string) {
//   return this.http.get<Message[]>(
//     `${this.baseUrl}/history/${user1}/${user2}`
//   );
// }

getGroupHistory(groupId: string) {
  return this.http.get<any[]>(
    `http://localhost:5146/api/v1/GroupChat/group/${groupId}`
  );
}





}
