import { Injectable } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ReviewHubService {
  private readonly hubUrl = `${environment.apiUrl}/cars/hubs/reviews`;
  private hubConnection!: signalR.HubConnection;

  constructor() {
    this.initializeConnection();
  }

  private initializeConnection(): void {
    this.hubConnection = new signalR.HubConnectionBuilder()
      .withUrl(this.hubUrl)
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();

    this.hubConnection.start()
      .then(() => console.log('SignalR connected to ReviewHub'))
      .catch(err => console.error('Error connecting to ReviewHub:', err));

    this.hubConnection.onclose(() => {
      console.warn('SignalR connection closed. Attempting to reconnect...');
      this.reconnect();
    });
  }

  private reconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.start()
        .then(() => console.log('Reconnected to ReviewHub'))
        .catch(err => console.error('Reconnection failed:', err));
    }
  }

  joinGroup(rentOfferId: string): void {
    this.hubConnection.invoke('JoinGroup', rentOfferId)
      .then(() => console.log(`Joined group: ${rentOfferId}`))
      .catch(err => console.error('Error joining group:', err));
  }

  leaveGroup(rentOfferId: string): void {
    this.hubConnection.invoke('LeaveGroup', rentOfferId)
      .then(() => console.log(`Left group: ${rentOfferId}`))
      .catch(err => console.error('Error leaving group:', err));
  }

  onReceiveReview(callback: (review: any) => void): void {
    this.hubConnection.on('ReceiveReview', callback);
  }

  sendReview(rentOfferId: string, review: any): void {
    this.hubConnection.invoke('SendMessage', rentOfferId, review)
      .then(() => console.log('Review sent successfully'))
      .catch(err => console.error('Error sending review:', err));
  }

  disconnect(): void {
    if (this.hubConnection) {
      this.hubConnection.stop()
        .then(() => console.log('Disconnected from ReviewHub'))
        .catch(err => console.error('Error disconnecting:', err));
    }
  }
}
