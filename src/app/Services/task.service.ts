import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, exhaustMap, map, Observable, take, throwError } from 'rxjs';
import { Task } from '../Model/task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private apiUrl ='https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/tasks'; // Mock API URL

  constructor(private http: HttpClient) {}

  saveTask(taskData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}.json`, taskData);
  }

  getTask(): Observable<any> {
    return this.http.get(`${this.apiUrl}.json`);
  }
  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`);
  }
  updateTask(id: string, taskData: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}.json`, taskData);
  }
  getAllUsers(): Observable<{ [key: string]: Task }> {
    return this.http.get<{ [key: string]: Task }>(this.apiUrl).pipe(
      map(response => {
        return response;
      })
    );
  }
}

  