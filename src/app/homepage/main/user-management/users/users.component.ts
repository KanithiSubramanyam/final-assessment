import { Component, inject, OnInit } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../../Model/User';
import { UserService } from '../../../../Services/userService.service';
import { AuthService } from '../../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { userDetails } from '../../../../Model/userDetails';
import { SortingService } from '../../../../utilities/sorting.service';
import { FormsModule,ReactiveFormsModule } from '@angular/forms';
@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AddUserComponent, RouterLink, CommonModule, RouterLink,FormsModule,ReactiveFormsModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit {
  
  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  sortingService: SortingService = inject(SortingService);
  
  users: userDetails[] = [];
  filteredUsers: userDetails[] = [];
  sortField: string = '';
  sortAscending: boolean = true;
  searchTerm: string = '';


  currentPage: number = 1;
  itemsPerPage: number = 10;
  totalPages: number = 1;

ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = Object.values(res); 
        console.log(this.users)
        this.filteredUsers = [...this.users]; // Initialize filtered users with all users
        this.calculateTotalPages();
        this.updatePagedUsers();
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  deleteAccount(user: userDetails) {
    const token = this.authService.getToken();
    this.authService.deleteAccount(user.id, token).subscribe({
      next: (res) => {
        console.log(res);
        this.users = this.users.filter(u => u.id !== user.id);
        this.filterUsers(); // Reapply filter after deletion
      },
      error: (err) => {
        console.log(err);
      }
    });
  }

  sortBy(field: string) {
    this.sortAscending = this.sortField === field ? !this.sortAscending : true;
    this.sortField = field;
    const direction: 'asc' | 'desc' = this.sortAscending ? 'asc' : 'desc';
    this.filteredUsers = this.sortingService.sortByField(this.filteredUsers, field, direction);
  }

  filterUsers() {
    if (!this.searchTerm) {
      this.filteredUsers = [...this.users];
    } else {
      const lowerSearchTerm = this.searchTerm.toLowerCase();
      this.filteredUsers = this.users.filter(user =>
        user.firstName.toLowerCase().includes(lowerSearchTerm) ||
        user.lastName.toLowerCase().includes(lowerSearchTerm) ||
        user.email.toLowerCase().includes(lowerSearchTerm)
      );
    }
    this.calculateTotalPages();
    this.setPage(1);  // Reset to first page after filtering
  }

  highlightText(text: string): string {
    if (!this.searchTerm) {
      return text;
    }
    const regex = new RegExp(`(${this.searchTerm})`, 'gi');
    return text.replace(regex, `<mark>$1</mark>`);
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredUsers.length / this.itemsPerPage);
  }

  setPage(page: number): void {
    if (page < 1 || page > this.totalPages) {
      return;
    }
    this.currentPage = page;
    this.updatePagedUsers();
  }

  get pagesToShow(): number[] {
    const pages: number[] = [];
    const startPage = Math.max(1, this.currentPage - 2);
    const endPage = Math.min(this.totalPages, this.currentPage + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  updatePagedUsers(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    this.filteredUsers = this.users.slice(startIndex, startIndex + this.itemsPerPage);
  }

}
