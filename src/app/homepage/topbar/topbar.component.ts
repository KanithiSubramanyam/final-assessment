import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import { SnackbarComponent } from '../../snackbar/snackbar.component';

@Component({
  selector: 'app-topbar',
  standalone: true,
  imports: [CommonModule,RouterLink, SnackbarComponent],
  templateUrl: './topbar.component.html',
  styleUrl: './topbar.component.css'
})
export class TopbarComponent {
  profile = "assets/images/profile.jpg";
  isProfileMenuOpen = false;
  authService: AuthService = inject(AuthService)
  message: string
  snackbarClass: string

  toggleProfileMenu() {
    this.isProfileMenuOpen = !this.isProfileMenuOpen;
  }

  closeProfileMenu() {
      this.isProfileMenuOpen = false;
  }
  logout(){
    this.message = 'Logout Successful';
    this.snackbarClass = 'alert-success';
    setTimeout(() => {
      this.message = '';
      this.snackbarClass = '';
    }, 3000);
    this.authService.logOut(null);
  }
}
