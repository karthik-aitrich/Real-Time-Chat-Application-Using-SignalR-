import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupStateService {
  private refreshGroupsSource = new Subject<void>();
  refreshGroups$ = this.refreshGroupsSource.asObservable();

  refreshGroups() {
    this.refreshGroupsSource.next();
  }
}
