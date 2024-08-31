import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../Services/auth.service';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-forget-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, AppComponent],
  templateUrl: './forget-password.component.html',
  styleUrls: ['./forget-password.component.css']  // Note: styleUrls instead of styleUrl
})
export class ForgetPasswordComponent implements OnInit {

  message : string
  snackbarClass : string
  signInImage = 'assets/images/signin.jpg';

  forgetPasswordForm: FormGroup;
  http : HttpClient = inject(HttpClient);

  authService : AuthService = inject(AuthService);

  resetPasswordUrl = "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key="

  webApi = "AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM";
  constructor(private fb: FormBuilder, private appComponent : AppComponent) { }

  ngOnInit(): void {
    this.forgetPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmitForgotPassword(): void {
    if (this.forgetPasswordForm.valid) {
      console.log(this.forgetPasswordForm.value);
      this.http.post(this.resetPasswordUrl + this.webApi, {
        requestType: 'PASSWORD_RESET',
        email: this.forgetPasswordForm.value.email
      }).subscribe((response) => {
        next : (response) => {
          this.appComponent.showAlert('Password reset email sent successfully !!', 'alert-success')
        }
        error: (error) => {
          this.appComponent.showAlert(`Error sending password reset email ${error.message}`, 'alert-danger')
        }
      });

      this.forgetPasswordForm.reset();
      this.authService.router.navigate(['/login']);
    }
     else {
      console.log('Form is invalid');
    }
  }

  
}
