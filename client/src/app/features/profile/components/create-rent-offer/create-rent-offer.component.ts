import {Component, inject, OnInit} from '@angular/core';
import {CarService} from '../../../../core/services/car.service';
import {RentOfferManagementService} from '../../services/rent-offer-management.service';
import {AlertService} from '../../../../core/services/alert.service';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CarDTO} from '../../../../core/data/dtos/responses/car.dto';
import {AuthService} from '../../../../core/services/auth.service';
import {DatePipe, NgForOf, NgIf} from '@angular/common';
import {MatIcon} from '@angular/material/icon';
import {MatIconButton} from '@angular/material/button';
import {CarCardComponent} from '../../../../shared/components/car-card/car-card.component';

@Component({
  selector: 'app-create-rent-offer',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    DatePipe,
    NgForOf,
    NgIf,
    MatIcon,
    MatIconButton,
    CarCardComponent
  ],
  templateUrl: './create-rent-offer.component.html',
  styleUrl: './create-rent-offer.component.css'
})
export class CreateRentOfferComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly carService = inject(CarService);
  private readonly rentOfferService = inject(RentOfferManagementService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  cars: CarDTO[] = [];
  createForm!: FormGroup;
  isLoading = true;
  selectedImages: { file: File; previewUrl: string }[] = [];

  ngOnInit(): void {
    this.loadCars();
    this.initForm();
  }

  private loadCars(): void {
    this.isLoading = true;
    this.carService.getCarsByParameters({ pageNumber: 1, pageSize: 50 }).subscribe({
      next: (response) => {
        this.cars = response.collection;
        this.isLoading = false;
      },
      error: () => {
        this.alertService.show('Failed to load cars', 'error');
        this.isLoading = false;
      },
    });
  }

  private initForm(): void {
    this.createForm = this.fb.group({
      carId: [null, Validators.required],
      locationModel: this.fb.group({
        city: ['', Validators.required],
        street: ['', Validators.required],
        building: ['', Validators.required],
      }),
      availableFrom: [null, Validators.required],
      availableTo: [null, Validators.required],
      pricePerDay: [null, [Validators.required, Validators.min(0)]],
      description: ['', Validators.required],
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.selectedImages.push({ file, previewUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(index: number): void {
    this.selectedImages.splice(index, 1);
  }

  submit(): void {
    if (this.createForm.valid) {
      const userId = this.authService.getUserId();
      const rentOffer = { ...this.createForm.value, userId };

      this.rentOfferService.createRentOffer(rentOffer).subscribe({
        next: (createdOfferId: string) => {
          this.alertService.show('Rent offer created successfully!', 'success');

          console.log(createdOfferId);
          if (this.selectedImages.length > 0) {
            this.uploadImages(createdOfferId);
          } else {
            this.navigateToOffers();
          }
        },
        error: () => {
          this.alertService.show('Failed to create rent offer', 'error');
        },
      });
    }
  }

  private uploadImages(rentOfferId: string): void {
    const formData = new FormData();
    this.selectedImages.forEach((image) => formData.append('images', image.file));

    this.rentOfferService.addImagesToRentOffer(rentOfferId, formData).subscribe({
      next: () => {
        this.alertService.show('Images uploaded successfully!', 'success');
        this.navigateToOffers();
      },
      error: () => {
        this.alertService.show('Failed to upload images', 'error');
        this.navigateToOffers();
      },
    });
  }

  private navigateToOffers(): void {
    this.router.navigate(['/profile/my-rent-offers']);
  }

  selectCar(carId: string): void {
    this.createForm.patchValue({ carId });
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
