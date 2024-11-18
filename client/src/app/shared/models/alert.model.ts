export type AlertType = 'success' | 'error' | 'info' | 'warning';

export interface AlertModel {
  id: number;
  message: string;
  type: AlertType;
}
