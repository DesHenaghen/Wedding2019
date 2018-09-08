import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../home/home.component';
import { AboutComponent } from '../about/about.component';
import {ContactComponent} from '../contact/contact.component';
import {GalleryComponent} from '../gallery/gallery.component';
import {ServicesComponent} from '../services/services.component';
import {SaveTheDateComponent} from '../save-the-date/save-the-date.component';
import {AdminComponent} from '../admin/admin.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  // {
  //   path: 'about',
  //   component: AboutComponent
  // },
  // {
  //   path: 'contact',
  //   component: ContactComponent
  // },
  // {
  //   path: 'gallery',
  //   component: GalleryComponent
  // },
  // {
  //   path: 'services',
  //   component: ServicesComponent
  // },
  {
    path: 'savethedate',
    component: SaveTheDateComponent
  },
  {
    path: 'admin',
    component: AdminComponent
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
