import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, switchMap, tap, throwError } from 'rxjs';
import { User } from '../Model/User';
import { Router } from '@angular/router';
import { AuthResponse } from '../Model/AuthResponse';
import { userDetails } from '../Model/userDetails';
import { ActivityLogService } from './activityLog.service';
import { ActivityLog } from '../Model/ActivityLog';
import { AppService } from './app.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  public isAuthenticated = false;
  public user = new BehaviorSubject<User | null>(null);
  public userDetailsData = new BehaviorSubject<userDetails | null>(null);

  public tokenExpirationTimer: any;

  private signupUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  private signinUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=';
  public webApi = 'AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM';
  private databaseUrl = 'https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app';
  private updateProfileUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.webApi}`;
  private updatePasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.webApi}`;
  private deleteAccountUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.webApi}`;

  constructor(
    private http: HttpClient,
    public router: Router,
    private activityLogService: ActivityLogService,
    private appService: AppService
  ) {
  }

  signUp(user: { email: string, password: string, firstName: string, lastName: string }) {
    const signupData = {
      email: user.email,
      password: user.password,
      returnSecureToken: true,
    };

    return this.http.post<AuthResponse>(`${this.signupUrl}${this.webApi}`, signupData)
      .pipe(
        catchError(this.handleError),
        tap(res => {
          const newUser: userDetails = new userDetails(
            res.localId,
            user.firstName,
            user.lastName,
            user.email,
            user.password,
            '', // address
            '', // gender
            '', // phone
            '', // photoURL
            false, // emailVerified
            'user', // role
            new Date(), // passwordLastChangedAt
            new Date(), // createdAt
            new Date(),
            false,
            ''
          );
          this.handleCreateUser(res, false);

          this.http.put(`${this.databaseUrl}/users/${res.localId}.json`, newUser)
            .subscribe({
              next: () => console.log('User details saved successfully under users folder'),
              error: err => console.error('Error saving user details:', err)
            });

          // Log data to activity log
          const logData = new ActivityLog(
            res.localId,
            res.email,
            'user',
            `A new user has been created by default signup method at ${new Date().toDateString()}`,
            new Date()
          );
          this.activityLogService.addActivityLog(logData);
        })
      );
  }

  logIn(email: string, password: string) {
    const data = { email, password, returnSecureToken: true };
    return this.http.post<AuthResponse>(`${this.signinUrl}${this.webApi}`, data)
      .pipe(
        catchError(this.handleError),
        tap(res => {
          // console.log(res);
          this.handleCreateUser(res, true);

          this.getUserProfile(res.localId).subscribe(userData => {
            userData.lastLoginAt = new Date();
            this.userDetailsData.next(userData);
            this.http.put(`${this.databaseUrl}/users/${res.localId}.json`, userData)
              .subscribe(); 
            this.activityLogService.addActivityLog('Logged in to the application');
          });
        })
      );
  }

  getUserProfile(uid: string): Observable<userDetails> {
    const url = `${this.databaseUrl}/users/${uid}.json`;
    console.log('Fetching user profile from URL:', url);
    return this.http.get<userDetails>(url).pipe(
      tap(data => console.log('User Profile Data:', data)),
      catchError(error => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    );
  }
  

  autoLogin() {
    const user = JSON.parse(sessionStorage.getItem('localUser') || '{}');
    if (!user || !user._token) {
      return;
    }
    const loggedUser = new User(user.id, user.email, user._token, new Date(user._expiresIn));
    this.user.next(loggedUser);
    const timerValue = loggedUser._expiresIn.getTime() - new Date().getTime();
    this.autoLogout(timerValue);
  }

  logOut(data: string | null) {
    const res = JSON.parse(sessionStorage.getItem('localUser') || '{}');
    const logData = new ActivityLog(
      res.localId,
      res.email,
      'user',
      `${data || 'User'} logout of application at ${new Date().toDateString()}`,
      new Date()
    );
    this.activityLogService.addActivityLog(logData);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.user.next(null);
    this.router.navigate(['/login']);
    sessionStorage.removeItem('localUser');
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log(`Auto logout will happen in: ${expirationDuration} ms`);
    this.appService.startWarningTimer(expirationDuration);

    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }

    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut('auto');
    }, expirationDuration);
  }

  extendSession(newExpirationDuration: number) {
    this.autoLogout(newExpirationDuration);
  }

  private handleCreateUser(res: AuthResponse, login: boolean) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);

    const localUser = new User(
      res.email,
      res.localId,
      res.idToken,
      expiresIn
    );
    sessionStorage.setItem('localUser', JSON.stringify(localUser));
    this.user.next(localUser);
    this.autoLogout(+res.expiresIn * 1000);
  }

  private handleError(err: any) {
    let errorMessage = 'An unknown error has occurred.';
    if (err.error && err.error.error) {
      switch (err.error.error.message) {
        case 'EMAIL_EXISTS':
          errorMessage = 'This email already exists.';
          break;
        case 'OPERATION_NOT_ALLOWED':
          errorMessage = 'This operation is not allowed.';
          break;
        case 'INVALID_LOGIN_CREDENTIALS':
          errorMessage = 'The email ID or password is not correct.';
          break;
        case 'USER_DISABLED':
          errorMessage = 'User account has been disabled.';
          break;
        case 'USER_NOT_FOUND':
          errorMessage = 'No user record found for this identifier.';
          break;
        case 'INVALID_ID_TOKEN':
          errorMessage = 'The provided ID token is invalid.';
          break;
        default:
          errorMessage = `Error: ${err.error.error.message}`;
          break;
      }
    }
    return throwError(() => new Error(errorMessage));
  }

  changePassword(idToken: string, newPassword: string, userId: string): Observable<any> {
    const body = {
      idToken,
      password: newPassword,
      returnSecureToken: true,
    };

    // Fetch user data and update BehaviorSubject
    return this.http.get<userDetails>(`${this.databaseUrl}/users/${userId}.json`).pipe(
      switchMap(userData => {
        if (userData) {
          const updatedData = {
            ...userData,
            passwordLastChangedAt: new Date()
          };
          
          // Update BehaviorSubject
          this.userDetailsData.next(updatedData);

          // Post password change
          return this.http.post(this.updatePasswordUrl, body).pipe(
            map(() => {
              this.activityLogService.addActivityLog('Password has been changed');
              return updatedData;
            }),
            catchError(error => throwError(() => new Error('Error changing password')))
          );
        } else {
          return throwError(() => new Error('User data is not available'));
        }
      }),
      catchError(error => throwError(() => new Error('Error fetching user data')))
    );
  }

  getToken(): string | null {
    const user = JSON.parse(sessionStorage.getItem('localUser') || '{}');
    return user ? user._token : null;
  }

  deleteAccount(uid: string, idToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });
    const body = {
      localId: uid
    };
    return this.http.post(this.deleteAccountUrl, body, { headers })
      .pipe(
        catchError(this.handleError)
      );
  }

  generateMsAuthenticatoQrCode(secret: string, email: string, issuer: string) {
    return `otpauth://totp/${issuer}:${email}?secret=${secret}&issuer=${issuer}`;
  }

  // isMfaEnabled(mfaBtn: boolean, uid: string, secretKey: string) {
  //   console.log('MFA Button:', uid);
  //   return this.getUserProfile(uid).pipe(
  //     tap(userData => {
  //       if (!userData) {
  //         throw new Error('User data is null or undefined');
  //       }
  //       console.log('Fetched User Data:', userData);
  //     }),
  //     map(userData => {
  //       userData.mfaBtn = mfaBtn;
  //       userData.mfaSecertKey = secretKey; // Correct typo if needed
  //       console.log('Updated User Data:', userData);
  //       return this.http.put(`${this.databaseUrl}/users/${uid}.json`, userData).pipe(
  //         tap(response => console.log('PUT Response:', response)),
  //         catchError(error => {
  //           console.error('PUT Error:', error);
  //           return throwError(error);
  //         })
  //       );
  //     }),
  //     catchError(this.handleError)
  //   );
  // }
  
  

  updateUserProfile(userId: string, userData: userDetails): Observable<any> {
    this.activityLogService.addActivityLog('Profile has been updated');
    return this.http.put(`${this.databaseUrl}/users/${userId}.json`, userData)
      .pipe(
        catchError(this.handleError)
      );
  }


checkPasswordExpiration(): boolean {
  const expirationPeriod = 90;
  const currentDate = new Date();
  const daysSinceChange = Math.floor((currentDate.getTime() - this.userDetailsData.value?.passwordLastChangedAt?.getTime()) / (1000 * 60 * 60 * 24));
  return daysSinceChange >= expirationPeriod;
}

notifyPasswordExpiration() {
  if (this.checkPasswordExpiration()) {
    alert('Your password has expired. Please change it immediately.');
  }
}

}
