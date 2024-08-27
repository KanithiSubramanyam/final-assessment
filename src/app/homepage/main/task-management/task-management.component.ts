import { Component } from '@angular/core';
import { RouterLink ,Router} from '@angular/router';
import { TaskService } from '../../../Services/task.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [RouterLink,CommonModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent {

  tasks: any[] = [];
  sortedTasks: any[] = [];
  currentTask: any;
  
 

  constructor(private taskService:TaskService, private router: Router) {}

   ngOnInit(): void {

    this.fetchTasks();
    
 // Perform the default sort when the component initializes
    this.sortTasksBy(this.sortField);
  
   }


   fetchTasks(): void {
    this.taskService.getTask().subscribe(data => {
      this.tasks = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      console.log(this.tasks);
      this.sortedTasks = [...this.tasks]; 
    });
  }

  // deleteTask(id: string, index: number): void {
  //   this.taskService.deleteTask(id).subscribe(() => {
  //     // Remove the task from the local tasks array
  //     this.tasks.splice(index, 1);
  //     console.log(`Task with ID ${id} has been deleted`);
  //   });
  // }
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
  
  

  OnEditTaskClicked(task){
  
 
    this.router.navigate(['/taskManagement/addtask'], { state: { task } });
  }

  onViewTaskClicked(task: any): void {
    this.router.navigate(['/taskManagement/taskDetails'], { state: { task } });
  }
 

// Set the default sorting field and direction
sortField: string = 'dueDate'; // Default sorting field
sortDirection: string = 'asc'; // Default sorting direction


 

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