import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-task-details',
  imports: [CommonModule, RouterModule],
  standalone:true,
  templateUrl: './task-details.component.html',
  styleUrls: ['./task-details.component.css']
})
export class TaskDetailsComponent implements OnInit {
  task: any;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.task = history.state.task; // Capture the passed task data from router state
    console.log('Task Details:', this.task);
  }
}
