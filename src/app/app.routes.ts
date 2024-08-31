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
    data : { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] },
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { 
        path: 'userManagement', 
        component: UserManagementComponent,
        canActivate: [canActivate], 
        data: { roles: [RolesService.ADMIN] }, // Only Admin can access this
        children: [
          { path: 'users', component: UsersComponent, canActivate: [canActivate],  data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER] } },
          { path: 'users/adduser', component: AddUserComponent, canActivate: [canActivate], data: { roles: [RolesService.ADMIN] } }
        ]
      },
      { path: 'userManagement/permissions', component: PermissionsComponent, canActivate: [canActivate], data: { roles: [RolesService.ADMIN] }  },
      { path: 'userManagement/roles', component: RolesComponent, canActivate: [canActivate], data: { roles: [RolesService.ADMIN] } },
      { path: 'user/profile', component: ProfileComponent, canActivate: [canActivate], data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      { path: 'taskManagement', component: TaskManagementComponent, data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      { path: 'taskManagement/taskDetails', component: TaskDetailsComponent, canActivate: [canActivate], data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      // { path: 'taskManagement/edit/:id', component: AddTaskComponent },
      { path: 'dairyManagement', component: DairyManagementComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      { path: 'userManagement/users/viewProfile/:id', component: ProfileComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      { path: 'userManagement/users/editProfile/:id', component: ProfileComponent, data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      { path: 'taskManagement/addtask', component: AddTaskComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
      {
        path: 'appointmentManagement',
        component: AppointmentManagementComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] },
         // This should have a router-outlet
        children: [
          { path: 'view', component: ViewComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
          { path: 'schedule', component: ScheduleComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] } },
        ]
      },
      { path:'customerManagement', component: CustomerManagementComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] }},
      { path:'customerManagement/addCustomer', component: AddCustomerComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] }},
      { path:'customerManagement/customerDetails', component: CustomerDetailsComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN, RolesService.ACCOUNTMANAGER, RolesService.USER] }},
      { path: 'activityLog', component: ActivityLogComponent, canActivate: [canActivate],data: { roles: [RolesService.ADMIN] } },
    ]
  },
  { path: '**', component: NotFoundComponent },
];