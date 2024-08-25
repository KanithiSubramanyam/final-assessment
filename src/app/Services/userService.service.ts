import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, exhaustMap, map, take } from 'rxjs/operators';
import { AuthResponse } from '../Model/AuthResponse';
import { User } from '../Model/User';
import { AuthService } from './auth.service';
import { userDetails } from '../Model/userDetails';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  authService: AuthService = inject(AuthService);
  http: HttpClient = inject(HttpClient);


  dataBaseUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json`;

  //all users data in the database
  getAllUsers() {
    return this.http.get<{ [key: string]: userDetails }>(this.dataBaseUrl).pipe(
      map(response => {
        const usersArray = Object.values(response);
        return usersArray;
      })
    );
  }

  private getIdToken(): string {
    // Implement logic to get the current user's ID token from local storage or another source
    return localStorage.getItem('idToken') || '';
  }

  getCurrentUser() {
    // Get the user from local storage (or however you're storing the logged-in user)
    
    const loggedInUser = JSON.parse(localStorage.getItem('localUser') || '{}');
  
    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
    const userUrl = `${this.dataBaseUrl}`;
  
    return this.http.get<{ [key: string]: User }>(userUrl).pipe(
      map(response => {
        const usersArray = Object.values(response); 
        console.log('usersArray', usersArray);
        console.log('email', loggedInUser.email);
        const matchedUser = usersArray.find(userData => userData.email === loggedInUser.email);
        console.log('matchedUser', matchedUser);
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
