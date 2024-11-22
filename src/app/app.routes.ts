import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { adminGuard } from './guards/admin.guard';
import { BaseLayoutComponent } from './layout/base-layout/base-layout.component';

export const routes: Routes = [
    // Rutas públicas y sin layout aplicado
    {
        path: '',
        children: [
            { path: '', redirectTo: '/login', pathMatch: 'full' },
            { path: 'login', loadComponent: () => import('./pages/user/login/login.component').then(p => p.LoginComponent) },
            { path: 'register', loadComponent: () => import('./pages/user/register/register.component').then(p => p.RegisterComponent) },
        ]
    },
    // Rutas protegidas y con layout aplicado
    {
        path: '',
        component: BaseLayoutComponent,
        children: [
            { path: 'users', canActivate: [adminGuard, authGuard], loadComponent: () => import('./views/users/users.component').then(v => v.UsersComponent) },
            { path: 'tasks', canActivate: [authGuard], loadComponent: () => import('./views/tasks/tasks.component').then(v => v.TasksComponent) },
        ]
    },
    // Ruta de error
    { path: '**', loadComponent: () => import('./pages/error/error.component').then(c => c.ErrorComponent) }
];
