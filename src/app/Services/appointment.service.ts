import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Appointment {
  customerName: string;
  phoneNumber: string;
  email: string;
  date: string;
  time: string;
  purpose: string;
}

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {
  private appointmentsSource = new BehaviorSubject<Appointment[]>([]);
  appointments$ = this.appointmentsSource.asObservable();

  constructor() { }

  addAppointment(appointment: Appointment) {
    const currentAppointments = this.appointmentsSource.value;
    this.appointmentsSource.next([...currentAppointments, appointment]);
  }
}
