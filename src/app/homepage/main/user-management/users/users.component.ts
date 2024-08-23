import { Component, inject, OnInit } from '@angular/core';
import { AddUserComponent } from './add-user/add-user.component';
import { RouterLink } from '@angular/router';
import { User } from '../../../../Model/User';
import { UserService } from '../../../../Services/userService.service';
import { AuthService } from '../../../../Services/auth.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [AddUserComponent,RouterLink],
  templateUrl: './users.component.html',
  styleUrl: './users.component.css'
})
export class UsersComponent implements OnInit{

  userService : UserService = inject(UserService);
  authService:AuthService=inject(AuthService)
  
  users: User[] = [];
  

  ngOnInit() {
    
    // this.userService.getAllUsers().subscribe((users: User[]) => {
    //   this.users = users;
    //   console.log(users);
    // });
    this.userService.getAllUsers();
  }
}
