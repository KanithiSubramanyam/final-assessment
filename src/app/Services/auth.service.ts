import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, map, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";
import { error } from "console";


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
  public databaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json";
  public token = null;

  signUp(user) {
    const data = { email: user.email, password: user.password, returnSecureToken: true };
    return this.http.post<AuthResponse>(
      this.signupUrl + this.webApi, data
    ).pipe(catchError(this.handleError), tap((res) => {

      let userData: User = {
        id: '',
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        password: user.password,
        address: '',
        gender: '',
        phone: '',
        photoURL: '',
        emailVerified: false,
        role: 'user',
        createdAt: new Date(),
        lastLoginAt: new Date(),
        _token: res.idToken,
        passwordLastChangedAt: new Date(),
        _expiresIn: new Date(),
        token: res.idToken
      };
      this.handleCreateUser(res);
      this.http.post(this.databaseUrl, userData)
        .subscribe({
          next: () => {
            console.log('User successfully added to the database')
          },
          error: (error) => {
            console.log(error);
          }
        });
    }),
    )
  }

  logIn(email: string, password: string) {
    const data = { email: email, password: password, returnSecureToken: true };
    return this.http.post<AuthResponse>(this.signinUrl + this.webApi, data)
      .pipe(catchError(this.handleError), tap((res) => {
        this.handleCreateUser(res)
      }));
  }


  autoLogin() {
    const user = JSON.parse(localStorage.getItem('localUser'));
    // console.log('auto login user', user);
    if (!user) {
      return;
    }
    const loggedUser = new User(user.id, user.firstName,
      user.lastName, user.email, user.password,
      user.address, user.gender, user.phone,
      user.photoURL, user.emailVerified,
      user.role, user.createdAt, user.lastLoginAt,
      user._token, user.passwordLastChangedAt, user._expiresIn);
    // console.log('log in user', loggedUser);

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

  // checkPasswordExpiration(): boolean {
  //   const expirationPeriod = 90;
  //   const currentDate = new Date();
  //   const daysSinceChange = Math.floor((currentDate.getTime() - this.user.value?.passwordLastChangedAt?.getTime()) / (1000 * 60 * 60 * 24));
  //   return daysSinceChange >= expirationPeriod;
  // }

  // notifyPasswordExpiration() {
  //   if (this.checkPasswordExpiration()) {
  //     alert('Your password has expired. Please change it immediately.');
  //   }
  // }

  private handleCreateUser(res) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    // console.log(expiresIn);
    const localUser = new User(res.localId, res.firstName,
      res.lastName, res.email, res.password,
      res.address, res.gender, res.phone,
      res.photoURL, res.emailVerified,
      res.role, res.createdAt, res.lastLoginAt,
      res.idToken, res.passwordLastChangedAt, expiresIn
    );
    // console.log('after login',localUser);
    this.user.next(localUser);
    this.autoLogout(res.expiresIn * 1000);
    localStorage.setItem('localUser', JSON.stringify(localUser));
  }

  private handleError(err) {
    let errorMessage = 'An unknown error has occured'
    console.log(err);
    if (!err.error || !err.error.error) {
      return throwError(() => errorMessage);
    }
    switch (err.error.error.message) {
      case 'EMAIL_EXISTS':
        errorMessage = "This email already exists.";
        break;
      case 'OPERATION_NOT_ALLOWED':
        errorMessage = 'This operation is not allowed.';
        break;
      case 'INVALID_LOGIN_CREDENTIALS':
        errorMessage = 'The email ID or Password is not correct.';
        break
    }
    return throwError(() => errorMessage);
  }
}
