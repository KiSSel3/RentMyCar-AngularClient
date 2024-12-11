import { Component, Inject, inject, OnInit } from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CarModelManagementService } from '../../services/car-model-management.service';
import { AlertService } from '../../../../core/services/alert.service';
import { CarModelRequestDTO } from '../../dtos/car-model-request.dto';
import { BrandService } from '../../../../core/services/brand.service';
import { BrandDTO } from '../../../../core/data/dtos/responses/brand.dto';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { MatSelect, MatOption } from '@angular/material/select';
import { NgIf, NgForOf } from '@angular/common';

@Component({
  selector: 'app-update-car-model-form',
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
    MatDialogClose,
    MatSelect,
    MatOption,
    NgIf,
    NgForOf
  ],
  templateUrl: './update-car-model-form.component.html',
  styleUrl: './update-car-model-form.component.css'
})
export class UpdateCarModelFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<UpdateCarModelFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly carModelService = inject(CarModelManagementService);
  private readonly brandService = inject(BrandService);
  private readonly alertService = inject(AlertService);

  carModelForm: FormGroup;
  brands: BrandDTO[] = [];

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string; name: string; carBrandId: string }) {
    this.carModelForm = this.fb.group({
      name: [this.data.name, [Validators.required, Validators.minLength(2)]],
      carBrandId: [this.data.carBrandId, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (brands) => {
        this.brands = brands;
      },
      error: (err) => {
        console.error('Failed to load brands:', err);
      }
    });
  }

  submit(): void {
    if (this.carModelForm.valid) {
      const formValue: CarModelRequestDTO = this.carModelForm.value;

      this.carModelService.updateCarModel(this.data.id, formValue).subscribe({
        next: () => {
          this.alertService.show('Car model updated successfully!', 'success');
          this.dialogRef.close(formValue);
        },
        error: (err) => {
          this.alertService.show('Failed to update car model.', 'error');
          console.error(err);
        }
      });
    }
  }
}
