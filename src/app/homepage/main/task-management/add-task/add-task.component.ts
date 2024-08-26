
// import { Component, OnInit } from '@angular/core';
// import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// import { Router } from '@angular/router';
// import { CommonModule } from '@angular/common';
// import { TaskService } from '../../../../Services/task.service';

// @Component({
//   selector: 'app-add-task',
//   standalone: true,
//   imports: [ReactiveFormsModule, CommonModule],
//   templateUrl: './add-task.component.html',
//   styleUrls: ['./add-task.component.css']
// })
// export class AddTaskComponent implements OnInit {
//   addTaskForm: FormGroup;
//   taskData:any;
//   currentTask: any = null;
//   isEditMode: boolean = false;

//   constructor(private fb: FormBuilder, private router: Router,private taskService:TaskService) {
//     this.addTaskForm = this.fb.group({
//       clientName: ['', Validators.required],
//       taskTitle: ['', Validators.required],
//       description: [''],
//       dueDate: ['', Validators.required],
//       priority: ['', Validators.required],
//       status: ['', Validators.required],
//       assignedTo: ['']
//     });
//   }

//   ngOnInit(): void {
//     if (this.currentTask) {
//       this.isEditMode = true;
//       this.addTaskForm.patchValue(this.currentTask);
//     }

//   }

//   onSubmit(): void {
    
//     if (this.addTaskForm.valid) {
//       this.taskService.saveTask(this.addTaskForm.value).subscribe(response => {
//         console.log('Appointment saved successfully', response);
//         this.addTaskForm.reset();
//         this.router.navigate(['/taskManagement']);
//         // Optionally, navigate to the view appointments page
//       });

//       // const updateData={
//       //   status: this.addTaskForm.get('status')?.value,
//       //   assignedTo: this.addTaskForm.get('assignedTo')?.value,
//       // }
//       // this.taskService.updateUserDetails(updateData).subscribe(
//       //   response => {
//       //     // console.log('User details updated successfully:', response);
//       //   },
//       //   error => {
//       //     console.error('Error updating user details:', error);
//       //   }
//       // )
//     }
//   }
// }


// // import { Component, OnInit } from '@angular/core';
// // import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
// // import { Router, ActivatedRoute } from '@angular/router';
// // import { CommonModule } from '@angular/common';
// // import { TaskService } from '../../../../Services/task.service';

// // @Component({
// //   selector: 'app-add-task',
// //   standalone: true,
// //   imports: [ReactiveFormsModule, CommonModule],
// //   templateUrl: './add-task.component.html',
// //   styleUrls: ['./add-task.component.css']
// // })
// // export class AddTaskComponent implements OnInit {
// //   addTaskForm: FormGroup;
// //   isEditMode: boolean = false;
// //   taskId: string | null = null;

// //   constructor(
// //     private fb: FormBuilder,
// //     private router: Router,
// //     private route: ActivatedRoute,
// //     private taskService: TaskService
// //   ) {
// //     this.addTaskForm = this.fb.group({
// //       clientName: ['', Validators.required],
// //       taskTitle: ['', Validators.required],
// //       description: [''],
// //       dueDate: ['', Validators.required],
// //       priority: ['', Validators.required],
// //       status: ['', Validators.required],
// //       assignedTo: ['']
// //     });
// //   }

// //   ngOnInit(): void {
// //     this.route.paramMap.subscribe(params => {
// //       this.taskId = params.get('id');
// //       if (this.taskId) {
// //         this.isEditMode = true;
// //         this.loadTask(this.taskId);
// //       }
// //     });
// //   }

// //   loadTask(id: string): void {
// //     this.taskService.getTaskById(id).subscribe(task => {
// //       this.addTaskForm.patchValue(task);
// //     }, error => {
// //       console.error('Error loading task:', error);
// //     });
// //   }

// //   onSubmit(): void {
// //     if (this.addTaskForm.valid) {
// //       if (this.isEditMode && this.taskId) {
// //         this.taskService.updateTask(this.taskId, this.addTaskForm.value).subscribe(response => {
// //           console.log('Task updated successfully', response);
// //           this.router.navigate(['/taskManagement']);
// //         }, error => {
// //           console.error('Error updating task:', error);
// //         });
// //       } else {
// //         this.taskService.createTask(this.addTaskForm.value).subscribe(response => {
// //           console.log('Task created successfully', response);
// //           this.addTaskForm.reset();
// //           this.router.navigate(['/taskManagement']);
// //         }, error => {
// //           console.error('Error creating task:', error);
// //         });
// //       }
// //     }
// //   }
// // }
// add-task.component.ts
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskService } from '../../../../Services/task.service';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  standalone: true,
  imports:[ReactiveFormsModule,CommonModule],
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  isEditMode: boolean = false;
  taskId: string | null = null;
  currentTask: any = null; // To hold the current task data

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService
  ) {
    this.addTaskForm = this.fb.group({
      clientName: ['', Validators.required],
      taskTitle: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['']
    });
  }

  ngOnInit(): void {
    // Assume there's a way to get currentTask from the parent or routing params
    // For example, you could use a shared state or route parameters
    if (this.currentTask) {
      this.isEditMode = true;
      this.addTaskForm.patchValue(this.currentTask);
    }
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      if (this.isEditMode && this.taskId) {
        this.taskService.updateTask(this.taskId, this.addTaskForm.value).subscribe(response => {
          console.log('Task updated successfully', response);
          this.router.navigate(['/taskManagement']);
        }, error => {
          console.error('Error updating task:', error);
        });
      } else {
        this.taskService.saveTask(this.addTaskForm.value).subscribe(response => {
          console.log('Task created successfully', response);
          this.addTaskForm.reset();
          this.router.navigate(['/taskManagement']);
        }, error => {
          console.error('Error creating task:', error);
        });
      }
    }
  }
}
