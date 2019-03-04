import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import {SaveTheDateComponent} from '../save-the-date/save-the-date.component';
import {AdminComponent} from '../admin/admin.component';
import {AuthGuard} from "../guards/auth.guard";
import {LoginComponent} from "../login/login.component";


const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'savethedate',
    component: SaveTheDateComponent
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class AppRoutingModule { }
