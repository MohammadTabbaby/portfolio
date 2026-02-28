import { Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home';
import { ProjectsComponent } from './pages/projects/projects';
import { ContactComponent } from './pages/contact/contact';
import { AdminLoginComponent } from './pages/admin/admin-login/admin-login';
import { AdminDashboardComponent } from './pages/admin/admin-dashboard/admin-dashboard';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
    { path:'', component: HomeComponent },
    { path:'projects', component: ProjectsComponent },
    { path:'contact', component: ContactComponent },
    { path:'admin/login', component: AdminLoginComponent },
    { path:'admin', component: AdminDashboardComponent, canActivate: [AuthGuard] }

];
