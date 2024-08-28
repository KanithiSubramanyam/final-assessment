import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, Validators } from '@angular/forms';
import { TaskService } from '../../../../Services/task.service';
import { AuthService } from '../../../../Services/auth.service';
import { UserService } from '../../../../Services/userService.service';
import { userDetails } from '../../../../Model/userDetails';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-task',
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  isEditMode: boolean = false;
  editingtask: any = null;
  currentTask: any; // To hold the current task data
  users: userDetails[] = [];
  filteredUsers: userDetails[] = [];
  searchTerm: string = '';
  selectedUser: userDetails | null = null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.addTaskForm = this.fb.group({
      clientName: ['', Validators.required],
      taskTitle: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      priority: ['', Validators.required],
      status: ['', Validators.required],
      assignedTo: ['', Validators.required],
      assignedToEmail: ['']
    });
  }

  ngOnInit(): void {
    if (history.state.task) {
      this.currentTask = history.state.task;
      console.log('Received appointment:', this.currentTask);
    }

    if (this.currentTask) {
      this.editingtask = this.currentTask;
      this.isEditMode = true;
      this.addTaskForm.patchValue(this.editingtask);
    }
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        this.users = Object.values(users).filter(user => user.role === 'user');
        this.filteredUsers = this.users; // Initially, all users are displayed
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  onSearchTermChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterUsers();
  }

  selectUser(user: userDetails): void {
    this.selectedUser = user;
    this.addTaskForm.get('assignedTo')?.setValue(user.email);
    this.addTaskForm.get('assignedToEmail')?.setValue(user.email);
    this.searchTerm = ''; // Clear the search term after selecting a user
    this.filteredUsers = this.users; // Reset the user list
  }

  onSubmit(): void {
    if (this.addTaskForm.valid) {
      if (this.isEditMode && this.editingtask) {
        this.taskService.updateTask(this.editingtask.id, this.addTaskForm.value).subscribe(response => {
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
