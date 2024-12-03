import { Component, Inject, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { NgForOf, NgIf } from '@angular/common';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatOption, MatSelect } from '@angular/material/select';
import { MatButton } from '@angular/material/button';
import { MatInput } from '@angular/material/input';
import { ReviewManagementService } from '../../services/review-management.service';
import { AlertService } from '../../../../core/services/alert.service';

@Component({
  selector: 'app-update-review-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    MatDialogContent,
    MatLabel,
    MatSelect,
    MatOption,
    NgForOf,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatInput,
    MatFormField,
    MatDialogTitle
  ],
  templateUrl: './update-review-form.component.html',
  styleUrl: './update-review-form.component.css'
})
export class UpdateReviewFormComponent {
  private readonly dialogRef = inject(MatDialogRef<UpdateReviewFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly reviewService = inject(ReviewManagementService);
  private readonly alertService = inject(AlertService);

  reviewForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { reviewId: string; rating: number; comment: string }) {
    this.reviewForm = this.fb.group({
      rating: [data.rating, [Validators.required]],
      comment: [data.comment, [Validators.required, Validators.minLength(1)]]
    });
  }

  submit(): void {
    if (this.reviewForm.valid) {
      const formValue = this.reviewForm.value;

      const updateReviewDTO = {
        rating: formValue.rating,
        comment: formValue.comment
      };

      this.reviewService.updateReview(this.data.reviewId, updateReviewDTO).subscribe({
        next: () => {
          this.alertService.show('Review updated successfully!', 'success');
          this.dialogRef.close(updateReviewDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to update review.', 'error');
          console.error(err);
        }
      });
    }
  }
}
