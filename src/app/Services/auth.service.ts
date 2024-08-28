import { HttpClient, HttpHeaders } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";
import { error } from "console";
import { userDetails } from "../Model/userDetails";
import { ActivityLogService } from "./activityLog.service";
import { ActivityLog } from "../Model/ActivityLog";
import { CommonDataService } from "../utilities/CommonData.service";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  http: HttpClient = inject(HttpClient);
  user = new BehaviorSubject<User>(null);
  router: Router = inject(Router);
  activityLogService : ActivityLogService = inject(ActivityLogService);
  commonDataService : CommonDataService = inject(CommonDataService);
  private tokenExpirationTimer: any;

  public token = null;

  public signupUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  public signinUrl: string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  public webApi = "AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM";
  public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app";
  public accountInfo = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=";
  private updateProfileUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.webApi}`;
  private updatePasswordUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.webApi}`;
  private deleteAccountUrl = `https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.webApi}`;  
  public userDataUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=`;

  public logData : ActivityLog;

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
          // Create the userDetails object with default values for non-provided fields
          const newUser : userDetails = new userDetails(
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
              next: () => {
                console.log('User details saved successfully under users folder');
              },
              error: error => {
                console.error('Error saving user details:', error);
              }
            });

            //logData to activity log
            this.logData = new ActivityLog(
              res.localId,
              res.email,
              'user',
              'A new user has been created by default signup method at  ' + new Date().toDateString(),
              new Date(),
            );
            this.activityLogService.addActivityLog(this.logData);
        })
      );
  }
  
  //login to the application
  logIn(email: string, password: string) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<AuthResponse>(this.signinUrl + this.webApi, data)
      .pipe(catchError(this.handleError), tap((res) => {

        console.log(res);
        this.handleCreateUser(res, true);

        this.getUserProfile(res.localId).subscribe(userData => {
          // Update last login date
          userData.lastLoginAt = new Date();

          this.http.put(`${this.databaseUrl}/users/${res.localId}.json`, userData)
            .subscribe();

          this.activityLogService.addActivityLog('Logged in to the application ');
        });
      })
    );
  }

  getUserProfile(uid: string) {
    return this.http.get<userDetails>(`${this.databaseUrl}/users/${uid}.json`);
  }

  
  autoLogin() {
    const user = JSON.parse(localStorage.getItem('localUser'));
    if (!user) {
      return;
    }
    const loggedUser = new User(user.id, user.email,
      user._token, user._expiresIn);

    if (loggedUser._token) {
      loggedUser._expiresIn = new Date(loggedUser._expiresIn);
      this.user.next(loggedUser);
      const timerValue = loggedUser._expiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }
  
  logOut() {
    const res = JSON.parse(localStorage.getItem('localUser'));
    this.logData = new ActivityLog(
      res.localId,
      res.email,
      'user',
      'A new user has been created by default signup method at  ' + new Date().toDateString(),
      new Date(),
    );
    this.activityLogService.addActivityLog(this.logData);

      if (this.tokenExpirationTimer) {
        clearTimeout(this.tokenExpirationTimer);
      }
      this.user.next(null);
      this.router.navigate(['/login']);
      localStorage.removeItem('localUser');
      this.tokenExpirationTimer = null;
    
  }
  
  autoLogout(expirationDuration: number) {
    console.log(`Auto logout will happen in: ${expirationDuration} ms`);
    this.tokenExpirationTimer = setTimeout(() => {
        this.activityLogService.addActivityLog('Auto Logged Off from the application').subscribe(() => {
            this.logOut();
        });
    }, expirationDuration);
}


  private handleCreateUser(res: AuthResponse, login: boolean) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 100;
    const expiresIn = new Date(expiresInTs);

    const localUser = new User(
      res.email,
      res.localId,
      res.idToken,
      expiresIn 
    );
    localStorage.setItem('localUser', JSON.stringify(localUser));
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
        // Add more cases as needed based on Firebase error messages
        default:
          errorMessage = `Error: ${err.error.error.message}`;
          break;
      }
    }
    return throwError(() => errorMessage);
  }
  
  changePassword(idToken: string, newPassword: string, userId : string): Observable<any> {
    const body = {
      idToken: idToken,
      password: newPassword,
      returnSecureToken: true,
    };
    return this.http.post(this.updatePasswordUrl, body).pipe(
      map((response) => {
        this.activityLogService.addActivityLog('Password has been changed');
        return response;
      }),
      catchError((error) => throwError(() => new Error('Error changing password')))
    );
  }

  getToken(){
    const user = JSON.parse(localStorage.getItem('localUser'));
    return user ? user._token : null;
  }

  //not working
  deleteAccount(uid: string, idToken: string): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${idToken}`,
      'Content-Type': 'application/json'
    });
    const body = {
      localId: uid
    };
    return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:delete?key=${this.webApi}`, body, { headers });
  }

  generateMsAuthenticatoQrCode(secert:string, email : string, issuer : string){
    return `otpauth://totp/${issuer}:${email}?secret=${secert}&issuer=${issuer}`;
  }


  //update mfabtn and mfasecertkey
  isMfaEnabled(mfaBtn : boolean, uid:string, secertKey : string){
    this.getUserProfile(uid).subscribe(userData => {
      userData.mfaBtn = true;
      userData.mfaSecertKey = secertKey
      this.http.put(`${this.databaseUrl}/users/${uid}.json`, userData)
        .subscribe();
    });
    return true;
  }

  updateUserProfile(userId : string, userData : userDetails){

    this.activityLogService.addActivityLog('Profile has been updated');

    return this.http.put(`${this.databaseUrl}/users/${userId}.json`, userData);
  }

}