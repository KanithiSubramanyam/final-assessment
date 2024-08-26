import { Component, Input } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../Services/auth.service';
import * as jsotp from 'jsotp';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-otp.component.html',
  styleUrl: './verify-otp.component.css'
})
export class VerifyOtpComponent {

  otpForm: FormGroup;

  isMfaValid: boolean = false;
  errorMessage: string

  secretKey: string | undefined;


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
      this.errorMessage = 'Otp is not valid/ expired';
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
      console.error('Invalid code!');
      return false;
    }
  }

}