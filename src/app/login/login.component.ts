import { Component, inject } from '@angular/core';
import { FormControl, FormGroup, Validators,ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../Model/User';
import { HttpClient, HttpClientModule } from '@angular/common/http';




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
        // console.log('Login data', this.loginForm.value);
        // alert('Login successful');
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
        alert('Sign up successful');
        this.client.post('https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json',user).subscribe((response)=>{
          console.log(response);

        })
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

   // Verify login credentials with Firebase
   verifyLogin(email: string, password: string) {
    this.client.get<{ [key: string]: User }>('https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json')
      .subscribe(users => {
        let userFound = false;
        for (let key in users) {
          const user = users[key];
          if (user.email === email && user.password === password) {
            console.log('Login successful', user);
            alert('Login successful');
            userFound = true;
            break;
          }
        }
        if (!userFound) {
          alert('Invalid email or password');
        }
      });
  }

}
