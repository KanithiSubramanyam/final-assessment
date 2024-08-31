import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { catchError, exhaustMap, map, switchMap, take } from 'rxjs/operators';
import { AuthResponse } from '../Model/AuthResponse';
import { User } from '../Model/User';
import { AuthService } from './auth.service';
import { userDetails } from '../Model/userDetails';
import { ActivityLogService } from './activityLog.service';
import { ActivityLog } from '../Model/ActivityLog';

@Injectable({
  providedIn: 'root',
})

export class UserService {

  authService: AuthService = inject(AuthService);
  http: HttpClient = inject(HttpClient);
  activityLogService: ActivityLogService = inject(ActivityLogService);

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
    const loggedInUser = JSON.parse(sessionStorage.getItem('localUser') || '{}');

    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
    const userUrl = `${this.dataBaseUrl}`;

    return this.http.get<{ [key: string]: userDetails }>(userUrl).pipe(
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
    const loggedInUser = JSON.parse(sessionStorage.getItem('localUser') || '{}');

    if (!loggedInUser || !loggedInUser.email) {
      return throwError(() => new Error('No user is logged in.'));
    }
    return this.getAllUsers().pipe(
      take(1),
      exhaustMap(users => {
        const userKey = Object.keys(users).find(key => users[key].email === loggedInUser.email);
        if (!userKey) {
          throw new Error('User not found');
        }
        const userUrl = `${this.dataBaseUrl.replace('.json', '')}/${userKey}.json`;

        //activity log 
        this.activityLogService.addActivityLog('User Details has been updated');

        return this.http.patch(userUrl, updatedData);
      }),
      catchError(error => throwError(() => error))
    );
  }

  //get user by id
  getUserById(position: number): Observable<userDetails> {
    return new Observable<userDetails>(observer => {
      this.getAllUsers().pipe(
        map(users => Object.values(users))
      ).subscribe(
        users => {
          if (position >= 0 && position < users.length) {
            const user = users[position];
            observer.next(user);
            observer.complete();
          } else {
            observer.error('Position out of bounds');
          }
        },
        error => observer.error(error)
      );
    });
  }

  getCurrentUserData(id){
      return this.http.get<userDetails>(`${this.dataBaseUrl.replace('.json', '')}/${id}.json`);
  }

  // updateProfilePhoto(id, updatedData: Partial<userDetails>): Observable<any> {
  //   return this.http.patch<userDetails>(
  //     `${this.dataBaseUrl.replace('.json', '')}/${id}.json`,updatedData);
  // }

  // private firebaseStorageUrl = 'final-assessment-1.appspot.com';

  // uploadFile(file: File, path: string): Observable<string> {
  //   const uploadUrl = `https://firebasestorage.googleapis.com/v0/b/${this.firebaseStorageUrl}/o/${encodeURIComponent(path)}?uploadType=media&alt=media`;
  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/octet-stream'
  //   });
  
  //   return this.http.post(uploadUrl, file, { headers: headers, responseType: 'text',  }).pipe(
  //     switchMap(() => this.getDownloadUrl(path)),
  //     catchError(err => {
  //       console.error('Error uploading file:', err);
  //       return of('');
  //     })
  //   );
  // }
  

  // getDownloadUrl(path: string): Observable<string> {
  //   const url = `https://firebasestorage.googleapis.com/v0/b/${this.firebaseStorageUrl}/o/${encodeURIComponent(path)}?uploadType=media&alt=media`;
  //   return this.http.get(url, { responseType: 'text' });
  // }
  
  
  // updateUserProfile(idToken: string, displayName: string, photoUrl: string): Observable<any> {
  //   const url = `https://identitytoolkit.googleapis.com/v1/accounts:update?key=${this.authService.webApi}`;
  //   const body = {
  //     idToken: idToken,
  //     displayName: displayName,
  //     photoUrl: photoUrl,
  //     returnSecureToken: true,
  //   };
  
  //   return this.http.post(url, body, {
  //     headers: new HttpHeaders({
  //       'Content-Type': 'application/json',
  //     }),
  //   });
  // }

}
