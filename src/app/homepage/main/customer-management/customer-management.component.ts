import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CustomerService } from '../../../Services/customer.service';
import { Customer } from '../../../Model/Customer';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'customer-management',
  standalone: true,
  imports: [CommonModule, RouterLink,FormsModule],
  templateUrl: './customer-management.component.html',
  styleUrls: ['./customer-management.component.css']  // Corrected from `styleUrl` to `styleUrls`
})
export class CustomerManagementComponent implements OnInit {
  customers: Customer[] = [];
  filteredCustomers: Customer[] = [];
  searchTerm: string = '';

  constructor(private customerService: CustomerService, private router: Router) {}

  ngOnInit(): void {
    this.fetchCustomers();
  }

  fetchCustomers(): void {
    this.customerService.getAllCustomers().subscribe(data => {
      this.customers = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      this.filteredCustomers = [...this.customers];  // Initialize filteredCustomers
    });
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
        console.log(`Customer with ID ${id} has been deleted`);
      },
      error: (error) => {
        console.error('Error deleting customer:', error);
        this.customers.splice(index, 0, removedCustomer);
      }
    });
  }
}
