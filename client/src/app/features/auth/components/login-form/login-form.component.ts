import {Component, EventEmitter, inject, Output} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FormBuilder, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {finalize} from 'rxjs';
import {LoginRequest} from '../../models/login.request';
import {AlertService} from '../../../../core/services/alert.service';
import {HttpErrorResponse} from '@angular/common/http';

@Component({
  selector: 'app-login-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  isLoading = false;

  loginForm = this.fb.group({
    userName: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  @Output() switchToRegister = new EventEmitter<void>();
  onSwitchToRegister(): void {
    this.switchToRegister.emit();
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.isLoading = true;

      this.authService.login(this.loginForm.value as LoginRequest)
        .pipe(
          finalize(() => this.isLoading = false)
        )
        .subscribe({
          next: () => {
            this.alertService.show('Successfully logged in!', 'success');
            this.router.navigate(['/']);
          },
          error: (error) => {
            console.error('Login failed:', error);

            if (error.error?.errors) {
              const validationMessages = Object.keys(error.error.errors)
                .map(key => error.error.errors[key][0]);

              this.alertService.show(validationMessages[0], 'error');
            } else {
              this.alertService.show(
                error.error?.error || error.error?.message || 'An error occurred during login',
                'error'
              );
            }
          }
        });
    } else {
      Object.keys(this.loginForm.controls).forEach(key => {
        const control = this.loginForm.get(key);
        if (control) {
          control.markAsTouched();
        }
      });
    }
  }
}
