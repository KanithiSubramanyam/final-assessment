import { Component, inject, OnInit } from '@angular/core';
import { FormGroup, Validators, ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../Model/User';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { passwordValidator } from '../Validators/passwordValidator';
import { emailDomainValidator } from '../Validators/emailValidators';
import { AuthResponse } from '../Model/AuthResponse';
import { Observable } from 'rxjs';
import { Router, RouterLink } from '@angular/router';
import { ProfileComponent } from '../homepage/main/profile/profile.component';
import { VerifyOtpComponent } from "./verify-otp/verify-otp.component";

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule, RouterLink, VerifyOtpComponent],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  isLoginMode: boolean = true;

  client: HttpClient = inject(HttpClient);

  authService: AuthService = inject(AuthService);

  loginForm: FormGroup;

  signupForm: FormGroup;

  authObs: Observable<AuthResponse>;

  router: Router = inject(Router);

  errorMessage: string | null = null;

  secretKey : string = '';

  mfaEnabledBtn: boolean = false;


  constructor(private fb: FormBuilder) {
    this.createForms();
  }

  ngOnInit() {
    // this.authService.notifyPasswordExpiration();
  }

  createForms() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });

    this.signupForm = this.fb.group({
      firstName: ['', [Validators.required, Validators.minLength(2)]],
      lastName: ['', [Validators.required, Validators.minLength(2)]],
      email: ['', [
        Validators.required,
        Validators.email,
        emailDomainValidator(['gmail.com', 'company.com'])
      ]],
      password: ['', [Validators.required, Validators.minLength(8), passwordValidator]]
    });
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {

        this.authObs = this.authService.logIn(this.loginForm.value.email, this.loginForm.value.password);
        
      }
    } else {
      if (this.signupForm.valid) {

          // /**
          //  * Enables TOTP (Time-based One-Time Password) multi-factor authentication (MFA) for the user.
          //  *
          //  * This method subscribes to the `enableTotpMfa()` observable provided by the `authService`. If the operation is successful, it logs a success message to the console. If there is an error, it logs the error message to the console.
          //  */
          // this.authService.enableTotpMfa().subscribe(
          //   (response) => {
          //     console.log('TOTP MFA enabled successfully');
          //   },
          //   (error) => {
          //     console.error('Error enabling TOTP MFA:', error);
          //   }
          // );
        
        const user = {
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
        };

        this.authObs = this.authService.signUp(user);
      }
    }

    this.authObs.subscribe({
      next: (res) => {
        if(this.isLoginMode){
          console.log(res.localId);
          this.authService.getUserProfile(res.localId).subscribe(userData => {
            // console.log(userData);
            this.secretKey = userData.mfaSecertKey;
            this.mfaEnabledBtn = userData.mfaBtn;
    
            if(this.mfaEnabledBtn){
              this.router.navigate(['/login/verifyOTP'], { state: { secretKey: this.secretKey } });
            } else {
              this.router.navigate(['/dashboard']);
            }
          });
        } 
        else {
          this.isLoginMode = true;
          this.router.navigate(['/login']);
        }
      },
      error: (errMsg) => {
        this.errorMessage = errMsg;
      }
    });
    

    this.loginForm.reset();

    this.signupForm.reset();
  }
}
