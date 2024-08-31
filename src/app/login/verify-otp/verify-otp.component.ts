import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import * as jsotp from 'jsotp';
import { SnackbarComponent } from '../../snackbar/snackbar.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule, SnackbarComponent, RouterLink, CommonModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {

  otpForm: FormGroup;
  signInImage = 'assets/images/signin.jpg';
  isMfaValid: boolean = false;
  errorMessage: string
  secretKey: string | undefined;

  message: string
  snackbarClass: string


  constructor(private fb: FormBuilder, private router: Router,
    private authService: AuthService, private route: ActivatedRoute) {
    this.otpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6)]]
    });

    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.secretKey = navigation.extras.state['secretKey'];
    }
  }

  onSubmit() {
    let otp = this.otpForm.value.otp;
    this.isMfaValid = this.validateCode(otp, this.secretKey);
    
    if (this.isMfaValid) {

      this.router.navigate(['/dashboard']);
    }
    else {
      this.message = 'Otp is not valid/ expired !!';
      this.snackbarClass = 'alert-danger';
      setTimeout(() => {
        this.message = '';
        this.snackbarClass = '';
      }, 3000);
    }

  }
  validateCode(userCode: string, secretKey: string) {
    const totp = jsotp.TOTP(secretKey);
    const isValid = totp.verify(userCode);

    console.log('Is Valid:', isValid);
    if (isValid) {
      console.log('Code is valid!');
      return true;
    } else {
      this.message = 'Otp is not correct !!';
      this.snackbarClass = 'alert-danger';
      setTimeout(() => {
        this.message = '';
        this.snackbarClass = '';
      }, 3000);
      return false;
    }
  }

}