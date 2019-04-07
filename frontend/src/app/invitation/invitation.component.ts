import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {STEPPER_GLOBAL_OPTIONS} from '@angular/cdk/stepper';
import {MatIconRegistry} from '@angular/material/icon';
import {DomSanitizer} from '@angular/platform-browser';
import {ActivatedRoute} from '@angular/router';
import {ApiManagerService} from '../services';
import {MealOption} from '../models';

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

  isSelectedStarter: number;


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

    this.starters = [
      new MealOption(0, 'Ham Hock Terrine with Spiced Pear Chutney and Mini Highland Oatcakes',
        '../../assets/images/starter_hamhock.jpg'),
      new MealOption(1, 'Fricassee of Field and Forest Mushrooms on a Garlic Crouton',
        '../../assets/images/starter_mushroom.jpg'),
      new MealOption(2, 'Egg and Parma Ham Salad with Mustard Dressing',
        '../../assets/images/starter_salad.jpg')
    ];
    this.soups = [
      new MealOption(0, 'Cappuccino of Tomato Soup infused with Green Herbs',
        '../../assets/images/soup_tomato.jpg'),
      new MealOption(1, 'Cappuccino of Split Green Pea and Pear Soup with Herb Oil',
        '../../assets/images/soup_pea.jpg'),
      new MealOption(2, 'Cappuccino of Seasonal Vegetable Broth with Ground White Pepper',
        '../../assets/images/soup_vegetables.jpg')
    ];
    this.mains = [
      new MealOption(0, 'Roast Breast of Chicken with a Light Pan Gravy served with Roast Potatoes and Melange of Roast Vegetables',
      '../../assets/images/main_chicken.jpg'),
      new MealOption(1, 'Pulled Beef with Herbs wrapped in Topside with a Jus served with Gratin Potatoes, Carrots and Grilled Courgettes',
        '../../assets/images/main_beef.jpg'),
      new MealOption(2, 'Baked Scottish Salmon on a White Wine Cream served with Parsley Buttered Potatoes and Melange of Vegetables',
        '../../assets/images/main_salmon.jpg')
    ];
    this.desserts = [
      new MealOption(0, 'Homemade Vanilla Cheesecake with a Wild Berry Puree',
        '../../assets/images/dessert_cheesecake.jpg'),
      new MealOption(1, 'Western House Strawberry Meringue with Chantilly Cream',
        '../../assets/images/dessert_meringue.jpg'),
      new MealOption(2, 'Cream Filled Chocolate Profiteroles with a Warm Butterscotch Sauce',
        '../../assets/images/dessert_profiteroles.jpg')
    ];
  }

  mealClickEvent(type: string, item) {
    console.log(item);
  }
}
