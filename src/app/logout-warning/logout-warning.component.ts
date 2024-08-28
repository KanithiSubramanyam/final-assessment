import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { AuthService } from '../Services/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logout-warning',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './logout-warning.component.html',
  styleUrl: './logout-warning.component.css'
})
export class LogoutWarningComponent {

  @ViewChild('modalButton') modalButton!: ElementRef<HTMLButtonElement>;

  @Input() isVisible = false;
  @Output() extendSession = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();

  onExtendSession() {
    this.close();
    this.extendSession.emit();
  }

  onLogout() {
    this.logout.emit();
    this.close();
  }

  close() {
    this.isVisible = false;
  }

  open() {
    console.log('open');
    this.isVisible = true;
    // Trigger the button click
    if (this.modalButton) {
      this.modalButton.nativeElement.click();
    }
  }
}
