import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthResponse } from '../Model/AuthResponse';
import { User } from '../Model/User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userInfoUrl = 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDVj7HtNPKKIQ8WJvaDNKgoTeacABkwaHM';

  dataBaseUrl = "https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json"

  constructor(private http: HttpClient) {}

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.dataBaseUrl).pipe(
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
