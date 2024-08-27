import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TaskService } from '../../../Services/task.service';
import { CommonModule } from '@angular/common';
import { userDetails } from '../../../Model/userDetails';
import { CommonDataService } from '../../../utilites/CommonData.service';



@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent {

  tasks: any[] = [];
  sortedTasks: any[] = [];
  currentTask: any;
  // Set the default sorting field and direction
  sortField: string = 'dueDate'; // Default sorting field
  sortDirection: string = 'asc'; // Default sorting direction

  currentUser : userDetails;


  constructor(private taskService: TaskService, private router: Router, private commonDataService: CommonDataService) { 
    this.commonDataService.getCurrentUser().subscribe(userDetails => {
      if (userDetails) {
        this.currentUser = userDetails;
        // Fetch tasks after the user role is known
        this.fetchTasks();
      } else {
        console.log('User details could not be fetched.');
      }
    });
  
    // Perform the default sort when the component initializes
    this.sortTasksBy(this.sortField);
  }
  

  fetchTasks(): void {
    this.taskService.getTask().subscribe(data => {
      const allTasks = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      
      if (this.currentUser && (this.currentUser.role !== 'admin' && this.currentUser.role !== 'accountmanager)')) {
        // Filter tasks where assignedToEmail matches the current user's email
        this.tasks = allTasks.filter(task => task.assignedToEmail === this.currentUser.email);
      } else {
        // If the user is an admin, show all tasks
        this.tasks = allTasks;
      }
      console.log(this.tasks);
      this.sortedTasks = [...this.tasks];
    });
  }
  

  deleteTask(id: string, index: number): void {
    // Optimistically remove the task from the UI
    const removedTask = this.tasks.splice(index, 1)[0];

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log(`Task with ID ${id} has been deleted`);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        // If there was an error, add the task back to the list
        this.tasks.splice(index, 0, removedTask);
      }
    });
  }

  OnEditTaskClicked(task) {
    this.router.navigate(['/taskManagement/addtask'], { state: { task } });
  }

  onViewTaskClicked(task: any): void {
    this.router.navigate(['/taskManagement/taskDetails'], { state: { task } });
  }

  sortTasksBy(field: string): void {
    if (this.sortField === field) {
      // Toggle sort direction if the same field is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new sorting field and default to ascending order
      this.sortField = field;
      this.sortDirection = 'asc';
    }

    this.sortedTasks = [...this.tasks];
    this.sortedTasks.sort((a, b) => {
      let comparison = 0;

      if (field === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (field === 'priority') {
        const priorities = ['Low', 'Medium', 'High'];
        comparison = priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      } else if (field === 'status') {
        const statusesAsc = ['Not Started', 'In Progress', 'Completed'];
        const aIndex = statusesAsc.indexOf(a.status);
        const bIndex = statusesAsc.indexOf(b.status);
        comparison = aIndex - bIndex;
      }
      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

}