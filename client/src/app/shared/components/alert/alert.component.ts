import {Component, inject} from '@angular/core';
import {CommonModule} from '@angular/common';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {AlertService} from '../../../core/services/alert.service';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css'],
  animations: [
    trigger('slideIn', [
      state('void', style({
        transform: 'translateX(100%)',
        opacity: 0
      })),
      state('visible', style({
        transform: 'translateX(0)',
        opacity: 1
      })),
      transition('void => visible', animate('200ms ease-out')),
      transition('visible => void', animate('200ms ease-in'))
    ])
  ]
})
export class AlertComponent {
  private readonly alertService = inject(AlertService);
  alerts$ = this.alertService.alerts$;

  remove(id: number): void {
    this.alertService.remove(id);
  }
}
