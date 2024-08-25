import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/userService.service';
import { User } from '../../../Model/User';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { userDetails } from '../../../Model/userDetails';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChangePasswordComponent, RouterLink],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = "assets/images/profile.jpg";

  userForm!: FormGroup;

  userService: UserService = inject(UserService);

  userData: any;

  isReadOnly: boolean = true;
  backToUser: boolean = false;


  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.userForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      firstName: [{ value: '', disabled: true }, Validators.required],
      lastName: [{ value: '', disabled: true }, Validators.required],
      email: [{ value: '', disabled: true }, [Validators.required, Validators.email]],
      role: [{ value: '', disabled: true }, Validators.required],
      phone: ['', Validators.required],
      gender: [{ value: '' }, Validators.required],
      address: ['', Validators.required]
    });

    this.userService.getCurrentUser().subscribe(
      {
        next: (data: User) => {
          this.userData = data;
          this.userForm.patchValue(this.userData);
        },
        error: (error) => {
          console.error('Error fetching user data:', error);
        }
      }
    );
  }

  ngOnInit(): void {
    if (this.route.snapshot && this.route.snapshot.paramMap) {
      const userId: string | null = this.route.snapshot.paramMap.get('id');

      if (userId) {
        this.userService.getUserById(parseInt(userId)).subscribe(
          {
            next: (data: userDetails) => {
              this.userData = data;
              this.userForm.patchValue(this.userData);
              
              if (this.router.url.includes('/userManagement/users/editProfile') 
                || this.router.url.includes('/userManagement/users/viewProfile')) {
                this.backToUser = true;
              }

              if (this.router.url.includes('/userManagement/users/viewProfile')) {
                this.isReadOnly = false;
                this.userForm.disable();
              }

            },
            error: (error) => {
              console.error('Error fetching user data:', error);
            }
          }
        );
      }
    } else {
      console.error('ActivatedRoute is not available');
    }
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
