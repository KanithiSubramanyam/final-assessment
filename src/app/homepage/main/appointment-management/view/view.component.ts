import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AppointmentService } from '../../../../Services/appointment.service';
import { userDetails } from '../../../../Model/userDetails';
import { UserService } from '../../../../Services/userService.service';
import { Appointment } from '../../../../Model/Appointment';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit {
  appointments: Appointment[] = [];
  currentUser: userDetails;


  constructor(private appointmentService: AppointmentService, private router: Router,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.userService.getCurrentUser().subscribe(userDetails => {
      if (userDetails) {
        this.currentUser = userDetails;
        this.fetchAppointments();
      } else {
        console.log('User details could not be fetched.');
      }
    });
  }

  fetchAppointments(): void {
    this.appointmentService.getAppointments().subscribe(data => {
      if (data) {
        const allApointments = Object.keys(data).map(key => ({
          id: key,
          ...data[key]
        }));
        if (this.currentUser && this.currentUser.role !== 'admin' && this.currentUser.role !== 'accountmanager') {
          this.appointments = allApointments.filter(appointment => appointment.userEmail === this.currentUser?.email);
        }
        else{
          this.appointments = allApointments;
        }
        console.log('appointments', this.appointments);
      }
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
    this.router.navigate(['/appointmentManagement/schedule'], { state: { appointment } });
  }
}
