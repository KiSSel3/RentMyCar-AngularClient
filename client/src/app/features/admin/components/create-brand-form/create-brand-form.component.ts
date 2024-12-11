import {Component, inject} from '@angular/core';
import {
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrandManagementService} from '../../services/brand-management.service';
import {AlertService} from '../../../../core/services/alert.service';
import {BrandRequestDTO} from '../../dtos/brand-request.dto';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';

@Component({
  selector: 'app-create-brand-form',
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
    MatDialogClose
  ],
  templateUrl: './create-brand-form.component.html',
  styleUrl: './create-brand-form.component.css'
})
export class CreateBrandFormComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateBrandFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly brandService = inject(BrandManagementService);
  private readonly alertService = inject(AlertService);

  brandForm: FormGroup;

  constructor() {
    this.brandForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(2)]]
    });
  }

  submit(): void {
    if (this.brandForm.valid) {
      const formValue: BrandRequestDTO = this.brandForm.value;

      this.brandService.createBrand(formValue).subscribe({
        next: () => {
          this.alertService.show('Brand created successfully!', 'success');
          this.dialogRef.close(formValue);
        },
        error: (err) => {
          this.alertService.show('Failed to create brand.', 'error');
          console.error(err);
        }
      });
    }
  }
}
