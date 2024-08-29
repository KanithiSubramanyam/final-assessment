import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../../Services/appointment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Task } from '../../../../Model/task';
import { TaskService } from '../../../../Services/task.service';
import { userDetails } from '../../../../Model/userDetails';
import { UserService } from '../../../../Services/userService.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent implements OnInit {
  scheduleForm: FormGroup;
  editingAppointment: any = null;
  isEditMode: boolean = false;

  assignedTasks: Task[] = [];
  currentUser: userDetails;
  selectedTask: Task;

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
      description: [''],
      startDateTime: ['', [Validators.required]],
      endDateTime: ['', [Validators.required]],
      location: [''],
      attendees: [''],
      recurrence: ['None'],
      customer: ['', Validators.required]
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




  
  // if (this.assignedTasks.length > 0) {
  //   // Select the first task as default, or add logic to select specific task
  //   this.selectedTask = this.assignedTasks[0];

  //   // Prepopulate the customer field with the customer's name from the selected task
  //   this.scheduleForm.patchValue({
  //     customer: this.selectedTask.clientName
  //   });

  //   // Set up date pickers constraints
  //   this.setupDateConstraints();
  // }


  fetchAssignedTasks(): void {
    this.taskService.getTask().subscribe(tasks => {
      if (tasks) {
        const allTasks = Object.keys(tasks).map(key => ({
          id: key,
          ...tasks[key]
        }));
        // Filter tasks assigned to the current user
        this.assignedTasks = allTasks.filter(task => task.assignedToEmail === this.currentUser?.email);
      }
    });
  }

  onTaskChange(event: any): void {
    const selectedCustomer = event.target.value;
    this.selectedTask = this.assignedTasks.find(task => task.clientName === selectedCustomer) || null;

    if (this.selectedTask) {
      // Prepopulate the customer field with the customer's name from the selected task
      this.scheduleForm.patchValue({
        customer: this.selectedTask.clientName
      });

      // Set up date pickers constraints
      this.setupDateConstraints();
    }
  }

  setupDateConstraints(): void {
    const currentDate = new Date().toISOString().split('T')[0];
    const dueDate = new Date(this.selectedTask.dueDate).toISOString().split('T')[0];

    const startDateInput = document.getElementById('startDateTime') as HTMLInputElement;
    const endDateInput = document.getElementById('endDateTime') as HTMLInputElement;

    startDateInput.min = currentDate;
    startDateInput.max = dueDate;

    endDateInput.min = currentDate;
    endDateInput.max = dueDate;
  }

  onSubmit(): void {
    if (this.isEditMode && this.editingAppointment) {
      this.appointmentService.updateAppointment(this.editingAppointment.id, this.scheduleForm.value).subscribe(response => {
        this.sendEmailNotification(); // Call this function to send email
        this.router.navigate(['/appointmentManagement/view']);
      });
    } else {
      this.appointmentService.saveAppointment(this.scheduleForm.value).subscribe(response => {
        this.sendEmailNotification(); // Call this function to send email
        this.scheduleForm.reset();
        this.router.navigate(['/appointmentManagement/view']);
      });
    }
  }

  sendEmailNotification(): void {
    // const emailData = {
    //   to: this.selectedTask.clientEmail, // Assuming you have client email in the selectedTask
    //   subject: 'Appointment Scheduled',
    //   body: `Dear ${this.selectedTask.clientName}, you have an appointment scheduled on ${this.scheduleForm.value.startDateTime}. Details: ${this.scheduleForm.value.description}`
    // };
  
    // // Make an HTTP request to your backend API to send the email
    // this.appointmentService.sendEmail(emailData).subscribe(response => {
    //   console.log('Email sent successfully');
    // });
  }

}
