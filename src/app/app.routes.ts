import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomepageComponent } from './homepage/homepage.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { DashboardComponent } from './homepage/main/dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: LoginComponent },
    { path: 'Login', component: LoginComponent },
    {path: 'Home', component: HomepageComponent},
    {path: 'dashboard', component: DashboardComponent},
    {path: '**', component: NotFoundComponent}
];
