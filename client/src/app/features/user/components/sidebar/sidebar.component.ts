import {Component, inject, OnInit} from '@angular/core';
import {AuthService} from '../../../auth/services/auth.service';
import {AlertService} from '../../../../core/services/alert.service';
import {UserService} from '../../services/user.service';
import {UserDTO} from '../../dtos/user.dto';
import {RouterLink, RouterLinkActive} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    RouterLink,
    NgIf,
    RouterLinkActive
  ],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly alertService = inject(AlertService);
  private readonly userService = inject(UserService);

  user!: UserDTO;

  ngOnInit(): void {
    this.loadUserData();
  }

  private loadUserData(): void {
    const userId = this.authService.getUserId();
    if (userId) {
      this.userService.getUserById(userId).subscribe({
        next: (user) => {
          this.user = user;
        },
        error: (error) => {
          this.alertService.show('Error loading user data', 'error');
        }
      });
    }
  }
}
