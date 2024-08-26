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
  // updateTask(id: string, updatedTask: any): Observable<any> {
  //   return this.http.put(`${this.apiUrl}/${id}.json`, updatedTask);
  // }
  // updateUserDetails(updatedData: Partial<Task>): Observable<any> {
  //   const loggedInUser = JSON.parse(localStorage.getItem('localUser') || '{}');
    
  //   if (!loggedInUser || !loggedInUser.email) {
  //     return throwError(() => new Error('No user is logged in.'));
  //   }
  
  //   // Fetch all users and find the key for the current user
  //   return this.getAllUsers().pipe(
  //     take(1),
  //     exhaustMap(users => {
  //       const userKey = Object.keys(users).find(key => users[key].clientName === loggedInUser.clientName);
        
  //       if (!userKey) {
  //         throw new Error('User not found');
  //       }
  
  //       const userUrl = `${this.apiUrl.replace('.json', '')}/${userKey}.json`;
  //       return this.http.patch(userUrl, updatedData);
  //     }),
  //     catchError(error => throwError(() => error))
  //   );
  // }
  
}

// import { Injectable, inject } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';
// import { catchError, map, take, exhaustMap } from 'rxjs/operators';

// @Injectable({
//   providedIn: 'root',
// })
// export class TaskService {

//   private http: HttpClient = inject(HttpClient);
//   private apiUrl = `https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/tasks.json`;

//   constructor() {}

//   // Get all tasks
//   getAllTasks(): Observable<any> {
//     return this.http.get(this.apiUrl).pipe(
//       map(response => response),
//       catchError(error => throwError(() => new Error('Error fetching tasks: ' + error)))
//     );
//   }
//   getTask(): Observable<any> {
//          return this.http.get(`${this.apiUrl}.json`);
//       }

//   saveTask(taskData: any): Observable<any> {
//     return this.http.post(`${this.apiUrl}.json`, taskData);
//     }

//   // Get task by ID
//   getTaskById(id: string): Observable<any> {
//     const url = `${this.apiUrl.replace('.json', '')}/${id}.json`;
//     return this.http.get(url).pipe(
//       map(response => response),
//       catchError(error => throwError(() => new Error('Error fetching task: ' + error)))
//     );
//   }

//   // Create a new task
//   createTask(task: any): Observable<any> {
//     return this.http.post(this.apiUrl, task).pipe(
//       map(response => response),
//       catchError(error => throwError(() => new Error('Error creating task: ' + error)))
//     );
//   }

//   // Update an existing task
//   updateTask(id: string, updatedTask: any): Observable<any> {
//     const url = `${this.apiUrl.replace('.json', '')}/${id}.json`;
//     return this.http.patch(url, updatedTask).pipe(
//       map(response => response),
//       catchError(error => throwError(() => new Error('Error updating task: ' + error)))
//     );
//   }

//   // Delete a task
//   deleteTask(id: string): Observable<any> {
//     const url = `${this.apiUrl.replace('.json', '')}/${id}.json`;
//     return this.http.delete(url).pipe(
//       map(response => response),
//       catchError(error => throwError(() => new Error('Error deleting task: ' + error)))
//     );
//   }
// }
