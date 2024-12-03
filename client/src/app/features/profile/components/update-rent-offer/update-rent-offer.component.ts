import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RentOfferManagementService } from '../../services/rent-offer-management.service';
import { AlertService } from '../../../../core/services/alert.service';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule, NgIf } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {MatCheckbox} from '@angular/material/checkbox';
import {RentOfferService} from '../../../../core/services/rent-offer.service';
import {RentOfferDetailDTO} from '../../../../core/data/dtos/responses/rent-offer-detail.dto';
import {MatIcon} from '@angular/material/icon';
import {CarCardComponent} from '../../../../shared/components/car-card/car-card.component';
import {CarService} from '../../../../core/services/car.service';
import {CarDTO} from '../../../../core/data/dtos/responses/car.dto';

@Component({
  selector: 'app-update-rent-offer',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatDatepickerModule,
    NgIf,
    MatCheckbox,
    MatIcon,
    CarCardComponent,
  ],
  templateUrl: './update-rent-offer.component.html',
  styleUrls: ['./update-rent-offer.component.css'],
})
export class UpdateRentOfferComponent implements OnInit {
  private readonly rentOfferManagementService = inject(RentOfferManagementService);
  private readonly rentOfferService = inject(RentOfferService);
  private readonly carService = inject(CarService);
  private readonly alertService = inject(AlertService);
  private readonly route = inject(ActivatedRoute);
  private readonly fb = inject(FormBuilder);
  private readonly router = inject(Router);

  cars: CarDTO[] = [];
  editForm!: FormGroup;
  isLoading = true;
  rentOffer!: RentOfferDetailDTO;

  existingImages: { id: string; image: string }[] = [];
  newImages: { file: File; previewUrl: string }[] = [];

  ngOnInit(): void {
    const offerId = this.route.snapshot.paramMap.get('id');
    if (offerId) {
      this.loadRentOffer(offerId);
      this.loadCars();
    }
  }

  private loadRentOffer(id: string): void {
    this.isLoading = true;
    this.rentOfferService.getRentOfferDetailsById(id).subscribe({
      next: (rentOffer) => {
        this.rentOffer = rentOffer;
        this.existingImages = rentOffer.images;
        this.initForm();
        this.isLoading = false;
      },
      error: () => {
        this.alertService.show('Failed to load rent offer', 'error');
        this.isLoading = false;
      },
    });
  }

  private loadCars(): void {
    this.carService.getCarsByParameters({ pageNumber: 1, pageSize: 50 }).subscribe({
      next: (response) => {
        this.cars = response.collection;
      },
      error: () => {
        this.alertService.show('Failed to load cars', 'error');
      },
    });
  }

  private initForm(): void {
    this.editForm = this.fb.group({
      carId: [this.rentOffer.carId, Validators.required],
      locationModel: this.fb.group({
        city: [this.rentOffer.location.city, Validators.required],
        street: [this.rentOffer.location.street, Validators.required],
        building: [this.rentOffer.location.building, Validators.required],
      }),
      availableFrom: [this.rentOffer.availableFrom, Validators.required],
      availableTo: [this.rentOffer.availableTo, Validators.required],
      pricePerDay: [this.rentOffer.pricePerDay, [Validators.required, Validators.min(0)]],
      description: [this.rentOffer.description, Validators.required],
      isAvailable: [this.rentOffer.isAvailable, Validators.required],
    });
  }

  submit(): void {
    if (this.editForm.valid) {
      const updatedOffer = { ...this.editForm.value };
      this.rentOfferManagementService.updateRentOffer(this.rentOffer.id, updatedOffer).subscribe({
        next: () => {
          this.alertService.show('Rent offer updated successfully!', 'success');
          this.uploadNewImages();
        },
        error: () => {
          this.alertService.show('Failed to update rent offer', 'error');
        },
      });
    }
  }

  private uploadNewImages(): void {
    if (this.newImages.length > 0) {
      const formData = new FormData();
      this.newImages.forEach((img) => formData.append('images', img.file));
      this.rentOfferManagementService.addImagesToRentOffer(this.rentOffer.id, formData).subscribe({
        next: () => {
          this.alertService.show('Images uploaded successfully!', 'success');
          this.router.navigate(['/profile/my-rent-offers']);
        },
        error: () => {
          this.alertService.show('Failed to upload images', 'error');
        },
      });
    } else {
      this.router.navigate(['/profile/my-rent-offers']);
    }
  }

  removeImage(index: number, imageId: string): void {
    this.rentOfferManagementService.removeImagesFromRentOffer(this.rentOffer.id, { imageIds: [imageId] }).subscribe({
      next: () => {
        this.alertService.show('Image removed successfully!', 'success');
        this.existingImages.splice(index, 1);
      },
      error: () => {
        this.alertService.show('Failed to remove image', 'error');
      },
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      Array.from(input.files).forEach((file) => {
        const reader = new FileReader();
        reader.onload = () => {
          this.newImages.push({ file, previewUrl: reader.result as string });
        };
        reader.readAsDataURL(file);
      });
    }
  }

  deleteRentOffer(): void {
    if (confirm('Are you sure you want to delete this rent offer?')) {
      this.rentOfferManagementService.deleteRentOffer(this.rentOffer.id).subscribe({
        next: () => {
          this.alertService.show('Rent offer deleted successfully!', 'success');
          this.router.navigate(['/profile/my-rent-offers']);
        },
        error: () => {
          this.alertService.show('Failed to delete rent offer', 'error');
        },
      });
    }
  }


  removeNewImage(index: number): void {
    this.newImages.splice(index, 1);
  }

  selectCar(carId: string): void {
    this.editForm.patchValue({ carId });
  }

  autoResize(event: Event): void {
    const textarea = event.target as HTMLTextAreaElement;
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
  }
}
