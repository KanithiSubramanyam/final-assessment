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
 
  sortTasksBy(field: string, event: Event): void  {
    const value = (event.target as HTMLSelectElement).value;
    if (value) {
      this.sortedTasks = [...this.tasks];
      this.tasks.sort((a, b) => {
        if (field === 'dueDate') {
          return value === 'asc'
            ? new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
            : new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
        } else if (field === 'priority') {
          const priorities = ['Low', 'Medium', 'High'];
          return value === 'asc'
            ? priorities.indexOf(a.priority) - priorities.indexOf(b.priority)
            : priorities.indexOf(b.priority) - priorities.indexOf(a.priority);
        } else if (field === 'status') {
          return value === 'asc'
            ? a.status.localeCompare(b.status)
            : b.status.localeCompare(a.status);
        }
        return 0;
      });
  }
  else {
    this.sortedTasks = [...this.tasks]; // Reset to the original order if no sorting is selected
  }

}
}
