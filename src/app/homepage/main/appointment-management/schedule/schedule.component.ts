import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppointmentService } from '../../../../Services/appointment.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports:[ ReactiveFormsModule,CommonModule ],
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.css']
})
export class ScheduleComponent {
  scheduleForm: FormGroup;
  editingAppointment: any = null;
  isEditMode: boolean = false;

  recurrenceOptions = ['None', 'Daily', 'Weekly', 'Monthly'];
  
  appointment: any;

  constructor(private fb: FormBuilder, private appointmentService: AppointmentService, private router: Router) {}

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDateTime: ['', Validators.required],
      endDateTime: ['', Validators.required],
      location: [''],
      attendees: [''],
      recurrence: ['None'],
      customer: ['', Validators.required]
    });
    if (history.state.appointment) {
      this.appointment = history.state.appointment;
      
      console.log('Received appointment:', this.appointment);
    }

    if (this.appointment) {
      this.editingAppointment = this.appointment;
      this.scheduleForm.patchValue(this.editingAppointment);
    }
  }

  onSubmit(): void {
    if (this.isEditMode && this.editingAppointment) {
      this.appointmentService.updateAppointment(this.editingAppointment.id, this.scheduleForm.value).subscribe(response => {
        this.router.navigate(['/appointmentManagement/view']);
      });
    } else {
      this.appointmentService.saveAppointment(this.scheduleForm.value).subscribe(response => {
        this.scheduleForm.reset();
        this.router.navigate(['/appointmentManagement/view']);
      });
    }
  }
}
