import { Component,OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { CustomerService } from '../../../Services/customer.service';
import { Router } from '@angular/router';

@Component({
  selector: 'customer-management',
  standalone: true,
  imports: [CommonModule,RouterLink],
  templateUrl: './customer-management.component.html',
  styleUrl: './customer-management.component.css'
})
export class CustomerManagementComponent implements OnInit {
  customers: any[] = [];

  constructor(private customerService:CustomerService, private router: Router){}

  ngOnInit(): void {
    this.fetchCustomers(); 
  }

fetchCustomers(): void {
    this.customerService.getCustomers().subscribe(data => {
      this.customers = Object.keys(data).map(key => ({
        id: key,
        ...data[key]
      }));
      console.log(this.customers);  // For debugging, remove or adjust as needed
    });
  }

  OnEditCustomerClicked(customer) {
    this.router.navigate(['/customerManagement/addCustomer'], { state: { customer } });
  }

  onViewCustomerClicked(customer: any): void {
    this.router.navigate(['/customerManagement/customerDetails'], { state: { customer} });
  }

  OnDeleteCustomerClicked(id: string, index: number): void {
    // Optimistically remove the customer from the UI
    const removedCustomer = this.customers.splice(index, 1)[0];

    this.customerService.deleteCustomer(id).subscribe({
      next: () => {
        console.log(`Task with ID ${id} has been deleted`);
      },
      error: (error) => {
        console.error('Error deleting task:', error);
        // If there was an error, add the customer back to the list
        this.customers.splice(index, 0, removedCustomer);
      }
    });
  }

}
