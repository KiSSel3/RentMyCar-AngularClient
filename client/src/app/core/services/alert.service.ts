import { Injectable } from '@angular/core';
import {AlertModel} from '../../shared/models/alert.model';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private alerts: AlertModel[] = [];
  private alertsSubject = new BehaviorSubject<AlertModel[]>([]);
  alerts$ = this.alertsSubject.asObservable();

  show(message: string, type: AlertModel['type'] = 'info'): void {
    console.log('Showing alert:', message, type);
    const alert: AlertModel = {
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
