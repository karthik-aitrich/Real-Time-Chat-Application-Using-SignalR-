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
  this.hubConnection = new signalR.HubConnectionBuilder()
  .withUrl('http://localhost:5146/chatHub', {
    accessTokenFactory: () => {
      return localStorage.getItem('token') || '';
    }
  })
  .withAutomaticReconnect()
  .build();


  this.hubConnection.start()
    .then(() => console.log('SignalR Connected'))
    .catch(err => console.error('SignalR Error:', err));
}




getHistory(user1: string, user2: string) {
  return this.http.get<Message[]>(
    `${this.baseUrl}/history/${user1}/${user2}`
  );
}



  sendMessage(senderId: string, receiverId: string, message: string) {
    return this.hubConnection.invoke('SendMessage', senderId, receiverId, message);
  }

  onMessageReceived(callback: (msg: any) => void) {
    this.hubConnection.on('ReceiveMessage', callback);
  }
}
