
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { TaskService } from '../../../../Services/task.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router,private taskService:TaskService) {
    this.addTaskForm = this.fb.group({
      taskTitle: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    
    if (this.addTaskForm.valid) {
      this.taskService.saveTask(this.addTaskForm.value).subscribe(response => {
        console.log('Appointment saved successfully', response);
        this.addTaskForm.reset();
        this.router.navigate(['/taskManagement']);
        // Optionally, navigate to the view appointments page
      });
    }
  }
}
