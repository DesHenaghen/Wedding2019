import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from "@angular/router";
import {ApiManagerService} from "../services";

@Component({
  selector: 'app-invitation',
  templateUrl: './invitation.component.html',
  styleUrls: ['./invitation.component.css'],
  providers: [{
    provide: STEPPER_GLOBAL_OPTIONS, useValue: {displayDefaultIndicatorType: false}
  }],
  encapsulation: ViewEncapsulation.None

})

export class InvitationComponent implements OnInit {

  formGroup: FormGroup;
  icons = [
    'starter',
    'soup',
    'main',
    'dessert',
    'menu'];

  icon = '../../assets/images/main-meal.svg';
  firstName: string;
  lastName: string;
  constructor(private _formBuilder: FormBuilder,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private apiManager: ApiManagerService) {

    this.matIconRegistry.addSvgIcon(
      `soup`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/soup.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `main`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/main-meal.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `dessert`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/dessert.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `menu`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/menu.svg')
    );
    this.matIconRegistry.addSvgIcon(
      `starter`,
      this.domSanitizer.bypassSecurityTrustResourceUrl('../../assets/images/starter.svg')
    );
  }

  getIcon(index) {
    console.log(index);
  }

  ngOnInit() {
    this.route.params
      .subscribe(params => {
        console.log(params);
        if (params.id) {
          if (params.extra) {
            // fetch plusone details of id
            this.apiManager.getPlusOne(params.id)
              .subscribe((data: any) => {
                if (data) {
                  console.log(data);
                  this.firstName = data.first_name;
                  this.lastName = data.last_name;
                }
              });
          } else {
            // fetch guest details of id
            this.apiManager.getGuest(params.id)
              .subscribe((data: any) => {
                if (data) {
                  console.log(data);
                  this.firstName = data.first_name;
                  this.lastName = data.last_name;
                }
              });
          }
        }
      });

    this.formGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required]
    });
  }
}
