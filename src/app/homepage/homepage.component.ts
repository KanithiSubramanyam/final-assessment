import { Component } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';
import { TopbarComponent } from './topbar/topbar.component';
import { MainComponent } from "./main/main.component";

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [SidebarComponent, TopbarComponent, MainComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {

}
