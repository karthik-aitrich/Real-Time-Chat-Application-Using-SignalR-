// notification-state.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface AppNotification {
  id: number;
  title: string;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationStateService {

  private notifications$ = new BehaviorSubject<AppNotification[]>([]);
  notifications = this.notifications$.asObservable();

  private id = 0;

  show(title: string, message: string) {
    const notif: AppNotification = {
      id: ++this.id,
      title,
      message
    };

    this.notifications$.next([
      ...this.notifications$.value,
      notif
    ]);

    // auto dismiss
    setTimeout(() => this.remove(notif.id), 3000);
  }

  remove(id: number) {
    this.notifications$.next(
      this.notifications$.value.filter(n => n.id !== id)
    );
  }
}
