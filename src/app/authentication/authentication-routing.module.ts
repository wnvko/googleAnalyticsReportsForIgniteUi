import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { RedirectComponent } from './redirect/redirect.component';
import { DashboardComponent } from '../dashboard/dashboard.component';
import { AuthGuard } from './auth.guard';

const authRoutes: Routes = [
    { path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] },
    { path: 'redirect', component: RedirectComponent}
];

@NgModule({
    imports: [
      RouterModule.forChild(authRoutes)
    ],
    exports: [
      RouterModule
    ]
  })
export class AuthenticationRoutingModule {}
