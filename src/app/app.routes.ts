import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './homepage/main/dashboard/dashboard.component';
import { UserManagementComponent } from './homepage/main/user-management/user-management.component';
import { UsersComponent } from './homepage/main/user-management/users/users.component';
import { PermissionsComponent } from './homepage/main/user-management/permissions/permissions.component';
import { RolesComponent } from './homepage/main/user-management/roles/roles.component';
import { ProfileComponent } from './homepage/main/profile/profile.component';
import { TaskManagementComponent } from './homepage/main/task-management/task-management.component';
import { DairyManagementComponent } from './homepage/main/dairy-management/dairy-management.component';
import { canActivate } from './Route-Gaurds/auth-gaurd';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [canActivate],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'userManagement/users', component: UsersComponent },
      { path: 'userManagement/permissions', component: PermissionsComponent },
      { path: 'userManagement/roles', component: RolesComponent },
      { path: 'user/profile', component: ProfileComponent },
      { path: 'taskManagement', component: TaskManagementComponent },
      { path: 'dairyManagement', component: DairyManagementComponent },
    ]
  },
  { path: '**', component: NotFoundComponent },
];
