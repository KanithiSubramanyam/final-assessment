import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Customer } from '../Model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/customerrecords.json'; // Updated API URL

  constructor(private http: HttpClient) {}

  // Fetch all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<{ [key: string]: Customer }>(this.apiUrl).pipe(
      map(response => {
        return Object.values(response); // Convert object to array
      })
    );
  }

  // Save a new customer
  saveCustomer(customerData: Customer): Observable<any> {
    return this.http.post(this.apiUrl, customerData);
  }

  // Fetch a single customer by ID
  getCustomers(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}.json`);
  }

  // Delete a customer by ID
  deleteCustomer(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}.json`);
  }

  // Update a customer by ID
  updateCustomer(id: string, customerData: Customer): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}.json`, customerData);
  }
}
