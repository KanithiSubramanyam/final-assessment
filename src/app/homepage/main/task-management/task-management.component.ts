import { Component,ChangeDetectorRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { TaskService } from '../../../Services/task.service';
import { CommonModule } from '@angular/common';
import { userDetails } from '../../../Model/userDetails';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../../Services/auth.service';
import { UserService } from '../../../Services/userService.service';




@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [RouterLink, CommonModule,FormsModule ],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent {

  tasks: any[] = [];
  sortedTasks: any[] = [];
  currentTask: any;
  sortField: string = 'dueDate'; // Default sorting field
  sortDirection: 'asc' | 'desc' = 'asc';// Default sorting direction
  sortAscending :boolean = true;

  currentUser: userDetails;


  // Filter values
  statusFilter: string = '';
  priorityFilter: string = '';
  dueDateFilter: string = '';
  filteredTasks: any[] = [];
  showFilterOptions = false;


  constructor(private taskService: TaskService,
    private router: Router, private cd: ChangeDetectorRef, private userService: UserService) {
  }
  ngOnInit(){
    this.userService.getCurrentUser().subscribe(userDetails => {
      if (userDetails) {
        this.currentUser = userDetails;
        this.fetchTasks();
      } else {
        console.log('User details could not be fetched.');
      }
    });

    // Perform the default sort when the component initializes
    this.sortTasksBy(this.sortField);
    this.cd.detectChanges(); // Force change detection if needed
  }



  fetchTasks(): void {
    this.taskService.getTask().subscribe(data => {
      let allTasks
      if(data){
         allTasks = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
      }
      else{
        allTasks = [];
     }

      if (this.currentUser && (this.currentUser.role !== 'admin' && this.currentUser.role !== 'accountmanager)')) {
        // Filter tasks where assignedToEmail matches the current user's email
        this.tasks = allTasks.filter(task => task.assignedToEmail === this.currentUser.email);
      } else {
        // If the user is an admin, show all tasks
        this.tasks = allTasks;
      }
      this.sortedTasks = [...this.tasks];
      this.filteredTasks = [...this.tasks];
      this.applyFilters(); // Apply filters on initial load
    });
  }


  deleteTask(id: string, index: number): void {
    const removedTask = this.tasks.splice(index, 1)[0];

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log(`Task with ID ${id} has been deleted`);
        this.fetchTasks(); // Re-fetch the tasks
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

  sortTasksBy(field: string, direction: 'asc' | 'desc' = 'asc'): void {
    if (this.sortField === field) {
      // Toggle sort direction if the same field is clicked
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      // Set the new sorting field and sort direction
      this.sortField = field;
      this.sortDirection = direction;
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

  toggleFilter(): void {
    this.showFilterOptions = !this.showFilterOptions;
  }

  applyFilters(): void {
    this.sortedTasks = this.tasks.filter(task => {
      return (
        (!this.statusFilter || task.status === this.statusFilter) &&
        (!this.priorityFilter || task.priority === this.priorityFilter) &&
        (!this.dueDateFilter || new Date(task.dueDate).toISOString().split('T')[0] === this.dueDateFilter)
      );
    });
  }

  onSearchClick(): void {
    this.applyFilters();
  }




  
}