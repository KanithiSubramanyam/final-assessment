import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../Services/userService.service';
import { User } from '../../../Model/User';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { userDetails } from '../../../Model/userDetails';
import { QrCodeModule } from 'ng-qrcode';

import * as jsotp from 'jsotp';

import { AuthService } from '../../../Services/auth.service';
@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, ChangePasswordComponent, RouterLink, QrCodeModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent {
  profile = "assets/images/profile.jpg";

  userForm!: FormGroup;

  userService: UserService = inject(UserService);

  userData: any;

  isReadOnly: boolean = true;

  isMfaEnabledBtn: boolean = false;

  mfaCloseBtn: boolean = false;

  backToUser: boolean = false;

  qrdata: string = '';

  constructor(private fb: FormBuilder, private route: ActivatedRoute, private router: Router, private authService: AuthService) {
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

  closeMFA() {
    this.mfaCloseBtn = false;
  }

  secertKeyyyy = '';
  enableMfa() {
    //  = true;
    this.mfaCloseBtn = true;

    const qrCodeSecret = this.generateBase32Secret();
    const userData = localStorage.getItem('localUser');
    const uid = userData ? JSON.parse(userData).id : '';
    const email = userData ? JSON.parse(userData).email : '';
    const issuer = 'final-assessment-1';
    this.secertKeyyyy = qrCodeSecret;
    // Enable MFA in the backend
    console.log(this.secertKeyyyy);
    this.isMfaEnabledBtn = this.authService.isMfaEnabled(this.isMfaEnabledBtn, uid, qrCodeSecret);

    // Generate the QR code data URL
    this.qrdata = this.authService.generateMsAuthenticatoQrCode(qrCodeSecret, email, issuer);
  }

  generateMsAuthenticatoQrCode(secret: string, email: string, issuer: string): string {
    const otpauthUrl = `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
    return `https://api.qrserver.com/v1/create-qr-code/?data=${encodeURIComponent(otpauthUrl)}&size=200x200`;
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
        },
        error => {
          console.error('Error updating user details:', error);
        }
      );
    }
  }
}
