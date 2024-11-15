import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthService} from '../../services/auth.service';
import {CommonModule, NgIf} from '@angular/common';
import {LoginRequest} from '../../models/login.request';
import {finalize} from 'rxjs';
import {RegisterRequest} from '../../models/register.request';

@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isLoading = false;

  registerForm = this.fb.group({
    firstName: ['', [Validators.required]],
    lastName: ['', [Validators.required]],
    userName: ['', [Validators.required]],
    email: ['', [Validators.required, Validators.email]],
    phoneNumber: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  @Output() switchToLogin = new EventEmitter<void>();
  onSwitchToLogin(): void {
    this.switchToLogin.emit();
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      this.isLoading = true;

      this.authService.register(this.registerForm.value as RegisterRequest)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Register failed:', error);
          }
        });
    } else {
      Object.keys(this.registerForm.controls).forEach(key => {
        const control = this.registerForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
