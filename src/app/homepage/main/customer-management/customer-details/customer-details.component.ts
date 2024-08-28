import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-customer-details',
  imports: [CommonModule, RouterModule],
  standalone: true,
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.css']
})
export class CustomerDetailsComponent implements OnInit {
  customer: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.customer = history.state.customer; // Capture the passed customer data from router state
    console.log('Customer Details:', this.customer);
  }
}
