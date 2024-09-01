import { Component, ChangeDetectorRef } from '@angular/core';
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
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './task-management.component.html',
  styleUrls: ['./task-management.component.css']  // Corrected from styleUrl to styleUrls
})
export class TaskManagementComponent {

  tasks: any[] = [];
  sortedTasks: any[] = [];
  currentTask: any;
  sortField: string = 'dueDate'; // Default sorting field
  sortDirection: 'asc' | 'desc' = 'asc'; // Default sorting direction

  currentUser: userDetails;

  // Filter values
  statusFilter: string = '';
  priorityFilter: string = '';
  dueDateFilter: string = '';
  searchTerm: string = '';  // Search term
  showFilterOptions = false;

  constructor(
    private taskService: TaskService,
    private router: Router,
    private cd: ChangeDetectorRef,
    private userService: UserService
  ) {}

  ngOnInit() {
    this.userService.getCurrentUser().subscribe(userDetails => {
      if (userDetails) {
        this.currentUser = userDetails;
        this.fetchTasks();
      } else {
        console.log('User details could not be fetched.');
      }
    });

    this.sortTasksBy(this.sortField);
    this.cd.detectChanges();
  }

  fetchTasks(): void {
    this.taskService.getTask().subscribe(data => {
      let allTasks = data
        ? Object.keys(data).map(key => ({
            id: key,
            ...data[key]
          }))
        : [];

      if (this.currentUser && this.currentUser.role !== 'admin' && this.currentUser.role !== 'accountmanager') {
        this.tasks = allTasks.filter(task => task.assignedToEmail === this.currentUser.email);
      } else {
        this.tasks = allTasks;
      }

      this.applyFilters();
    });
  }

  deleteTask(id: string, index: number): void {
    const removedTask = this.tasks.splice(index, 1)[0];

    this.taskService.deleteTask(id).subscribe({
      next: () => {
        console.log(`Task with ID ${id} has been deleted`);
        this.fetchTasks(); // Re-fetch the tasks
      },
      error: error => {
        console.error('Error deleting task:', error);
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
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = direction;
    }

    this.applySorting();
  }

  toggleFilter(): void {
    this.showFilterOptions = !this.showFilterOptions;
  }

  applyFilters(): void {
    this.sortedTasks = this.tasks.filter(task => {
      return (
        (!this.statusFilter || task.status === this.statusFilter) &&
        (!this.priorityFilter || task.priority === this.priorityFilter) &&
        (!this.dueDateFilter || new Date(task.dueDate).toISOString().split('T')[0] === this.dueDateFilter) &&
        (!this.searchTerm || this.isSearchMatch(task))
      );
    });

    this.applySorting();
  }

  applySorting(): void {
    this.sortedTasks.sort((a, b) => {
      let comparison = 0;

      if (this.sortField === 'dueDate') {
        comparison = new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      } else if (this.sortField === 'priority') {
        const priorities = ['Low', 'Medium', 'High'];
        comparison = priorities.indexOf(a.priority) - priorities.indexOf(b.priority);
      } else if (this.sortField === 'status') {
        const statuses = ['Not Started', 'In Progress', 'Completed'];
        comparison = statuses.indexOf(a.status) - statuses.indexOf(b.status);
      }

      return this.sortDirection === 'asc' ? comparison : -comparison;
    });
  }

  isSearchMatch(task: any): boolean {
    const term = this.searchTerm.toLowerCase();
    
    return (
      task.clientName.toLowerCase().includes(term) ||
      task.taskTitle.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term) ||
      task.assignedTo.toLowerCase().includes(term)
    );
  }

  highlightText(text: string): string {
    if (!this.searchTerm) {
      return text;
    }
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }

  onSearchClick(): void {
    this.applyFilters();
  }
}
