import { Component, inject, OnInit } from '@angular/core';
import { CarService } from '../../../../core/services/car.service';
import { CarDTO } from '../../../../core/data/dtos/responses/car.dto';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import {CarManagementService} from '../../services/car-management.service';
import {CreateCarFormComponent} from '../create-car-form/create-car-form.component';
import {UpdateCarFormComponent} from '../update-car-form/update-car-form.component';

@Component({
  selector: 'app-cars',
  standalone: true,
  imports: [NgIf, NgForOf, DatePipe],
  templateUrl: './cars.component.html',
  styleUrl: './cars.component.css',
})
export class CarsComponent implements OnInit {
  private readonly carService = inject(CarService);
  private readonly carManagementService = inject(CarManagementService);
  private readonly dialog = inject(MatDialog);

  cars: CarDTO[] = [];

  ngOnInit(): void {
    this.loadCars();
  }

  loadCars(): void {
    this.carService
      .getCarsByParameters({})
      .subscribe({
        next: (response) => {
          this.cars = response.collection;
        },
        error: (err) => {
          console.error('Failed to load cars:', err);
        },
      });
  }

  createCar(): void {
    const dialogRef = this.dialog.open(CreateCarFormComponent, {
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCars();
      }
    });
  }

  editCar(id: string): void {
    const carToEdit = this.cars.find((car) => car.id === id);

    if (carToEdit) {
      const dialogRef = this.dialog.open(UpdateCarFormComponent, {
        width: '600px',
        data: carToEdit,
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadCars();
        }
      });
    }
  }

  deleteCar(id: string): void {
    if (confirm('Are you sure you want to delete this car?')) {
      this.carManagementService.deleteCar(id).subscribe({
        next: () => {
          this.loadCars();
        },
        error: (err) => {
          console.error('Failed to delete car:', err);
        },
      });
    }
  }
}
