import { Component } from '@angular/core';
import {UserHeaderComponent} from './components/user-header/user-header.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-user-layout',
  standalone: true,
  imports: [
    UserHeaderComponent,
    RouterOutlet
  ],
  templateUrl: './user-layout.component.html',
  styleUrl: './user-layout.component.css'
})
export class UserLayoutComponent {

}
