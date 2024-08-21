import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../Model/User';




@Component({
  selector: 'login',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  isLoginMode: boolean = true; 


  // Login Form Controls
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

  // Signup Form Controls
  signupForm = new FormGroup({
    firstName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    lastName: new FormControl('', [Validators.required, Validators.minLength(2)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)])
  });

 

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit() {
    if (this.isLoginMode) {
      if (this.loginForm.valid) {
        console.log('Login data', this.loginForm.value);
        alert('Login successful');
      }
    } else {
      if (this.signupForm.valid) {
         // Create a User object with the form values
         const user = new User(
          this.signupForm.value.firstName,
          this.signupForm.value.lastName,
          this.signupForm.value.email,
          this.signupForm.value.password
        );
        console.log('Sign up data', this.signupForm.value);
        // Log the User object to the console
        console.log('Sign up data', user);
        alert('Sign up successful');
      }
    }
    this.loginForm.reset({
      email:'',
      password:'',

    });
    this.signupForm.reset({
      firstName:'',
      lastName:'',
      email:'',
      password:'',

    });
  }

}
