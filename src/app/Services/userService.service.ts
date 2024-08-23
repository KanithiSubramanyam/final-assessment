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
  http: HttpClient = inject(HttpClient);


  dataBaseUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`;

  //all users data in the database
  getAllUsers() {
    return this.authService.user.pipe(
      exhaustMap(user => this.http.get(this.dataBaseUrl)),
      map(response => Object.entries(response).map(([key, user]) => ({ ...user, id: key }))),
      catchError(error => throwError(() => error))
    );
  }

  getCurrentUser() {
    // Get the user from local storage (or however you're storing the logged-in user)
    const loggedInUser = JSON.parse(localStorage.getItem('localUser') || '{}');
  
    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
  
    // Ensure email is URL-encoded if necessary
    const userUrl = `${this.dataBaseUrl}`;
  
    return this.http.get<{ [key: string]: User }>(userUrl).pipe(
      map(response => {
        const usersArray = Object.values(response); 
        const matchedUser = usersArray.find(userData => userData.email === loggedInUser.email);
        if (matchedUser) {
          return { ...matchedUser, id: matchedUser.id };
        } else {
          throw new Error('User not found');
        }
      }),
      catchError(error => throwError(() => error))
    );
  }
  
  
  

}
