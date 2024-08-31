import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../../Services/appointment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../Model/task';
import { TaskService } from '../../../../Services/task.service';
import { userDetails } from '../../../../Model/userDetails';
import { UserService } from '../../../../Services/userService.service';
import { Customer } from '../../../../Model/customer';
import { SnackbarComponent } from '../../../../snackbar/snackbar.component';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, SnackbarComponent],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  editingAppointment: any = null;
  isEditMode: boolean = false;

  assignedTasks: Task[] = [];
  currentUser: userDetails;
  selectedTask: Task | null = null;

  selectedCustomer: Customer | null = null;
  customers: any[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm = '';

  message: string
  snackbarClass: string

  recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];

  constructor(
    private fb: FormBuilder, 
    private appointmentService: AppointmentService, 
    private router: Router,
    private taskService: TaskService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      title: ['', Validators.required],
      description: ['',Validators.required],
      startDateTime: ['', [Validators.required]],
      endDateTime: ['', [Validators.required]],
      location: ['',Validators.required],
      attendees: [''],
      recurrence: ['None'],
      customer: ['', Validators.required],
      customerEmail: [''],
      userName : [''],
      userEmail : [''],
    });

    if (history.state.appointment) {
      this.editingAppointment = history.state.appointment;
      this.isEditMode = true;
      this.scheduleForm.patchValue(this.editingAppointment);
    }


    this.userService.getCurrentUser().subscribe(userDetails => {
      if (userDetails) {
        this.currentUser = userDetails;
        this.fetchAssignedTasks();
      } else {
        console.log('User details could not be fetched.');
      }
    });
  }

  fetchAssignedTasks(): void {
    this.taskService.getTask().subscribe(tasks => {
      if (tasks) {
        const allTasks = Object.keys(tasks).map(key => ({
          id: key,
          ...tasks[key]
        }));
        this.assignedTasks = allTasks.filter(task => task.assignedToEmail === this.currentUser?.email);
        
        // Extract unique customers from assigned tasks
        const uniqueCustomers = this.assignedTasks.map(task => ({
          firstName: task.clientName.split(' ')[0],
          lastName: task.clientName.split(' ').slice(1).join(' '),
          email: task.clientToEmail
        }));

        this.customers = uniqueCustomers;
        this.filteredCustomers = this.customers;
      }
    });
  }

  onSearchTermChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTerm = input.value.toLowerCase();
    this.filteredCustomers = this.customers.filter(customer => 
      customer.firstName.toLowerCase().includes(this.searchTerm) || 
      customer.lastName.toLowerCase().includes(this.searchTerm) ||
      customer.email.toLowerCase().includes(this.searchTerm)
    );
  }

  selectCustomer(customer: Customer): void {
    this.selectedCustomer = customer;
    this.scheduleForm.get('customer')?.setValue(customer.firstName + ' ' + customer.lastName);
    this.scheduleForm.get('customerEmail')?.setValue(customer.email);
    this.scheduleForm.get('userName')?.setValue(this.currentUser.firstName + ' ' + this.currentUser.lastName);
    this.scheduleForm.get('userEmail')?.setValue(this.currentUser.email);
    // Find the task related to this customer
    this.selectedTask = this.assignedTasks.find(task => task.clientToEmail === customer.email) || null;

    if (this.selectedTask) {
      this.setupDateConstraints();
    }
  }

  setupDateConstraints(): void {
    const currentDate = new Date().toISOString().split('T')[0];
    const dueDate = this.selectedTask ? new Date(this.selectedTask.dueDate).toISOString().split('T')[0] : currentDate;

    const startDateInput = document.getElementById('startDateTime') as HTMLInputElement;
    const endDateInput = document.getElementById('endDateTime') as HTMLInputElement;

    startDateInput.min = currentDate;
    startDateInput.max = dueDate;

    endDateInput.min = currentDate;
    endDateInput.max = dueDate;
  }

  onSubmit(): void {
    if (this.isEditMode && this.editingAppointment) {
      this.appointmentService.updateAppointment(this.editingAppointment.id, this.scheduleForm.value).subscribe(() => {
        this.sendEmailNotification();
        this.message = 'Appointment updated Successful !!';
        this.snackbarClass = 'alert-success';
        setTimeout(() => {
          this.message = '';
          this.snackbarClass = '';
        }, 3000);
        this.router.navigate(['/appointmentManagement/view']);
      },
      (error) => {
        this.message = error;
        this.snackbarClass = 'alert-danger';
        setTimeout(() => {
          this.message = '';
          this.snackbarClass = '';
        }, 3000);      
      }); 
    
    } else {
      this.appointmentService.saveAppointment(this.scheduleForm.value).subscribe(() => {
        this.sendEmailNotification();
        this.message = 'Appointment created Successful !!';
        this.snackbarClass = 'alert-success';
        setTimeout(() => {
          this.message = '';
          this.snackbarClass = '';
        }, 3000);
        this.scheduleForm.reset();
        this.router.navigate(['/appointmentManagement/view']);
      },
    (error) => {
      this.message = error;
      this.snackbarClass = 'alert-danger';
      setTimeout(() => {
        this.message = '';
        this.snackbarClass = '';
      }, 3000);      
    });
    }
  }

  sendEmailNotification(): void {
    // Implement your email notification logic here
  }
}
