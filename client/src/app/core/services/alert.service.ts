import { Injectable } from '@angular/core';
import {Alert} from '../models/alert';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts: Alert[] = [];
  private alertsSubject = new BehaviorSubject<Alert[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  show(message: string, type: Alert['type'] = 'info'): void {
    console.log('Showing alert:', message, type);
    const alert: Alert = {
      id: Date.now(),
      message,
      type
    };

    this.alerts = [...this.alerts, alert];
    this.alertsSubject.next(this.alerts);

    setTimeout(() => {
      this.remove(alert.id);
    }, 5000);
  }

  remove(id: number): void {
    this.alerts = this.alerts.filter(alert => alert.id !== id);
    this.alertsSubject.next(this.alerts);
  }
}
