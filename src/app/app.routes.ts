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
import { VerifyOtpComponent } from './login/verify-otp/verify-otp.component';
import { ActivityLogComponent } from './activity-log/activity-log.component';
import { TaskDetailsComponent } from './homepage/main/task-management/task-details/task-details.component';
import { RolesService } from './Services/Roles.service';
import { CustomerManagementComponent } from './homepage/main/customer-management/customer-management.component';
import { AddCustomerComponent } from './homepage/main/customer-management/add-customer/add-customer.component';
import { CustomerDetailsComponent } from './homepage/main/customer-management/customer-details/customer-details.component';


export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path : 'login/forget-password', component: ForgetPasswordComponent },
  { path : 'login/verifyOTP', component: VerifyOtpComponent },

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
        data: { roles: [RolesService.ADMIN] }, // Only Admin can access this
        children: [
          { path: 'users', component: UsersComponent,  data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER] } },
          { path: 'users/adduser', component: AddUserComponent,  data: { roles: [RolesService.ADMIN] } }
        ]
      },
      { path: 'userManagement/permissions', component: PermissionsComponent, data: { roles: [RolesService.ADMIN] }  },
      { path: 'userManagement/roles', component: RolesComponent, data: { roles: [RolesService.ADMIN] } },
      { path: 'user/profile', component: ProfileComponent },
      { path: 'taskManagement', component: TaskManagementComponent },
      { path: 'taskManagement/taskDetails', component: TaskDetailsComponent },
      // { path: 'taskManagement/edit/:id', component: AddTaskComponent },
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
      },
      { path:'customerManagement', component: CustomerManagementComponent},
      { path:'customerManagement/addCustomer', component: AddCustomerComponent},
      { path:'customerManagement/customerDetails', component: CustomerDetailsComponent},
      { path: 'activityLog', component: ActivityLogComponent, data: { roles: [RolesService.ADMIN] } },
    ]
  },
  { path: '**', component: NotFoundComponent },
];