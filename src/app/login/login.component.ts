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
import { Router } from '@angular/router';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule],
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

  constructor(private fb: FormBuilder) {
    this.createForms();
  }

  ngOnInit() {
    this.authService.notifyPasswordExpiration();
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
        // console.log('login component', this.loginForm.value);
        this.authObs = this.authService.logIn(this.loginForm.value.email, this.loginForm.value.password);
        
      }
    } else {
      if (this.signupForm.valid) {
        const user: User = {
          id: '',
          firstName: this.signupForm.value.firstName,
          lastName: this.signupForm.value.lastName,
          email: this.signupForm.value.email,
          password: this.signupForm.value.password,
          address: '',
          gender: '',
          phone: '',
          photoURL: '',
          emailVerified: false,
          role: 'user',
          createdAt: new Date(),
          lastLoginAt: new Date(),
          token: '',
          passwordLastChangedAt: new Date(),
          expiresIn: new Date()
        };

        this.authObs = this.authService.signUp(user);
        // this.isLoginMode = true;
        // this.authService.signUp(user).subscribe({
        //   next:(res)=>{console.log(res)},
        //   error:(err)=>{console.log(err)}
        // })
      }
    }

    this.authObs.subscribe({
      next: (res) => {
        // console.log(res.idToken);
        // console.log(res)
        this.router.navigate(['/dashboard']);
      },
      error: (errMsg) => {

        this.errorMessage = errMsg;
      }
    })

    this.loginForm.reset();

    this.signupForm.reset();
  }
}
