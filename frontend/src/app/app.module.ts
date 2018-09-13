import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import { ContactComponent } from './contact/contact.component';
import {GalleryComponent} from './gallery/gallery.component';
import { SaveTheDateComponent } from './save-the-date/save-the-date.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {AdminComponent, DialogOverviewExampleDialog} from './admin/admin.component';
import {ApiManagerService} from './services/api-manager.service';
import {NgsRevealModule} from 'ng-scrollreveal';
import {ModalComponent} from './directives';
import {ModalService} from './services';

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    ContactComponent,
    GalleryComponent,
    SaveTheDateComponent,
    AdminComponent,
    ModalComponent,
    DialogOverviewExampleDialog
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    HttpClientModule,
    NgsRevealModule.forRoot()
  ],
  providers: [
    ApiManagerService,
    ModalService
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
