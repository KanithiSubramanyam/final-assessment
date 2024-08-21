import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = "assets/images/profile.jpg";
  showChangePasswordForm = false; 
  userForm!: FormGroup;
  changePasswordForm:FormGroup;
  

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: [{ value: 'JohnDoe', disabled: true }],  
      firstName: [{ value: 'John', disabled: true }, Validators.required],
      lastName: [{ value: 'Doe', disabled: true }, Validators.required],
      email: [{ value: 'john.doe@example.com', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: 'user', disabled: true }, Validators.required],
      phoneNumber: ['123-456-7890', Validators.required],  
      gender: [{ value: 'Male'}, Validators.required],
      address: ['123 Main St, Anytown, USA', Validators.required]  
    });

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
      // Logic to handle password change
      console.log('Password change submitted', this.changePasswordForm.value);
    }
  }

  cancelChangePassword() {
    this.showChangePasswordForm = false;
    this.changePasswordForm.reset();
  }

  onSubmit() {
    if (this.userForm.valid) {
      console.log('Form Submitted', this.userForm.getRawValue());  // Get full form value including disabled fields
      // Logic for updating user profile
    }
  }
}
