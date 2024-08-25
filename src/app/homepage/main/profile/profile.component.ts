import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/userService.service';
import { User } from '../../../Model/User';
import { ChangePasswordComponent } from "./change-password/change-password.component";

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChangePasswordComponent],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = "assets/images/profile.jpg";

  userForm!: FormGroup;

  userService : UserService = inject(UserService);

  userData : any;

  constructor(private fb: FormBuilder) {
    this.userForm = this.fb.group({
      username: [{ value: 'JohnDoe', disabled: true }],  
      firstName: [{ value: 'John', disabled: true }, Validators.required],
      lastName: [{ value: 'Doe', disabled: true }, Validators.required],
      email: [{ value: 'john.doe@example.com', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: 'user', disabled: true }, Validators.required],
      phone: ['', Validators.required],  
      gender: [{ value: 'Male'}, Validators.required],
      address: ['123 Main St, Anytown, USA', Validators.required]  
    });

     this.userService.getCurrentUser().subscribe(
      {
        next: (data: User) => {
          this.userData = data;
          this.userForm.patchValue({
            username: this.userData.firstName + ' ' + this.userData.lastName,
            firstName: this.userData.firstName,
            lastName: this.userData.lastName,
            email: this.userData.email,
            role: this.userData.role,
            phone: this.userData.phone,
            gender: this.userData.gender,
            address: this.userData.address
          });
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      }
    );
    
  }
  
  onSubmit() {
    if (this.userForm.valid) {
      const updatedData = {
        phone: this.userForm.get('phone')?.value,
        gender: this.userForm.get('gender')?.value,
        address: this.userForm.get('address')?.value
      };
  
      this.userService.updateUserDetails(updatedData).subscribe(
        response => {
          // console.log('User details updated successfully:', response);
        },
        error => {
          console.error('Error updating user details:', error);
        }
      );
    }
  }
}
