export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface Alert {
  id: number;
  message: string;
  type: AlertType;
}
