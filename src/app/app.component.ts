import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SidebarComponent } from './homepage/sidebar/sidebar.component';
import { TopbarComponent } from './homepage/topbar/topbar.component';
import { MainComponent } from './homepage/main/main.component';
import { CommonModule } from '@angular/common';
import { AuthService } from './Services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';



@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,LoginComponent, SidebarComponent, TopbarComponent, MainComponent ,CommonModule,ReactiveFormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'final-assessment';

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.authService.autoLogin();
  }

}
