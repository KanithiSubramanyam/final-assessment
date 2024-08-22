
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;

  constructor(private fb: FormBuilder, private router: Router) {
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
      // Simulate task creation
      console.log('Task Created:', this.addTaskForm.value);
      
      // Navigate to the task list or another route after successful sumission
      this.router.navigate(['/taskManagement']);  // Adjust the route as necessary
    } else {
      // Mark all fields as touched to show validation errors
      this.addTaskForm.markAllAsTouched();
    }
  }
}
