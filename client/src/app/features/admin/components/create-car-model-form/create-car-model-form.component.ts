import { Component, inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarModelManagementService } from '../../services/car-model-management.service';
import { AlertService } from '../../../../core/services/alert.service';
import { CarModelRequestDTO } from '../../dtos/car-model-request.dto';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { BrandService } from '../../../../core/services/brand.service';
import { BrandDTO } from '../../../../core/data/dtos/responses/brand.dto';
import { NgForOf } from '@angular/common';

@Component({
  selector: 'app-create-car-model-form',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogTitle,
    MatLabel,
    ReactiveFormsModule,
    MatDialogActions,
    MatButton,
    MatFormField,
    MatInput,
    MatSelect,
    MatOption,
    MatDialogClose,
    NgForOf,
  ],
  templateUrl: './create-car-model-form.component.html',
  styleUrl: './create-car-model-form.component.css',
})
export class CreateCarModelFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CreateCarModelFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly carModelService = inject(CarModelManagementService);
  private readonly alertService = inject(AlertService);
  private readonly brandService = inject(BrandService);

  carModelForm: FormGroup;
  brands: BrandDTO[] = [];

  constructor() {
    this.carModelForm = this.fb.group({
      carBrandId: ['', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(2)]],
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        this.alertService.show('Failed to load brands.', 'error');
        console.error(err);
      },
    });
  }

  submit(): void {
    if (this.carModelForm.valid) {
      const formValue: CarModelRequestDTO = this.carModelForm.value;

      this.carModelService.createCarModel(formValue).subscribe({
        next: () => {
          this.alertService.show('Car model created successfully!', 'success');
          this.dialogRef.close(formValue);
        },
        error: (err) => {
          this.alertService.show('Failed to create car model.', 'error');
          console.error(err);
        },
      });
    }
  }
}
