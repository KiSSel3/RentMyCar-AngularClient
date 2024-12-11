import {Component, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BrandService} from '../../../../core/services/brand.service';
import {AlertService} from '../../../../core/services/alert.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {BrandManagementService} from '../../services/brand-management.service';
import {MatFormField, MatFormFieldModule} from '@angular/material/form-field';
import {MatInput, MatInputModule} from '@angular/material/input';
import {MatButton, MatButtonModule} from '@angular/material/button';
import {BrandRequestDTO} from '../../dtos/brand-request.dto';

@Component({
  selector: 'app-update-brand-form',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatDialogActions,
    MatDialogClose
  ],
  templateUrl: './update-brand-form.component.html',
  styleUrl: './update-brand-form.component.css'
})
export class UpdateBrandFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly brandService = inject(BrandManagementService);
  private readonly alertService = inject(AlertService);
  private readonly dialogRef = inject(MatDialogRef<UpdateBrandFormComponent>);

  updateBrandForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { id: string; name: string }) {
    this.updateBrandForm = this.fb.group({
      name: [data.name, [Validators.required, Validators.minLength(2), Validators.maxLength(50)]]
    });
  }

  submit(): void {
    if (this.updateBrandForm.valid) {
      const brandRequest: BrandRequestDTO = {
        name: this.updateBrandForm.value.name
      };

      this.brandService.updateBrand(this.data.id, brandRequest).subscribe({
        next: () => {
          this.alertService.show('Brand updated successfully!', 'success');
          this.dialogRef.close(true);
        },
        error: (err) => {
          this.alertService.show('Failed to update brand.', 'error');
          console.error(err);
        }
      });
    }
  }
}
