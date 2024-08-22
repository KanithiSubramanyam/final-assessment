import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private apiUrl = 'https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/users.json';

  constructor(private http: HttpClient) {}

  getUserCount(): Observable<number> {
    return this.http.get<any>(this.apiUrl).pipe(
      map(data => Object.keys(data).length),
      catchError(error => {
        console.error('Error fetching user count:', error);
        return throwError('Error fetching user count');
      })
    );
  }
}
