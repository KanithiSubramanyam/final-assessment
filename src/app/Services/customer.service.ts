import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private apiUrl ='https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/customerrecords'; // Mock API URL

  constructor(private http: HttpClient) {}

  saveCustomer(customerData: any): Observable<any> {
    return this.http.post(`${this.apiUrl}.json`,customerData);
  }

  getCustomers(): Observable<any> {
    return this.http.get(`${this.apiUrl}.json`);
  }

  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`);
  }
  updateCustomer(id: string, customerData: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}.json`, customerData);
  }
}
