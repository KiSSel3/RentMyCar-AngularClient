import { Component } from '@angular/core';
import {LoginFormComponent} from '../../components/login-form/login-form.component';
import {RegisterFormComponent} from '../../components/register-form/register-form.component';
import {MatTabsModule} from '@angular/material/tabs';
import {RouterModule} from '@angular/router';
import {CommonModule} from '@angular/common';
import {MatButton} from '@angular/material/button';

@Component({
  selector: 'app-auth-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatTabsModule,
    LoginFormComponent,
    RegisterFormComponent,
    MatButton
  ],
  templateUrl: './auth-page.component.html',
  styleUrl: './auth-page.component.css'
})
export class AuthPageComponent {
  isRegistrationMode = false;

  switchToRegister(): void {
    this.isRegistrationMode = true;
  }

  switchToLogin(): void {
    this.isRegistrationMode = false;
  }
}
