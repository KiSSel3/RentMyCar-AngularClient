import {Component, inject, OnInit} from '@angular/core';
import {BrandDTO} from '../../../../core/data/dtos/responses/brand.dto';
import {BrandService} from '../../../../core/services/brand.service';
import {NgForOf, NgIf} from '@angular/common';
import {CreateBrandFormComponent} from '../create-brand-form/create-brand-form.component';
import {MatDialog} from '@angular/material/dialog';
import {BrandManagementService} from '../../services/brand-management.service';
import {UpdateBrandFormComponent} from '../update-brand-form/update-brand-form.component';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.css'
})
export class BrandsComponent implements OnInit {
  private readonly brandService = inject(BrandService);
  private readonly brandManagementService = inject(BrandManagementService);
  private readonly dialog = inject(MatDialog);

  brands: BrandDTO[] = [];

  ngOnInit(): void {
    this.loadBrands();
  }

  loadBrands(): void {
    this.brandService.getAllBrands().subscribe({
      next: (data) => {
        this.brands = data;
      },
      error: (err) => {
        console.error('Failed to load brands:', err);
      }
    });
  }

  createBrand(): void {
    const dialogRef = this.dialog.open(CreateBrandFormComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadBrands();
      }
    });
  }

  editBrand(id: string): void {
    const brandToEdit = this.brands.find((brand) => brand.id === id);

    if (brandToEdit) {
      const dialogRef = this.dialog.open(UpdateBrandFormComponent, {
        width: '400px',
        data: { id: brandToEdit.id, name: brandToEdit.name }
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          this.loadBrands();
        }
      });
    }
  }

  deleteBrand(id: string): void {
    if (confirm('Are you sure you want to delete this brand?')) {
      this.brandManagementService.deleteBrand(id).subscribe({
        next: () => {
          this.loadBrands();
        },
        error: (err) => {
          console.error('Failed to delete brand:', err);
        }
      });
    }
  }
}
