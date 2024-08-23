import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { BehaviorSubject, catchError, tap, throwError } from "rxjs";
import { User } from "../Model/User";
import { Router } from "@angular/router";
import { AuthResponse } from "../Model/AuthResponse";


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  isAuthenticated: boolean = false;
  http: HttpClient = inject(HttpClient);
  user = new BehaviorSubject<User>(null);
  router: Router = inject(Router);

  private tokenExpirationTimer: any;

  public signupUrl : string = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=';
  public signinUrl : string = "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=";
  public webApi = "AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM";

  public token = null;
  
  // signUp(user: User) {
  //   const data = { ...user, returnSecureToken: true };
  
  //   return this.http.post<AuthResponse>(this.signupUrl + this.webApi, data)
  //     .pipe(
  //       tap((res) => {
  //         this.handleCreateUser(res);
  //         this.token = res.idToken;
  //         this.http.post(`https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json?auth=${this.token}`, data)
  //           .subscribe(() => {
  //             console.log('User successfully added to the database');
  //           });
  //       }),
  //       catchError(this.handleError)
  //     );
  // }
  signUp(user:User){
    const data = { ...user, returnSecureToken: true }
    return this.http.post<AuthResponse>(
      'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM',data
    ).pipe(catchError(this.handleError),tap((res)=>{
      this.handleCreateUser(res)
    }))
  }

  logIn(email: string, password: string) {
    // const data = { email: email, password: password, returnSecureToken: true }
    // return this.http.post<AuthResponse>(
    //   'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM',data
    // ).pipe(catchError(this.handleError))
    const data = { email: email, password: password, returnSecureToken: true };

    return this.http.post<AuthResponse>(this.signinUrl+this.webApi, data)
    .pipe(catchError(this.handleError), tap((res) => {
      this.handleCreateUser(res)
    }));
  }

  autoLogin() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
      return;
    }

    const loggedUser = new User(user.id, user.firstName,
      user.lastName, user.email, user.password,
      user.address, user.gender, user.phone,
      user.photoURL, user.emailVerified,
      user.role, user.createdAt, user.lastLoginAt,
      user.token, user.passwordLastChangedAt, user.expiresIn);

    if (loggedUser.token) {
      this.user.next(loggedUser);
      const timerValue = user.expiresIn.getTime() - new Date().getTime();
      this.autoLogout(timerValue);
    }
  }

  logOut() {
    this.user.next(null);
    this.router.navigate(['/login']);
    localStorage.removeItem('user');
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

  checkPasswordExpiration(): boolean {
    const expirationPeriod = 90;
    const currentDate = new Date();
    const daysSinceChange = Math.floor((currentDate.getTime() - this.user.value?.passwordLastChangedAt?.getTime()) / (1000 * 60 * 60 * 24));
    return daysSinceChange >= expirationPeriod;
  }

  notifyPasswordExpiration() {
    if (this.checkPasswordExpiration()) {
      alert('Your password has expired. Please change it immediately.');
    }
  }

  private handleCreateUser(res) {
    const expiresInTs = new Date().getTime() + +res.expiresIn * 1000;
    const expiresIn = new Date(expiresInTs);
    console.log(res);
    const user = new User(res.localId, res.firstName,
      res.lastName, res.email, res.password,
      res.address, res.gender, res.phone,
      res.photoURL, res.emailVerified,
      res.role, res.createdAt, res.lastLoginAt,
      res.idToken, res.passwordLastChangedAt, expiresIn
    );
    this.user.next(user);
    this.autoLogout(res.expiresIn * 1000);
    localStorage.setItem('user', JSON.stringify(user));
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
