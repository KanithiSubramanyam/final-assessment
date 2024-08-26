import { Component,Input } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormGroup,Validators } from '@angular/forms';
import { AppointmentService } from '../../../../Services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './schedule.component.html',
  styleUrl: './schedule.component.css'
})
export class ScheduleComponent {
  scheduleForm: FormGroup;
  editingAppointment: any = null;
  @Input() isEditMode: boolean = false;

  constructor(private fb: FormBuilder,
    private appointmentService: AppointmentService,
    private router:Router ) { }

  ngOnInit(): void {
    this.scheduleForm = this.fb.group({
      customerName: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\d{10}$/)]],
      email: ['', [Validators.required, Validators.email]],
      appointmentDate: ['', Validators.required],
      appointmentTime: ['', Validators.required],
      purpose: ['', Validators.required]
    });
     // Retrieve appointment data from navigation state
     const navigation = this.router.getCurrentNavigation();
     if (navigation?.extras?.state?.['appointment']) {
       const appointment = navigation.extras.state['appointment'];
       console.log('Navigated appointment data:', appointment); // Debugging line
 
       if (appointment) {
         this.isEditMode = true;
         this.scheduleForm.patchValue(appointment);
       } else {
         console.log('No appointment data found');
       }
     } else {
       console.log('No appointment data found');
     }
   }
 
   onSubmit(): void {
     if (this.isEditMode) {
       // Update existing appointment
       this.appointmentService.updateAppointment(this.scheduleForm.value.id, this.scheduleForm.value).subscribe(response => {
         console.log('Appointment updated successfully', response);
         this.router.navigate(['/appointmentManagement/view']);
       });
     } else {
       // Save new appointment
       this.appointmentService.saveAppointment(this.scheduleForm.value).subscribe(response => {
         console.log('Appointment saved successfully', response);
         this.scheduleForm.reset();
         this.router.navigate(['/appointmentManagement/view']);
       });
     }
   }
    
   
  


 
}
