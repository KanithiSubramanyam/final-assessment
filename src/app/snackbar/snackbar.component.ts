import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'snackbar',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './snackbar.component.html',
  styleUrl: './snackbar.component.css'
})
export class SnackbarComponent {

  @Input() message : string | null;

  @Input() snackbarClass : string | null;

  constructor(){
    // console.log('snackbar called', this.message)
  }

  showSnackbar = true;

  ngOnInit() {
    // Add class to trigger animation
    setTimeout(() => {
      this.showSnackbar = true;
    }, 100); // Delay for animation
  }

  closeSnackbar() {
    this.showSnackbar = false;
    setTimeout(() => {
    }, 300); 
  }

}
