import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../../Services/auth.service';


@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed: boolean = false;

  authService: AuthService = inject(AuthService)

    onClickSideBarToggle(): void {
      this.isCollapsed = !this.isCollapsed;
  }

  logout(){
    this.authService.logOut();
  }



}
