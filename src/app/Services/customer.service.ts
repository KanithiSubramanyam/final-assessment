import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
// import { Customer } from '../Model/customer';
import { Customer } from '../Model/Customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private apiUrl = 'https://final-assessment-1-default-rtdb.asia-southeast1.firebasedatabase.app/customerrecords'; // Base API URL

  constructor(private http: HttpClient) {}

  // Fetch all customers
  getAllCustomers(): Observable<Customer[]> {
    return this.http.get<{ [key: string]: Customer }>(`${this.apiUrl}.json`).pipe(
      map(response => {
        // Convert object to array with Firebase keys as `id`
        return Object.keys(response || {}).map(key => ({
          id: key, 
          ...response[key]
        }));
      })
    );
  }

  // Save a new customer
  saveCustomer(customerData: Customer): Observable<any> {
    return this.http.post(`${this.apiUrl}.json`, customerData);
  }

  // Fetch a single customer by ID (if needed)
  getCustomerById(id: string): Observable<Customer> {
    return this.http.get<Customer>(`${this.apiUrl}/${id}.json`);
  }

  // Delete a customer by ID
  deleteCustomer(id: string): Observable<void> {
    const url = `${this.apiUrl}/${id}.json`;
    return this.http.delete<void>(url);
  }

  // Update a customer by ID
  updateCustomer(id: string, customerData: Customer): Observable<any> {
    const url = `${this.apiUrl}/${id}.json`;
    return this.http.put(url, customerData);
  }
}
