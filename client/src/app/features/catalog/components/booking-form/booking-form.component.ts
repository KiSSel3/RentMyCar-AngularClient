import {Component, Inject, inject, Input, OnChanges, SimpleChanges} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AlertService} from '../../../../core/services/alert.service';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField, MatLabel} from '@angular/material/form-field';
import {MatCalendar, MatDatepicker, MatDatepickerInput, MatDatepickerToggle} from '@angular/material/datepicker';
import {MatInput} from '@angular/material/input';
import {MatButton} from '@angular/material/button';
import {RentOfferBookingService} from '../../services/rent-offer-booking.service';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [
    MatDialogContent,
    MatLabel,
    ReactiveFormsModule,
    MatDatepickerInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatFormField,
    MatInput,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    MatDialogTitle,
    MatCalendar
  ],
  templateUrl: './booking-form.component.html',
  styleUrl: './booking-form.component.css'
})
export class BookingFormComponent {
  private readonly fb = inject(FormBuilder);
  private readonly alertService = inject(AlertService);
  private readonly bookingService = inject(RentOfferBookingService);
  private readonly dialogRef = inject(MatDialogRef<BookingFormComponent>);

  bookingForm: FormGroup;
  availableDates: Date[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: string; rentOfferId: string; availableDates: Date[] }
  ) {
    this.availableDates = data.availableDates.map(date => new Date(date));
    this.bookingForm = this.fb.group({
      rentalStart: [null, Validators.required],
      rentalEnd: [null, Validators.required],
      message: ['']
    });
  }

  dateClass = (date: Date): string => {
    return this.availableDates.some(availableDate => this.isSameDay(availableDate, date)) ? 'available-date' : '';
  };

  dateFilter = (date: Date | null): boolean => {
    if (!date) return false;
    return this.availableDates.some(availableDate => this.isSameDay(date, availableDate));
  };

  submit(): void {
    if (this.bookingForm.valid) {
      const formValue = this.bookingForm.value;

      const createBookingDTO = {
        userId: this.data.userId,
        rentOfferId: this.data.rentOfferId,
        rentalStart: this.toDateWithoutTimezone(formValue.rentalStart),
        rentalEnd: this.toDateWithoutTimezone(formValue.rentalEnd),
        message: formValue.message
      };

      console.log(createBookingDTO);

      this.bookingService.createBooking(createBookingDTO).subscribe({
        next: () => {
          this.alertService.show('Booking created successfully!', 'success');
          this.dialogRef.close(createBookingDTO);
        },
        error: (err) => {
          this.alertService.show('Failed to create booking.', 'error');
          console.error(err);
        }
      });
    }
  }

  private isSameDay(date1: Date, date2: Date): boolean {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate()
    );
  }

  private toDateWithoutTimezone(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}T00:00:00`;
  }
}
