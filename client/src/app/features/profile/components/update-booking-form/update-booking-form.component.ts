import {Component, Inject, inject} from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions, MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {BookingManagementService} from '../../services/booking-management.service';
import {AlertService} from '../../../../core/services/alert.service';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatOption} from '@angular/material/core';
import {MatSelect} from '@angular/material/select';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {NgForOf} from '@angular/common';

@Component({
  selector: 'app-update-booking-form',
  standalone: true,
  imports: [
    MatDialogTitle,
    MatDialogContent,
    ReactiveFormsModule,
    MatLabel,
    MatFormField,
    MatOption,
    MatSelect,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgForOf
  ],
  templateUrl: './update-booking-form.component.html',
  styleUrl: './update-booking-form.component.css'
})
export class UpdateBookingFormComponent {
  private readonly dialogRef = inject(MatDialogRef<UpdateBookingFormComponent>);
  private readonly fb = inject(FormBuilder);
  private readonly bookingService = inject(BookingManagementService);
  private readonly alertService = inject(AlertService);

  bookingForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { bookingId: string; currentStatus: string }
  ) {
    this.bookingForm = this.fb.group({
      status: [data.currentStatus, Validators.required],
      message: [''],
    });
  }

  submit(): void {
    if (this.bookingForm.valid) {
      const updateBookingDTO = this.bookingForm.value;

      this.bookingService.updateBooking(this.data.bookingId, updateBookingDTO).subscribe({
        next: () => {
          this.alertService.show('Booking status updated successfully!', 'success');
          this.dialogRef.close(updateBookingDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to update booking status.', 'error');
          console.error(err);
        },
      });
    }
  }
}
