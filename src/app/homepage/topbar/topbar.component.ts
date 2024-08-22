import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  profile = "assets/images/profile.jpg";
  isProfileMenuOpen = false;
  authService: AuthService = inject(AuthService)

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
      this.isProfileMenuOpen = false;
      this.authService.logOut();
  }

}
