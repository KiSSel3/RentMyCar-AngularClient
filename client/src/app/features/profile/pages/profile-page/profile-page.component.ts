import { Component } from '@angular/core';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {RouterOutlet} from '@angular/router';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [
    SidebarComponent,
    RouterOutlet
  ],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {

}
