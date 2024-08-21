import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Router } from 'express';
import { ProfileComponent } from './profile/profile.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [CommonModule, RouterModule,ProfileComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.css'
})
export class MainComponent {

}
