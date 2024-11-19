import {Component, inject} from '@angular/core';
import {AuthService} from '../../../../features/auth/services/auth.service';
import {CommonModule} from '@angular/common';
import {Router, RouterLink, RouterLinkActive} from '@angular/router';
import {AlertService} from '../../../../core/services/alert.service';
import {catchError, throwError} from 'rxjs';

@Component({
  selector: 'app-user-header',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive],
  templateUrl: './user-header.component.html',
  styleUrl: './user-header.component.css'
})
export class UserHeaderComponent {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly router = inject(Router);

  isAuthenticated$ = this.authService.isAuthenticated$;

  login(): void {
    this.router.navigate(['/auth']);
  }

  logout(): void {
    this.authService.logout()
      .pipe(
        catchError(error => {
          this.alertService.show('Failed to log out', 'error');
          return throwError(() => error);
        })
      )
      .subscribe({
        next: () => {
          this.alertService.show('Successfully logged out', 'success');
          this.router.navigate(['/']);
        }
      });
  }
}
