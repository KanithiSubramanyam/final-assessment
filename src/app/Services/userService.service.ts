import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, map, take } from 'rxjs/operators';
import { AuthResponse } from '../Model/AuthResponse';
import { User } from '../Model/User';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root',
})
export class UserService {

  authService: AuthService = inject(AuthService);

  constructor(private http: HttpClient) {
  }

  // dataBaseUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`;

  getAllUsers() {
    this.authService.user.pipe(take(1),exhaustMap(user =>{
      // console.log('Token:', user.token);
      return this.http.get('https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json')

    }),map((response: any) => {
      const users: User[] = [];
      for (const key in response) {
         if (response.hasOwnProperty(key)) {
           const user = response[key];
           user.id = key;
           users.push(user);
         }
       }
       return users;
     }),
     catchError((error) => {
       return throwError(error);
     })).subscribe((user)=>{
      console.log(user)

    })
  //   return this.http.get(this.dataBaseUrl).pipe(
  //     map((response: any) => {
  //      const users: User[] = [];
  //      for (const key in response) {
  //         if (response.hasOwnProperty(key)) {
  //           const user = response[key];
  //           user.id = key;
  //           users.push(user);
  //         }
  //       }
  //       return users;
  //     }),
  //     catchError((error) => {
  //       return throwError(error);
  //     })
  //   );
  }
  
}
