import {Component, EventEmitter, Input, Output} from '@angular/core';
import {CarDTO} from '../../../core/data/dtos/responses/car.dto';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-car-card',
  standalone: true,
  imports: [
    DatePipe
  ],
  templateUrl: './car-card.component.html',
  styleUrl: './car-card.component.css'
})
export class CarCardComponent {
  @Input() car!: CarDTO;
  @Input() selected: boolean = false;
  @Output() carSelected = new EventEmitter<string>();

  selectCar(): void {
    this.carSelected.emit(this.car.id);
  }
}
