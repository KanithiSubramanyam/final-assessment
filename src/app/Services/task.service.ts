import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

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
}