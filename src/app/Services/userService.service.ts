import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
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

  dataBaseUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`;

  getAllUsers(): Observable<User[]> {
    return this.http.get(this.dataBaseUrl).pipe(
      map((response: any) => {
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
      })
    );
  }
  
}
