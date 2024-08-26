import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';
import { TaskService } from '../../../Services/task.service';
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [RouterLink,AddTaskComponent,CommonModule],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent {

  tasks: any[] = [];
 

  constructor(private taskService:TaskService) {}

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
    });
  }

  deleteTask(id: string, index: number): void {
    this.taskService.deleteTask(id).subscribe(() => {
      // Remove the task from the local tasks array
      this.tasks.splice(index, 1);
      console.log(`Task with ID ${id} has been deleted`);
    });
  }

  OnEditTaskClicked(id:string){
    this.tasks.find((task)=>{return task.id===id})

  }
 

}
