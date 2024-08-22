import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../Model/User';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { AuthService } from '../Services/auth.service';
import { Observable } from 'rxjs';
import { passwordValidator } from '../Validators/passwordValidator';
import { emailDomainValidator } from '../Validators/emailValidators';

@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,HttpClientModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoginMode: boolean = true; 
  
  client : HttpClient = inject(HttpClient);

  authService : AuthService = inject(AuthService);

  // Login Form Controls
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Signup Form Controls
  signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [
      Validators.required, 
      Validators.email,
      emailDomainValidator(['example.com', 'company.com']) // Allowed domains
    ]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), passwordValidator])
  });

  ngOnInit(){
    this.authService.notifyPasswordExpiration();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }


  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        this.authService.logIn(this.loginForm.value.email, this.loginForm.value.password);
      }
    }
    else {
      if (this.signupForm.valid) {
        const user = new User(
          this.signupForm.value.firstName,
          this.signupForm.value.lastName,
          this.signupForm.value.email,
          this.signupForm.value.password
        );

        this.authService.signUp(user);
        this.isLoginMode = true;
      }
    }

    this.loginForm.reset({
      email: '',
      password: '',
    });

    this.signupForm.reset({
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    });
  }
}
