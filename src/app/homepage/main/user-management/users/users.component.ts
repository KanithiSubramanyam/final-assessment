import { Component, inject, OnInit } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../../Model/User';
import { UserService } from '../../../../Services/userService.service';
import { AuthService } from '../../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { userDetails } from '../../../../Model/userDetails';
import { SortingService } from '../../../../utilities/sorting.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AddUserComponent, RouterLink, CommonModule, RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  sortingService: SortingService = inject(SortingService);
  
  users: userDetails[] = [];
  sortField: string = '';
  sortAscending: boolean = true; // Ensure this property is declared
  
  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = Object.values(res); 
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
  deleteAccount(user : userDetails){
    const token = this.authService.getToken();
    this.authService.deleteAccount(user.id, token).subscribe({
      next: (res) => {
        console.log(res);
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
    this.users = this.sortingService.sortByField(this.users, field, direction);
  }
  

}
