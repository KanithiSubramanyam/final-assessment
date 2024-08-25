import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, Observable, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";
import { error } from "console";
import { userDetails } from "../Model/userDetails";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  http: HttpClient = inject(HttpClient);
  user = new BehaviorSubject<User>(null);
  router: Router = inject(Router);

  private tokenExpirationTimer: any;

  public signupUrl: string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  public signinUrl: string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  public webApi = "AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM";
  public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app";
  public token = null;
  public accountInfo = "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=";
  private updateProfileUrl = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.webApi}`;

  public userDataUrl = `https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=`;


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
            new Date() // lastLoginAt
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
        })
      );
  }
  
  logIn(email: string, password: string) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<AuthResponse>(this.signinUrl + this.webApi, data)
      .pipe(catchError(this.handleError), tap((res) => {

        this.handleCreateUser(res, true);

        this.getUserProfile(res.localId).subscribe(userData => {
          // Update last login date
          userData.lastLoginAt = new Date();

          this.http.put(`${this.databaseUrl}/users/${res.localId}.json`, userData)
            .subscribe();

        });
      })
    );
  }

  getUserProfile(uid: string) {
    return this.http.get<userDetails>(`${this.databaseUrl}/users/${uid}.json`);
  }

  
  autoLogin() {
    const user = JSON.parse(localStorage.getItem('localUser'));
    // console.log('auto login user', user);
    if (!user) {
      return;
    }
    const loggedUser = new User(user.id, user.email,
      user._token, user._expiresIn);

    if (loggedUser._token) {
      loggedUser._expiresIn = new Date(loggedUser._expiresIn);
      // console.log('log in user', loggedUser._expiresIn);
      this.user.next(loggedUser);
      const timerValue = loggedUser._expiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }

  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('localUser');
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.logOut();
    }, expirationDuration);
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

    this.user.next(localUser);
    this.autoLogout(+res.expiresIn * 1000);
    if(login){
      localStorage.setItem('localUser', JSON.stringify(localUser));
    }
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
  
}



//userdata
  // getUserData(idToken: string): Observable<any> {
  //   const url = `${this.accountInfo}${this.webApi}`;
  //   const body = {
  //     idToken: idToken
  //   };
  
  //   return this.http.post<any>(url, body).pipe(
  //     catchError(error => {
  //       console.error('Error retrieving user data:', error);
  //       return throwError(() => new Error('Error retrieving user data'));
  //     }),
  //     map(response => {
  //       if (response && response.users && response.users.length > 0) {
  //         // Assuming the first user in the array is the one you're looking for
  //         return response.users[0];
  //       } else {
  //         throw new Error('No user data found');
  //       }
  //     })
  //   );
  // }

  
//email verified 
  // sendEmailVerification(idToken: string): Observable<any> {
  //   const url = `https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=${this.webApi}`;
  //   const body = {
  //     requestType: 'VERIFY_EMAIL',
  //     idToken: idToken
  //   };
  
  //   return this.http.post<any>(url, body)
  //     .pipe(
  //       catchError(error => {
  //         console.error('Error sending email verification:', error);
  //         return throwError(() => new Error('Error sending email verification'));
  //       })
  //     );
  // }
  
  