import { Component } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AppointmentService } from '../../../../Services/appointment.service';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  scheduleForm: FormGroup;

  constructor(private fb: FormBuilder,private appointmentService: AppointmentService) { }

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      customerName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      purpose: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.scheduleForm.valid) {
      this.appointmentService.addAppointment(this.scheduleForm.value);
      this.scheduleForm.reset();
    }
  }
 
}
