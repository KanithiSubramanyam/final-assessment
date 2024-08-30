import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../Services/auth.service';
import { SnackbarComponent } from '../../../../snackbar/snackbar.component';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SnackbarComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  showChangePasswordForm = false;
  changePasswordForm: FormGroup;

  authService: AuthService = inject(AuthService)
  message: string
  snackbarClass: string


  constructor(private fb: FormBuilder) {
    this.changePasswordForm = this.fb.group({
      oldPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    });
  }
  onChangePassword() {
    this.showChangePasswordForm = !this.showChangePasswordForm;
  }


  onChangePasswordSubmit() {
    if (this.changePasswordForm.valid) {
      const newPassword = this.changePasswordForm.get('newPassword')?.value;
      const confirmPassword = this.changePasswordForm.get('confirmPassword')?.value;

      if (newPassword !== confirmPassword) {
        this.message = 'New password and confirm password do not match.';
        this.snackbarClass = 'alert-warning';
        setTimeout(() => {
          this.message = '';
          this.snackbarClass = '';
        }, 3000);
        return;
      }

      const userString = sessionStorage.getItem('localUser');
      if (userString) {
        const user = JSON.parse(userString);
        const idToken = user._token;
        const userId = user.id;
        console.log(user);
        if (idToken) {
          this.authService.changePassword(idToken, newPassword, userId).subscribe({
            next: (response) => {
              this.message = 'Password changed sucessfully';
              this.snackbarClass = 'alert-sucess';
              setTimeout(() => {
                this.message = '';
                this.snackbarClass = '';
              }, 3000);
              this.showChangePasswordForm = false;
              this.changePasswordForm.reset();
            },
            error: (error) => {
              this.message = 'Error changing password:', error;
              this.snackbarClass = 'alert-warning';
              setTimeout(() => {
                this.message = '';
                this.snackbarClass = '';
              }, 3000);
              this.showChangePasswordForm = false;
              this.changePasswordForm.reset();
            },
          });
        }
      }
    }
  }
}
