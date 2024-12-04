import {Component, inject, OnInit} from '@angular/core';
import {CarModelService} from '../../../../core/services/car-model.service';
import {CarModelDTO} from '../../../../core/data/dtos/responses/car-model.dto';
import {NgForOf, NgIf} from '@angular/common';
import {CreateCarModelFormComponent} from '../create-car-model-form/create-car-model-form.component';
import {MatDialog} from '@angular/material/dialog';
import {CarModelManagementService} from '../../services/car-model-management.service';
import {UpdateCarModelFormComponent} from '../update-car-model-form/update-car-model-form.component';

@Component({
  selector: 'app-car-models',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './car-models.component.html',
  styleUrl: './car-models.component.css'
})
export class CarModelsComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly carModelService = inject(CarModelService);
  private readonly carModelManagementService = inject(CarModelManagementService);

  carModels: CarModelDTO[] = [];

  ngOnInit(): void {
    this.loadCarModels();
  }

  loadCarModels(): void {
    this.carModelService.getAllCarModels().subscribe({
      next: (data) => {
        this.carModels = data;
      },
      error: (err) => {
        console.error('Failed to load car models:', err);
      },
    });
  }

  createCarModel(): void {
    const dialogRef = this.dialog.open(CreateCarModelFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadCarModels();
      }
    });
  }

  editCarModel(id: string): void {
    const carModelToEdit = this.carModels.find((carModel) => carModel.id === id);

    if (carModelToEdit) {
      const dialogRef = this.dialog.open(UpdateCarModelFormComponent, {
        width: '400px',
        data: {
          id: carModelToEdit.id,
          name: carModelToEdit.name,
          carBrandId: carModelToEdit.brand.id
        }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadCarModels();
        }
      });
    }
  }

  deleteCarModel(id: string): void {
    if (confirm('Are you sure you want to delete this car model?')) {
      this.carModelManagementService.deleteCarModel(id).subscribe({
        next: () => {
          this.loadCarModels();
        },
        error: (err) => {
          console.error('Failed to delete brand:', err);
        }
      });
    }
  }
}
