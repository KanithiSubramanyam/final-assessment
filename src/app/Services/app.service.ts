import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private startWarningTimerSubject = new Subject<number>();
  startWarningTimer$ = this.startWarningTimerSubject.asObservable();

  startWarningTimer(expirationDuration: number) {
    this.startWarningTimerSubject.next(expirationDuration);
  }
}
