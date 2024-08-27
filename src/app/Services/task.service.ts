// task.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Task } from '../Model/task';  // Import the Task interface

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/tasks';

  constructor(private http: HttpClient) {}

  saveTask(taskData: Task): Observable<any> {  // Use the Task interface here
    return this.http.post(`${this.apiUrl}.json`, taskData);
  }

  getTask(): Observable<{ [key: string]: Task }> {  // Expect a dictionary of Task objects
    return this.http.get<{ [key: string]: Task }>(`${this.apiUrl}.json`);
  }


  deleteTask(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`);
  }
  

  updateTask(id: string, taskData: Task): Observable<any> {  // Use the Task interface here
    return this.http.put<any>(`${this.apiUrl}/${id}.json`, taskData);
  }
}
