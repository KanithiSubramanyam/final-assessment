import { Component, inject, OnInit } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../../Model/User';
import { UserService } from '../../../../Services/userService.service';
import { AuthService } from '../../../../Services/auth.service';
import { CommonModule } from '@angular/common';
import { userDetails } from '../../../../Model/userDetails';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AddUserComponent, RouterLink, CommonModule],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  userService: UserService = inject(UserService);
  authService: AuthService = inject(AuthService);
  
  users: userDetails[] = [];
  
  ngOnInit() {
    this.userService.getAllUsers().subscribe({
      next: (res) => {
        this.users = Object.values(res);  // Convert the object to an array
      },
      error: (err) => {
        console.log(err);
      }
    });
  }
}
