import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './homepage/main/dashboard/dashboard.component';
import { UserManagementComponent } from './homepage/main/user-management/user-management.component';


export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: '', component: HomepageComponent, children: [
        { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
        { path: 'dashboard', component: DashboardComponent },
        { path: 'userManagement', component: UserManagementComponent },
    ]},
    { path: '**', component: NotFoundComponent },
];

