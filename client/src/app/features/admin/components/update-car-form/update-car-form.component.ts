import { Component, Inject, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { AlertService } from '../../../../core/services/alert.service';
import { CarManagementService } from '../../services/car-management.service';
import { CarModelService } from '../../../../core/services/car-model.service';
import { CarDTO } from '../../../../core/data/dtos/responses/car.dto';
import { CarModelDTO } from '../../../../core/data/dtos/responses/car-model.dto';
import { CarBodyType } from '../../../../core/data/enums/car-body-type.enum';
import { CarDriveType } from '../../../../core/data/enums/car-drive-type.enum';
import { CarTransmissionType } from '../../../../core/data/enums/car-transmission-type.enum';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import {MatButton, MatIconButton} from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import {MatIcon} from '@angular/material/icon';

@Component({
  selector: 'app-update-car-form',
  standalone: true,
  imports: [
    NgForOf,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatLabel,
    MatSelect,
    MatOption,
    MatFormField,
    MatDialogActions,
    MatDialogClose,
    MatButton,
    MatInput,
    NgIf,
    MatIcon,
    MatIconButton
  ],
  templateUrl: './update-car-form.component.html',
  styleUrls: ['./update-car-form.component.css']
})
export class UpdateCarFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UpdateCarFormComponent>);
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

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: CarDTO
  ) {
    this.carForm = this.fb.group({
      modelId: [data.carModel.id, Validators.required],
      bodyType: [data.bodyType, Validators.required],
      driveType: [data.driveType, Validators.required],
      transmissionType: [data.transmissionType, Validators.required],
      modelYear: [new Date(data.modelYear), Validators.required]
    });
  }

  ngOnInit(): void {
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

      const updateCarDTO = {
        ...formValue,
        id: this.data.id,
        modelYear: formValue.modelYear instanceof Date ? formValue.modelYear : new Date(formValue.modelYear)
      };

      if (this.selectedImage?.file) {
        updateCarDTO['image'] = this.selectedImage.file;
      }

      this.carService.updateCar(this.data.id, updateCarDTO).subscribe({
        next: () => {
          this.alertService.show('Car updated successfully!', 'success');
          this.dialogRef.close(updateCarDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to update car.', 'error');
          console.error(err);
        }
      });
    }
  }
}
