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
  getAllUsers(): Observable<{ [key: string]: userDetails }> {
    return this.http.get<{ [key: string]: userDetails }>(this.dataBaseUrl).pipe(
      map(response => {
        return response;
      })
    );
  }
  

  //get current user data
  getCurrentUser() {    
    const loggedInUser = JSON.parse(localStorage.getItem('localUser') || '{}');
  
    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
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


  updateUserDetails(updatedData: Partial<userDetails>): Observable<any> {
    const loggedInUser = JSON.parse(localStorage.getItem('localUser') || '{}');
    
    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
  
    // Fetch all users and find the key for the current user
    return this.getAllUsers().pipe(
      take(1),
      exhaustMap(users => {
        const userKey = Object.keys(users).find(key => users[key].email === loggedInUser.email);
        
        if (!userKey) {
          throw new Error('User not found');
        }
  
        const userUrl = `${this.dataBaseUrl.replace('.json', '')}/${userKey}.json`;
        return this.http.patch(userUrl, updatedData);
      }),
      catchError(error => throwError(() => error))
    );
  }
  
  

}
