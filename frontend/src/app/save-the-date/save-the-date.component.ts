import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

import {ApiManagerService, ModalService} from '../services';
import {Guest, PlusOne} from '../models';

@Component({
  selector: 'app-save-the-date',
  templateUrl: './save-the-date.component.html',
  styleUrls: ['./save-the-date.component.css', '../directives/modal.component.css'],
  animations: [
    trigger('activeCard', [
      state('true', style({})),
      state('false',   style({
        transform: 'rotateY(-180deg)'
      })),
      transition('true => false', animate('100ms ease-in')),
      transition('false => true', animate('100ms ease-out'))
    ])
  ],
  encapsulation: ViewEncapsulation.None
})
export class SaveTheDateComponent implements OnInit {

  public activeCard = true;
  public guest: Guest = new Guest();
  public secondGuest = false;
  public plusOne: PlusOne = new PlusOne();
  public displayPlusOneCard = true;

  constructor(
    private modalService: ModalService,
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
    return (this.guest.firstname && this.guest.lastname);
  }

  public rsvpComplete() {
    // Attending is an enum, where 3 evaluates to Not attending.
    return (this.guest.attending === 3 || this.guestFormComplete() && this.plusOneFormComplete());
  }

  public guestFormComplete() {
    return ( this.guest.contact_phone && this.guest.contact_email);
  }

  public plusOneFormComplete() {
    return (this.plusOne.phone_number && this.plusOne.contact_email);
  }

  public findMyInvitation() {
    // add logic for looking up person in db
    this.apiManager.guestExists(this.guest).subscribe((result: any) => {
      if (result.id > 0) {
        this.guest.id = result.id;
        this.plusOne.main_guest_id = result.id;

        this.openModal('rsvp-form');
      } else {
        this.displayInvalidGuestSnackBar();
      }
    });
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }


  public submit() {
    const plusOne = (this.displayPlusOneCard) ? this.plusOne : new PlusOne();
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

  private displayInvalidGuestSnackBar() {
    this.snackBar.open(
      'Sorry, we don\'t have a guest with that name on our list. Please try again.\n' +
      'If you still can\'t find yourself please get in touch with us!',
      'Dismiss', {
      duration: 5000,
    });
  }
}
