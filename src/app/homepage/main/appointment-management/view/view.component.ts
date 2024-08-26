import { Component, OnInit,inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService} from '../../../../Services/appointment.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
  appointments: any[] = [];
  router:Router=inject(Router)
 

  constructor(private appointmentService: AppointmentService) {}

   ngOnInit(): void {

    this.fetchAppointments();
  
   }


   fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      this.appointments = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      console.log(this.appointments);
    });
  }

  deleteAppointment(id: string, index: number): void {
    this.appointmentService.deleteAppointment(id).subscribe(() => {
      // Remove the task from the local tasks array
      this.appointments.splice(index, 1);
      console.log(`Task with ID ${id} has been deleted`);
    });
  }

 
  editAppointment(appointment: any): void {
    console.log('Editing appointment:', appointment); // Debugging line
    this.router.navigate(['/appointmentManagement/schedule'], { state: { appointment, isEditMode: true } });

  }
  

}
