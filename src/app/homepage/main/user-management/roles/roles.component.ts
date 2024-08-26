import { Component, inject } from '@angular/core';
import { Roles } from '../../../../Model/Roles';
import { RolesService } from '../../../../Services/Roles.service';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [],
  templateUrl: './roles.component.html',
  styleUrl: './roles.component.css'
})
export class RolesComponent {

  roles : string[] = [];


  roleService : RolesService = inject(RolesService);

  ngOnInit(){
   this.roles = this.roleService.getRoles();
    console.log(this.roles);
  }

  
}
