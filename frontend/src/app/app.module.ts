import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { JwtModule } from "@auth0/angular-jwt";

import { AppComponent } from './app.component';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {AppRoutingModule} from './app-routing/app-routing.module';
import { ContactComponent } from './contact/contact.component';
import { SaveTheDateComponent } from './save-the-date/save-the-date.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AngularMaterialModule} from './angular-material/angular-material.module';
import {AdminComponent, DialogOverviewExampleDialog} from './admin/admin.component';
import {ApiManagerService} from './services/api-manager.service';
import {ModalComponent} from './directives';
import {ModalService} from './services';
import {OurStoryComponent} from './our-story/our-story.component';
import {EventsComponent} from './events/events.component';
import {AccommodationComponent} from './accomodation/accommodation.component';
import {TravelComponent} from './travel/travel.component';
import { AgmCoreModule } from '@agm/core';
import { MealsComponent } from './meals/meals.component';
import {AuthService} from "./services/auth.service";
import {AuthGuard} from "./guards/auth.guard";
import { LoginComponent } from './login/login.component';

export function tokenGetter() {
  return localStorage.getItem('access_token');
}

@NgModule({
  declarations: [
    AppComponent,
    AboutComponent,
    HomeComponent,
    EventsComponent,
    ContactComponent,
    OurStoryComponent,
    AccommodationComponent,
    SaveTheDateComponent,
    TravelComponent,
    AdminComponent,
    ModalComponent,
    DialogOverviewExampleDialog,
    MealsComponent,
    LoginComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyBhB29axwu1F0PUWMEx33YIS5RwaNGjs0A'
    }),
    HttpClientModule,
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        whitelistedDomains: ['localhost:4000'],
        blacklistedRoutes: ['localhost:4000/api/auth']
      }
    })
  ],
  providers: [
    ApiManagerService,
    ModalService,
    AuthService,
    AuthGuard
  ],
  bootstrap: [AppComponent],
  entryComponents: [DialogOverviewExampleDialog]
})
export class AppModule { }
