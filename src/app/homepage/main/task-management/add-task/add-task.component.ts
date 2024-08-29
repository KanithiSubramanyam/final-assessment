import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TaskService } from '../../../../Services/task.service';
import { AuthService } from '../../../../Services/auth.service';
import { UserService } from '../../../../Services/userService.service';
import { CustomerService } from '../../../../Services/customer.service';
import { userDetails } from '../../../../Model/userDetails';
import { Customer } from '../../../../Model/customer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-task',
  templateUrl: './add-task.component.html',
  standalone: true,
  imports:[CommonModule, FormsModule, ReactiveFormsModule],
  styleUrls: ['./add-task.component.css']
})
export class AddTaskComponent implements OnInit {
  addTaskForm: FormGroup;
  isEditMode: boolean = false;
  editingtask: any = null;
  currentTask: any;
  users: userDetails[] = [];
  filteredUsers: userDetails[] = [];
  customers: Customer[] = [];
  filteredClients: Customer[] = [];
  selectedUser: userDetails | null = null;
  selectedClient: Customer | null = null;
  searchTerm: string = '';
  clientSearchTerm: string = '';

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private taskService: TaskService,
    private authService: AuthService,
    private userService: UserService,
    private customerService: CustomerService
  ) {
    this.addTaskForm = this.fb.group({
      clientName: ['', Validators.required],
      clientToEmail: [''],
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
      console.log('Received task:', this.currentTask);
    }

    if (this.currentTask) {
      this.editingtask = this.currentTask;
      this.isEditMode = true;
      this.addTaskForm.patchValue(this.editingtask);
    }

    this.fetchUsers();
    this.fetchCustomers();  // Fetch customers on initialization
  }

  fetchUsers(): void {
    this.userService.getAllUsers().subscribe(
      (users) => {
        console.log('Fetched users:', users);
        this.users = Object.values(users).filter(user => user.role === 'user');
        this.filteredUsers = this.users;
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  }

  fetchCustomers(): void {
  this.customerService.getAllCustomers().subscribe(
    (customersObject) => {
      this.customers = Object.values(customersObject);
      this.filteredClients = this.customers;
    },
    (error) => {
      console.error('Error fetching customers:', error);
    }
  );
}


  onClientSearchTermChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.clientSearchTerm = input.value;
    this.filterClients();
  }

  filterClients(): void {
    this.filteredClients = this.customers.filter(client =>
      `${client.firstName} ${client.lastName}`.toLowerCase().includes(this.clientSearchTerm.toLowerCase()) ||
      client.email.toLowerCase().includes(this.clientSearchTerm.toLowerCase())
    );
  }

  selectClient(client: Customer): void {
    this.selectedClient = client;
    this.addTaskForm.get('clientName')?.setValue(client.firstName + ' ' + client.lastName);
    this.addTaskForm.get('clientToEmail')?.setValue(client.email);
    this.clientSearchTerm = '';
    this.filteredClients = this.customers;
  }

  onSearchTermChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value;
    this.filterUsers();
  }

  filterUsers(): void {
    this.filteredUsers = this.users.filter(user =>
      `${user.firstName} ${user.lastName}`.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(this.searchTerm.toLowerCase())
    );
  }

  selectUser(user: userDetails): void {
    this.selectedUser = user;
    this.addTaskForm.get('assignedTo')?.setValue(user.firstName + ' ' + user.lastName);
    this.addTaskForm.get('assignedToEmail')?.setValue(user.email);
    this.searchTerm = '';
    this.filteredUsers = this.users;
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
