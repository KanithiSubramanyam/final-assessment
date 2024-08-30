import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/userService.service';
import { User } from '../../../Model/User';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { userDetails } from '../../../Model/userDetails';
import { QrCodeModule } from 'ng-qrcode';
import { AuthService } from '../../../Services/auth.service';
import { SnackbarComponent } from '../../../snackbar/snackbar.component';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SnackbarComponent, ChangePasswordComponent, RouterLink, QrCodeModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  profile = "assets/images/profile.jpg";
  userForm!: FormGroup;
  userService: UserService = inject(UserService);
  userData: any;
  isReadOnly: boolean = true;
  isMfaEnabledBtn: boolean = false;
  mfaCloseBtn: boolean = false;
  backToUser: boolean = false;
  qrdata: string = '';
  enableOrDisableBtn: boolean;
  isAdmin: boolean = false; // Track if the logged-in user is an admin
  isEditingOtherUser: boolean = false; // Track if the admin is editing another user
  roleOptions: { value: string, label: string }[] = [];
<<<<<<< HEAD
  profileImageUrl: string | ArrayBuffer | null = null;

=======
  message: string = '';
  snackbarClass: string = '';
>>>>>>> 93fd32b7ea1e16eebcd20e756c3f002e70e34cd0

  constructor(
    private fb: FormBuilder, 
    private route: ActivatedRoute, 
    private router: Router, 
    private authService: AuthService
  ) {
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

    // Fetch current user data
    this.userService.getCurrentUser().subscribe(
      {
        next: (data) => {
          this.userData = data;
          this.userForm.patchValue(this.userData);
          this.isAdmin = this.userData.role === 'admin';
          this.enableOrDisableBtn = this.userData.mfaBtn;
           // Set role options based on user role and edit mode
           this.setRoleOptions();

        },
        error: (error) => {
          // console.error('Error fetching user data:', error);
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
              this.profileImageUrl=this.userData.photoUrl;
               // Ensure the role is set correctly in the form
            this.userForm.get('role')?.setValue(this.userData.role);

              if (this.router.url.includes('/userManagement/users/editProfile')
                || this.router.url.includes('/userManagement/users/viewProfile')) {
                this.backToUser = true;
                if (this.isAdmin && userId !== this.userData.id.toString()) {
                  // If admin is editing another user's profile, enable the role field
                  this.isEditingOtherUser = true;
                  this.userForm.get('role')?.enable();
                  this.setRoleOptions();
                }
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

  private setRoleOptions() {
    if (this.isEditingOtherUser) {
      this.roleOptions = [
        { value: 'user', label: 'User' },
        { value: 'accountManager', label: 'Account Manager' }
      ];
    } else {
      this.roleOptions = [
        { value: 'admin', label: 'Admin' },
      { value: 'accountManager', label: 'Account Manager' },
      { value: 'user', label: 'User' }
      ];
    }
  }

  closeMFA() {
    this.mfaCloseBtn = false;
  }

  enableMfa() {
    this.mfaCloseBtn = true;
    this.isMfaEnabledBtn = true;
    const qrCodeSecret = this.generateBase32Secret();
    const userData = sessionStorage.getItem('localUser');
    const uid = userData ? JSON.parse(userData).id : '';
    const email = userData ? JSON.parse(userData).email : '';
    const issuer = 'final-assessment-1';

    this.message = 'MFA Enabled !!';
    this.snackbarClass = 'alert-success';
    setTimeout(() => {
      this.message = '';
      this.snackbarClass = '';
    }, 3000);

    this.authService.isMfaEnabled(this.isMfaEnabledBtn, uid, qrCodeSecret);

    // Generate the QR code data URL
    this.qrdata = this.authService.generateMsAuthenticatoQrCode(qrCodeSecret, email, issuer);

    // Update button state to Disable
    this.enableOrDisableBtn = true;
  }

  disableMfa() {
    this.isMfaEnabledBtn = false;
    const userData = sessionStorage.getItem('localUser');
    const uid = userData ? JSON.parse(userData).id : '';
    this.authService.getUserProfile(uid).subscribe(userData => {
      userData.mfaBtn = false;
      userData.mfaSecertKey = '';
      this.authService.updateUserProfile(uid, userData).subscribe();
    });
    this.enableOrDisableBtn = false;
    this.mfaCloseBtn = false;
    this.message = 'MFA Disabled!!';
    this.snackbarClass = 'alert-Warning';
    setTimeout(() => {
      this.message = '';
      this.snackbarClass = '';
    }, 3000);
  }

  // Generate a random base32 secret
  generateBase32Secret(length: number = 16): string {
    const base32Chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567';
    let secret = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * base32Chars.length);
      secret += base32Chars[randomIndex];
    }
    return secret;
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
          this.message = 'User Profile data is updated!!';
          this.snackbarClass = 'alert-success';
          setTimeout(() => {
            this.message = '';
            this.snackbarClass = '';
          }, 3000);
        },
        error => {
          this.message = 'Error updating user details:', error;
          this.snackbarClass = 'alert-success';
          setTimeout(() => {
            this.message = '';
            this.snackbarClass = '';
          }, 3000);
          console.error('Error updating user details:', error);
        }
      );
    }
  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = e => this.profileImageUrl = reader.result;
      reader.readAsDataURL(file);

      // this.userService.updateUserImage(file).subscribe({
      //   next: () => console.log('User image updated successfully'),
      //   error: (err) => console.error('Error updating user image:', err)
      // });
    }
  }

  onSaveProfile(): void {
    const updatedData = this.userForm.getRawValue();
    this.userService.updateUserDetails(updatedData).subscribe({
      next: () => console.log('User details updated successfully'),
      error: (err) => console.error('Error updating user details:', err)
    });
  }
}
