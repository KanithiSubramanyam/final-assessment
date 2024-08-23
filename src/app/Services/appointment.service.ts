import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppointmentService {

  private apiUrl ='https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/appointments.json'; // Mock API URL

  constructor(private http: HttpClient) {}

  saveAppointment(appointmentData: any): Observable<any> {
    return this.http.post(this.apiUrl, appointmentData);
  }

  getAppointments(): Observable<any> {
    return this.http.get(this.apiUrl);
  }
}
