import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ChatStateService {
  activeChatUserId: string | null = null;
}
