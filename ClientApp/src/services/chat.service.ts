  import { Injectable } from '@angular/core';
  import * as signalR from '@microsoft/signalr';
  import { HttpClient } from '@angular/common/http';
  import { BehaviorSubject, Subject } from 'rxjs';
  import { RealtimeChatMessage } from '../app/models/realtime-chat-message';


  @Injectable({ providedIn: 'root' })
  export class ChatService {

    private hubConnection!: signalR.HubConnection;
    private connectionPromise?: Promise<void>;

    private readonly hubUrl = 'http://localhost:5146/chatHub';
    private readonly apiUrl = 'http://localhost:5146/api/v1/chat';
    incomingMessage$ = new Subject<any>();

  onlineUsers$ = new BehaviorSubject<string[]>([]);


    private pingInterval?: any;


    private connectionReady = false;
    private isConnected = false;
    private messageListenerRegistered = false;



    constructor(private http: HttpClient) {}

    async startConnection(): Promise<void> {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        this.connectionReady = true;
        this.isConnected = true;
        return;
      }

      if (this.connectionPromise) {
        return this.connectionPromise;
      }

      this.hubConnection = new signalR.HubConnectionBuilder()
    .withUrl(this.hubUrl, {
      accessTokenFactory: () => localStorage.getItem('token') || ''
    })
    .withAutomaticReconnect()
    .build();

  /* 🔥 ADD THESE EXACTLY HERE 🔥 */
  this.hubConnection.onreconnected(() => {
    console.log('[SignalR] Reconnected');
    this.startHeartbeat();
  });

  this.hubConnection.onclose(() => {
    console.log('[SignalR] Connection closed');
    this.stopHeartbeat();
  });
  /* 🔥 END 🔥 */

  this.connectionPromise = this.hubConnection
  .start()
  .then(() => {
    this.connectionReady = true;
    this.isConnected = true;

    // INITIAL ONLINE USERS
    this.hubConnection.on('OnlineUsers', (userIds: string[]) => {
      this.onlineUsers$.next(userIds);
    });

    // LIVE UPDATES
    this.hubConnection.on('UserOnline', (userId: string) => {
      const current = this.onlineUsers$.value;
      if (!current.includes(userId)) {
        this.onlineUsers$.next([...current, userId]);
      }
    });

    this.hubConnection.on('UserOffline', (userId: string) => {
      this.onlineUsers$.next(
        this.onlineUsers$.value.filter(id => id !== userId)
      );
    });

    this.registerReceiveMessage();
    this.startHeartbeat();

    console.log('[SignalR] Connected');
  });
    }

    private startHeartbeat() {
    if (this.pingInterval) return;

    this.pingInterval = setInterval(() => {
      if (this.hubConnection?.state === signalR.HubConnectionState.Connected) {
        this.hubConnection.invoke('Ping')
          .catch(err => console.warn('Ping failed', err));
      }
    }, 10000); // every 10s
  }

    
  private stopHeartbeat() {
    if (this.pingInterval) {
      clearInterval(this.pingInterval);
      this.pingInterval = undefined;
    }
  }
  


    async stopConnection(): Promise<void> {
    if (!this.hubConnection) return;

    this.stopHeartbeat(); // 🔥 ADD
    await this.hubConnection.stop();

    this.connectionReady = false;
    this.isConnected = false;
    this.connectionPromise = undefined;

    console.log('[SignalR] Disconnected');
  }


    isReady(): boolean {
      return this.connectionReady;
    }

    isSignalRConnected(): boolean {
      return this.isConnected;
    }

    async sendMessage(
      senderId: string,
      receiverId: string,
      message: string
    ): Promise<void> {
      await this.startConnection();
      return this.hubConnection.invoke(
        'SendMessage',
        senderId,
        receiverId,
        message
      );
    }

    private registerReceiveMessage() {
    if (this.messageListenerRegistered || !this.hubConnection) return;

    this.messageListenerRegistered = true;

    this.hubConnection.on('ReceiveMessage', (msg: RealtimeChatMessage) => {
      console.log('📩 ReceiveMessage', msg);
      this.incomingMessage$.next(msg);
    });
  }




    getHistory(user1: string, user2: string) {
      return this.http.get<any[]>(
        `${this.apiUrl}/history/${user1}/${user2}`
      );
    }

    // =====================================================
    // GROUP CHAT
    // =====================================================
    async joinGroup(groupId: string): Promise<void> {
      await this.startConnection();
      return this.hubConnection.invoke('JoinGroup', groupId);
    }

    async leaveGroup(groupId: string): Promise<void> {
      if (!this.hubConnection) return;
      return this.hubConnection.invoke('LeaveGroup', groupId);
    }

    async sendGroupMessage(groupId: string, message: string): Promise<void> {
      await this.startConnection();
      return this.hubConnection.invoke(
        'SendGroupMessage',
        groupId,
        message
      );
    }

    onGroupMessageReceived(callback: (msg: any) => void): void {
      if (!this.hubConnection) return;

      this.hubConnection.off('ReceiveGroupMessage');
      this.hubConnection.on('ReceiveGroupMessage', callback);
    }

    getGroupHistory(groupId: string) {
      return this.http.get<any[]>(
        `http://localhost:5146/api/v1/GroupChat/group/${groupId}`
      );
    }



    // ==========================
  // ONLINE / OFFLINE
  // ==========================
  onUserStatusChanged(callback: (data: any) => void) {
    this.hubConnection.on('UserStatusChanged', callback);
  }

  // ==========================
  // MESSAGE SEEN
  // ==========================
  onMessageSeen(callback: (data: any) => void) {
    this.hubConnection.on('MessageSeen', callback);
  }


  // ==========================
  // TYPING
  // ==========================
  onUserTyping(callback: (senderId: string) => void) {
    this.hubConnection.on('UserTyping', callback);
  }

  onUserStoppedTyping(callback: (senderId: string) => void) {
    this.hubConnection.on('UserStoppedTyping', callback);
  }
  onMessageStatusUpdated(callback: (data: any) => void) {
    this.hubConnection.on('MessageStatusUpdated', callback);
  }

  // ==========================
  // SEND TYPING
  // ==========================
  sendTyping(senderId: string, receiverId: string) {
    return this.hubConnection.invoke('UserTyping', senderId, receiverId);
  }

  stopTyping(senderId: string, receiverId: string) {
    return this.hubConnection.invoke('UserStoppedTyping', senderId, receiverId);
  }

  // ==========================
  // MESSAGE SEEN (1-1)
  // ==========================
  markMessageSeen(messageId: string, senderId: string) {
    return this.hubConnection.invoke('MessageSeen', messageId, senderId);
  }



    // =====================================================
    // OPTIONAL: TYPING (future-ready)
    // =====================================================
    // async groupTyping(groupId: string): Promise<void> {
    //   await this.startConnection();
    //   return this.hubConnection.invoke('GroupTyping', groupId);
    // }

    // onGroupTyping(callback: (userId: string) => void): void {
    //   if (!this.hubConnection) return;

    //   this.hubConnection.off('GroupTyping');
    //   this.hubConnection.on('GroupTyping', callback);
    // }
  }
