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
import { AddUserComponent } from './homepage/main/user-management/users/add-user/add-user.component';
import { AddTaskComponent } from './homepage/main/task-management/add-task/add-task.component';
import { canActivate } from './Route-Gaurds/auth-gaurd';
import { AppointmentManagementComponent } from './homepage/main/appointment-management/appointment-management.component';
import { ViewComponent } from './homepage/main/appointment-management/view/view.component';
import { ScheduleComponent } from './homepage/main/appointment-management/schedule/schedule.component';
import { ForgetPasswordComponent } from './login/forget-password/forget-password.component';
import { TotpComponent } from './login/totp/totp.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path : 'login/forget-password', component: ForgetPasswordComponent },
  { path : 'login/mfalogin', component: TotpComponent },
  {
    path: '',
    component: HomepageComponent,
    canActivate: [canActivate],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'userManagement', 
        component: UserManagementComponent, 
        children: [
          { path: 'users', component: UsersComponent },
          { path: 'users/adduser', component: AddUserComponent }
        ]
      },
      { path: 'userManagement/permissions', component: PermissionsComponent },
      { path: 'userManagement/roles', component: RolesComponent },
      { path: 'user/profile', component: ProfileComponent },
      { path: 'taskManagement', component: TaskManagementComponent },
      { path: 'dairyManagement', component: DairyManagementComponent },
      { path: 'userManagement/users/adduser', component: AddUserComponent },
      { path: 'userManagement/users/viewProfile/:id', component: ProfileComponent },
      { path: 'userManagement/users/editProfile/:id', component: ProfileComponent },
      { path: 'taskManagement/addtask', component: AddTaskComponent },
      {
        path: 'appointmentManagement',
        component: AppointmentManagementComponent, // This should have a router-outlet
        children: [
          { path: 'view', component: ViewComponent },
          { path: 'schedule', component: ScheduleComponent },
        ]
      }
    ]
  },
  { path: '**', component: NotFoundComponent },
];