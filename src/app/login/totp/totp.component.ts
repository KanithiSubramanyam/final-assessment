import { Component, inject, OnInit } from '@angular/core';
import * as QRCode from 'qrcode';
import { AuthService } from '../../Services/auth.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-totp',
  standalone: true,
  templateUrl: './totp.component.html',
  styleUrls: ['./totp.component.css']
})
export class TotpComponent {
  totpSecret: string = '';
  qrCodeUrl: string = '';

  constructor(private authService: AuthService) { }

  // ngOnInit() {
  //   let user = JSON.parse(localStorage.getItem('localUser'));
  //   const userId = user.localId;
  //   const email = user.email;
  //   this.authService.generateTotpSecret(userId).subscribe((response: any) => {
  //     this.totpSecret = response.secret;

  //     const issuerName = 'final-assessment-1';
  //     const accountName = email;

  //     const otpAuthUrl = `otpauth://totp/${issuerName}:${accountName}?secret=${this.totpSecret}&issuer=${issuerName}`;

  //     QRCode.toDataURL(otpAuthUrl, (err, url) => {
  //       if (err) {
  //         console.error(err);
  //       } else {
  //         this.qrCodeUrl = url;
  //       }
  //     });
  //   });
  // }

}