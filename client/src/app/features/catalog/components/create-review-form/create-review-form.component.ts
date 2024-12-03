import {Component, Inject, inject} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef, MatDialogTitle
} from '@angular/material/dialog';
import {NgForOf, NgIf} from '@angular/common';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption, MatSelect} from '@angular/material/select';
import {MatButton} from '@angular/material/button';
import {MatInput} from '@angular/material/input';
import {ReviewManagementService} from '../../services/review-management.service';
import {AlertService} from '../../../../core/services/alert.service';

@Component({
  selector: 'app-create-review-form',
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
  templateUrl: './create-review-form.component.html',
  styleUrl: './create-review-form.component.css'
})
export class CreateReviewFormComponent {
  private readonly dialogRef = inject(MatDialogRef<CreateReviewFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly reviewService = inject(ReviewManagementService);
  private readonly alertService = inject(AlertService);

  reviewForm: FormGroup;

  constructor(@Inject(MAT_DIALOG_DATA) public data: { rentOfferId: string; userId: string }) {
    this.reviewForm = this.fb.group({
      rating: [null, [Validators.required]],
      comment: ['', [Validators.required, Validators.minLength(1)]]
    });
  }

  submit(): void {
    if (this.reviewForm.valid) {
      const formValue = this.reviewForm.value;

      const createReviewDTO = {
        rentOfferId: this.data.rentOfferId,
        reviewerId: this.data.userId,
        rating: formValue.rating,
        comment: formValue.comment
      };

      this.reviewService.createReview(createReviewDTO).subscribe({
        next: () => {
          this.alertService.show('Review created successfully!', 'success');
          this.dialogRef.close(createReviewDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to create review.', 'error');
          console.error(err);
        }
      });
    }
  }
}
