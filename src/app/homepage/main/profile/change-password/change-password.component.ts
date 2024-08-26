import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'change-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  showChangePasswordForm = false; 
  changePasswordForm:FormGroup;

  authService:AuthService = inject(AuthService)

  constructor(private fb: FormBuilder){
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
        alert('New password and confirm password do not match.');
        return;
      }

      const userString = localStorage.getItem('localUser');
      if (userString) {
        const user = JSON.parse(userString);
        const idToken = user._token;
        const userId = user.id;

        if (idToken) {
          this.authService.changePassword(idToken, newPassword, userId).subscribe({
            next: (response) => {
              console.log('Password changed successfully:', response);
              this.showChangePasswordForm = false;
              this.changePasswordForm.reset();
            },
            error: (error) => {
              console.error('Error changing password:', error);
              this.showChangePasswordForm = false;
              this.changePasswordForm.reset();
            },
          });
        }
      }
    }
  }
}
