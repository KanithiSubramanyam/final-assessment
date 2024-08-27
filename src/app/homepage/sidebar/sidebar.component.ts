import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule } from '@angular/router';
import { Router } from 'express';
import { AuthService } from '../../Services/auth.service';
import { CommonDataService } from '../../utilites/CommonData.service';
import { userDetails } from '../../Model/userDetails';
import { RolesService } from '../../Services/Roles.service';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, RouterModule, RouterLink, RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent {
  isCollapsed: boolean = false;
  userRole: string;
  
  public readonly ADMIN = RolesService.ADMIN;
  public readonly ACCOUNTMANAGER = RolesService.ACCOUNTMANAGER;
  public readonly USER = RolesService.USER;
  
  constructor(
    private commonDataService: CommonDataService,
    private authService: AuthService,
    private rolesService: RolesService
) {
    this.commonDataService.getCurrentUser().subscribe(userDetails => {
        if (userDetails) {
            this.userRole = userDetails.role.toUpperCase();
            console.log('current login user role', this.userRole);
        } else {
            console.log('User role could not be fetched.');
        }
    });
}


  hasRole(role: string): boolean {
    return this.userRole === role;
  }

  hasAnyRole(roles: string[]): boolean {
    return roles.includes(this.userRole);
  }

  onClickSideBarToggle(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  logout() {
    this.authService.logOut();
  }
}
