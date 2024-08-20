import { Component } from '@angular/core';
import { AfterViewInit, ElementRef } from '@angular/core';
import { Tooltip } from 'bootstrap';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {

  /* global bootstrap: false */
  

declare var bootstrap: any;

export class YourComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    const tooltipTriggerList = Array.from(this.elementRef.nativeElement.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.forEach(tooltipTriggerEl => {
      new Tooltip(tooltipTriggerEl, {});
    });
  }
}



}
