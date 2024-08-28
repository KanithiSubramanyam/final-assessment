import { Component, inject, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './homepage/sidebar/sidebar.component';
import { TopbarComponent } from './homepage/topbar/topbar.component';
import { MainComponent } from './homepage/main/main.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LogoutWarningComponent } from './logout-warning/logout-warning.component';
import bootstrap from '../main.server';
import { AppService } from './Services/app.service';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, LoginComponent, SidebarComponent, TopbarComponent, MainComponent, CommonModule, ReactiveFormsModule, FormsModule, LogoutWarningComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'final-assessment';
  @ViewChild(LogoutWarningComponent) warningModal!: LogoutWarningComponent;
  tokenExpirationTimer: any;

  constructor(private appService: AppService, private authService: AuthService) {
    this.appService.startWarningTimer$.subscribe((duration) => {
      this.startWarningTimer(duration);
    });
  }

  ngOnInit() {
    this.authService.autoLogin();
  }

  ngAfterViewInit() {
    if (this.warningModal) {
      this.warningModal.extendSession.subscribe(() => this.extendSession());
      this.warningModal.logout.subscribe(() => this.authService.autoLogout(5 * 60 * 1000));
    } else {
      console.error('Warning modal is not initialized.');
    }
  }

  startWarningTimer(expirationDuration: number) {
    const warningDuration = 5 * 60 * 1000;
    const timeUntilWarning = expirationDuration - warningDuration;

    if (timeUntilWarning > 0) {
      setTimeout(() => {
        this.showLogoutWarning();
      }, timeUntilWarning);
    }
  }

  showLogoutWarning() {
    if (this.warningModal) {
      this.warningModal.open();
    } else {
      console.error('Warning modal is not initialized.');
    }
  }

extendSession() {
  console.log('Session extended');
  const newExpirationDuration = 60 * 60 * 1000; // Extend session by 1 hour
  this.authService.extendSession(newExpirationDuration);

  // Update session expiration in sessionStorage
  const user = JSON.parse(sessionStorage.getItem('localUser'));
  if (user) {
    user._expiresIn = new Date(new Date().getTime() + newExpirationDuration);
    sessionStorage.setItem('localUser', JSON.stringify(user));
  }
}

}