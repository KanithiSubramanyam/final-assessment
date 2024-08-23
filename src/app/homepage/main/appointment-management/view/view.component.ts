import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { AppointmentService,Appointment } from '../../../../Services/appointment.service';

@Component({
  selector: 'app-view',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './view.component.html',
  styleUrl: './view.component.css'
})
export class ViewComponent implements OnInit{
 
  appointments: Appointment[] = [];

  constructor(private appointmentService: AppointmentService) {}

  ngOnInit(): void {
    this.appointmentService.appointments$.subscribe(data => {
      this.appointments = data;
    });
  }

}
