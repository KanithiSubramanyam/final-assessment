import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AddTaskComponent } from './add-task/add-task.component';


@Component({
  selector: 'app-task-management',
  standalone: true,
  imports: [RouterLink,AddTaskComponent],
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css'
})
export class TaskManagementComponent {

}
