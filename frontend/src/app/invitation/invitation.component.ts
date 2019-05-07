import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute, Router} from '@angular/router';
import {ApiManagerService} from '../services';
import {MealOption, MenuChoice} from '../models';
import {MatDialog, MatStepper} from '@angular/material';

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

  icons = [
    'starter',
    'soup',
    'main',
    'dessert',
    'menu'];

  icon = '../../assets/images/main-meal.svg';
  firstName: string;
  lastName: string;
  formGroup: FormGroup;
  starters: MealOption[];
  soups: MealOption[];
  mains: MealOption[];
  desserts: MealOption[];

  menuChoice: MenuChoice;

  private guest: any;
  attending;
  dietary: String;
  staying_at: String;
  postcode: String;


  constructor(private _formBuilder: FormBuilder,
              private matIconRegistry: MatIconRegistry,
              private domSanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private apiManager: ApiManagerService,
              private router: Router,
              public snackBar: MatSnackBar) {

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
        this.guest = params;
        if (params.id) {
          if (params.extra === "true") {
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
    this.menuChoice = new MenuChoice();

    this.formGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required],
      secondCtrl: ['', Validators.required]
    });

    this.starters = [
      new MealOption('Fricassee of Field and Forest Mushrooms on a Garlic Crouton (Vegetarian)',
        '../../assets/images/starter_mushroom.jpg')
    ];
    this.soups = [
      new MealOption( 'Cappuccino of Cream of Leek and Potato Soup with Chive Oil',
        '../../assets/images/soup_potato.jpg')
    ];
    this.mains = [
      new MealOption( 'Pulled Beef with Herbs wrapped in Topside with a Jus served with Gratin Potatoes, Carrots and Grilled Courgettes',
        '../../assets/images/main_beef.jpg'),
      new MealOption('Baked Scottish Salmon on a White Wine Cream served with Parsley Buttered Potatoes and Melange of Vegetables',
        '../../assets/images/main_salmon.jpg'),
      new MealOption('Broad Bean and Pea Risotto with Rocket Leaf (Vegetarian)',
        '../../assets/images/veggie_main.jpg')
    ];
    this.desserts = [
      new MealOption('Homemade Vanilla Cheesecake with a Wild Berry Puree',
        '../../assets/images/dessert_cheesecake.jpg')
    ];
    this.menuChoice.starter = this.starters[0].name;
    this.menuChoice.soup = this.soups[0].name;
    this.menuChoice.dessert = this.desserts[0].name;
  }
  getMealStyle(type: string, item) {

    if (this.menuChoice[type] === item.name) {
      return 'meal-option-card choice';
    }
    return 'meal-option-card';
  }

  mealClickEvent(type: string, item, stepper: MatStepper) {
    this.menuChoice[type] = item.name;
    stepper.next();
  }

  invitationRSVPvalid() {
    return this.menuChoice.main && this.staying_at;
  }

  submitInviteResponse(): void {
    if (!this.invitationRSVPvalid()) {
      this.snackBar.open('Main meal choice and "staying at" fields are required.', 'Ok', {duration: 10000});
      return;
    }
    const attending = +this.attending;
    const staying_at = (this.staying_at=="postcode")?this.postcode:this.staying_at;
    this.apiManager.submitInviteResponse(this.guest, attending, this.menuChoice, this.dietary, staying_at)
      .subscribe(
        (data: any) => {
          let snackbarMsg = 'Thanks for your RSVP!';
          if (attending == Attending.Yes) snackbarMsg += " We look forward to seeing you at the Wedding!";
          this.router.navigate(['/']);
          this.snackBar.open(snackbarMsg, 'Ok', {duration: 10000});
        }
      );
  }

  getMealChoice(type: string) {
    if (this.menuChoice[type] === null || this.menuChoice[type] === undefined) {
      return '__________________';
    }
    return this.menuChoice[type];
  }
}
