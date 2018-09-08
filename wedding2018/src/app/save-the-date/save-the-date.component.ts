import { Component, OnInit } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {ApiManagerService} from "../api-manager.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrls: ['./save-the-date.component.css'],
  animations: [
    trigger('activeCard', [
      state('true', style({})),
      state('false',   style({
        transform: 'rotateY(-180deg)'
      })),
      transition('true => false', animate('100ms ease-in')),
      transition('false => true', animate('100ms ease-out'))
    ])
  ]
})
export class SaveTheDateComponent implements OnInit {

  public activeCard = true;
  public guest: any = {};
  public secondGuest = false;
  public plusOne: any = {};
  public displayPlusOneCard = true;

  constructor(
    private apiManager: ApiManagerService,
    private router: Router,
    public snackBar: MatSnackBar,
    public activatedRoute: ActivatedRoute) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.secondGuest = (params['sg']);
    });
  }

  ngOnInit() {
  }

  public toggleActiveCard() {
    this.activeCard = !this.activeCard;
  }

  public formComplete() {
    return (this.guest.name && this.guest.contact_email && this.guest.attending)
      && (!this.secondGuest || !this.displayPlusOneCard || (this.plusOne.name && (this.plusOne.contact_email || this.plusOne.main_contact) && this.plusOne.attending));
  }

  public submit() {
    const plusOne = (this.displayPlusOneCard) ? this.plusOne : {};
    this.apiManager.sendSTD(this.guest, plusOne)
      .subscribe(
        res => {
          this.router.navigate(['/']);
        },
        err => {
          this.snackBar.open('Something went wrong. Reload the page and try again', 'Dismiss', {
            duration: 5000,
          });
        }
      );
  }

}
