import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CustomerService } from '../../../Services/customer.service';
import { Customer } from '../../../Model/Customer';
import { FormsModule } from '@angular/forms';
import { SnackbarComponent } from '../../../snackbar/snackbar.component';
import { SortingService } from '../../../utilities/sorting.service';

@Component({
  selector: 'customer-management',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule, SnackbarComponent],
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']  // Corrected from `styleUrl` to `styleUrls`
})
export class CustomerManagementComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';
  message: string = ''
  snackbarClass: string = '';
  sortField: string = 'firstName'; 
  sortDirection: 'asc' | 'desc' = 'asc'; 


  constructor(private customerService: CustomerService, private router: Router,private sortingService:SortingService) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customers = Object.keys(data).map(key => ({
        id: key,  // Preserve the key as the customer ID
        ...data[key]
      }));
      this.filteredCustomers = [...this.customers];  // Initialize filteredCustomers
      this.applyFilter(); 
      this.applySorting();
    });
  }

  applySorting(): void {
    this.filteredCustomers = this.sortingService.sortByField(
      this.filteredCustomers,
      this.sortField,
      this.sortDirection
    );
  }
  
  applyFilter() {
    if (this.searchTerm) {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.filteredCustomers = this.customers.filter(customer =>
        (customer.firstName?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (customer.lastName?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (customer.email?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (customer.phone?.toLowerCase().includes(lowerSearchTerm) || '') ||
        (customer.address?.toLowerCase().includes(lowerSearchTerm) || '') 
      );
    } else {
      this.filteredCustomers = [...this.customers];
    }
  }

  highlightText(text: string): string {
    if (!this.searchTerm) {
      return text;
    }
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }

  OnEditCustomerClicked(customer: Customer) {
    this.router.navigate(['/customerManagement/addCustomer'], { state: { customer } });
  }

  onViewCustomerClicked(customer: Customer): void {
    this.router.navigate(['/customerManagement/customerDetails'], { state: { customer } });
  }

  OnDeleteCustomerClicked(id: string, index: number): void {
  
    const removedCustomer = this.customers.splice(index, 1)[0];
  
    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
          this.message = 'Customer deleted successfully';
          this.snackbarClass = 'alert-success';
          setTimeout(() => {
            this.message = '';
            this.snackbarClass = '';
          }, 3000);      
        console.log(`Customer with ID ${id} has been deleted`);
        this.fetchCustomers();
  
      },
      error: (error) => {
        this.message = error.message;
        this.snackbarClass = 'alert-danger';
        setTimeout(() => {
          this.message = '';
          this.snackbarClass = '';
        }, 3000);   
        this.customers.splice(index, 0, removedCustomer);  // Revert removal in case of error
      }
    });
  }

  sortCustomers(field: string): void {
    if (this.sortField === field) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortField = field;
      this.sortDirection = 'asc';  // Default to ascending when a new field is selected
    }
    this.applySorting();
  }
  
  
}
