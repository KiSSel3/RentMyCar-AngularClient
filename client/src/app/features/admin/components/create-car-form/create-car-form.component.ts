import { Component, inject } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { CarManagementService } from '../../services/car-management.service';
import { AlertService } from '../../../../core/services/alert.service';
import { CarModelService } from '../../../../core/services/car-model.service';
import { CarRequestDTO } from '../../dtos/car-request.dto';
import {NgForOf, NgIf} from '@angular/common';
import {CarModelDTO} from '../../../../core/data/dtos/responses/car-model.dto';
import {CarBodyType} from '../../../../core/data/enums/car-body-type.enum';
import {CarDriveType} from '../../../../core/data/enums/car-drive-type.enum';
import {CarTransmissionType} from '../../../../core/data/enums/car-transmission-type.enum';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatIcon} from '@angular/material/icon';
import {MatButton, MatIconButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-create-car-form',
  standalone: true,
  imports: [NgForOf, MatDialogTitle, MatDialogContent, ReactiveFormsModule, MatLabel, MatSelect, MatOption, MatFormField, MatIcon, MatDialogActions, MatDialogClose, MatButton, MatIconButton, MatInput, NgIf],
  templateUrl: './create-car-form.component.html',
  styleUrls: ['./create-car-form.component.css']
})
export class CreateCarFormComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateCarFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly carService = inject(CarManagementService);
  private readonly alertService = inject(AlertService);
  private readonly carModelService = inject(CarModelService);

  carForm: FormGroup;
  carModels: CarModelDTO[] = [];
  bodyTypes = Object.values(CarBodyType);
  driveTypes = Object.values(CarDriveType);
  transmissionTypes = Object.values(CarTransmissionType);
  selectedImage: { file: File; previewUrl: string } | null = null;

  constructor() {
    this.carForm = this.fb.group({
      modelId: [null, Validators.required],
      bodyType: [null, Validators.required],
      driveType: [null, Validators.required],
      transmissionType: [null, Validators.required],
      modelYear: [null, Validators.required],
      image: [null, Validators.required]
    });

    this.loadCarModels();
  }

  private loadCarModels(): void {
    this.carModelService.getAllCarModels().subscribe({
      next: (data) => {
        this.carModels = data;
      },
      error: (err) => {
        console.error('Failed to load car models:', err);
      }
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.selectedImage = { file, previewUrl: reader.result as string };
        this.carForm.patchValue({ image: file });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.selectedImage = null;
    this.carForm.patchValue({ image: null });
  }

  submit(): void {
    if (this.carForm.valid) {
      const formValue = this.carForm.value;

      const createCarDTO = {
        ...formValue
      };

      this.carService.createCar(createCarDTO).subscribe({
        next: () => {
          this.alertService.show('Car created successfully!', 'success');
          this.dialogRef.close(createCarDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to create car.', 'error');
          console.error(err);
        },
      });
    }
  }
}
