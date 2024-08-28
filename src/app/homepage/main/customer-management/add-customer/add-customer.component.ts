import { Component} from '@angular/core';
import { ReactiveFormsModule,FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomerService } from '../../../../Services/customer.service';

@Component({
  selector: 'app-add-customer',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
  templateUrl: './add-customer.component.html',
  styleUrl: './add-customer.component.css'
})
export class AddCustomerComponent {

  customerForm!: FormGroup;
  isEditMode: boolean = false;
  editingcustomer:any =null;
  currentCustomer: any; // To hold the current task data

  constructor(private fb: FormBuilder,private router:Router,private customerService:CustomerService) {
    this.customerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      address: ['', Validators.required],
      createdDate: ['', Validators.required]
    });

  }

  ngOnInit(): void {

    if (history.state.customer) {
      this.currentCustomer = history.state.customer;
      
      console.log('Received appointment:', this.currentCustomer);
    }

    if (this.currentCustomer){
      this.editingcustomer= this.currentCustomer;
      this.isEditMode=true;
      this.customerForm.patchValue(this.editingcustomer);
    }
  
    
  }

  onSubmit() {
    if (this.customerForm.valid) {
      if (this.isEditMode && this.editingcustomer) {
        this.customerService.updateCustomer(this.editingcustomer.id, this.customerForm.value).subscribe(response => {
          console.log('Customer updated successfully', response);
          this.router.navigate(['/customerManagement']);
        }, error => {
          console.error('Error updating customer:', error);
        });
      } else {
        this.customerService.saveCustomer(this.customerForm.value).subscribe(response => {
          console.log('Customer created successfully', response);
          this.customerForm.reset();
          this.router.navigate(['/customerManagement']);
        }, error => {
          console.error('Error creating customer:', error);
        });
      }
    }
}


}
