import { Component, ViewEncapsulation } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition
} from '@angular/animations';
import {Router} from '@angular/router';
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
export class SaveTheDateComponent {

  public activeCard = true;
  public guest: Guest = new Guest();
  public contactCheckbox = false;
  public plusOne: PlusOne = new PlusOne();

  constructor(
    private modalService: ModalService,
    private apiManager: ApiManagerService,
    private router: Router,
    public snackBar: MatSnackBar) {
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
    return (!this.guest.plusOneOffered || this.guest.plusOneNeeded === false ||
      (this.plusOne.firstname && this.plusOne.lastname && this.plusOne.contact_phone && this.plusOne.contact_email));
  }

  public copyContactDetails() {
    if (this.contactCheckbox) {
      this.plusOne.contact_phone = this.guest.contact_phone;
      this.plusOne.contact_email = this.guest.contact_email;
    }
  }

  public clearPlusOne() {
    this.plusOne = new PlusOne();
    this.contactCheckbox = false;
  }

  public findMyInvitation() {
    // add logic for looking up person in db
    this.apiManager.guestExists(this.guest).subscribe((result: any) => {
      if (result.id > 0) {
        this.updateGuestValues(result);
        this.plusOne.main_guest_id = result.id;

        this.openModal('rsvp-form');
      } else {
        this.displayInvalidGuestSnackBar();
      }
    });
  }

  private updateGuestValues(result: any) {
    this.guest.id = result.id;
    this.guest.plusOneOffered = result.plus_one_offered;
    this.guest.firstname = result.first_name;
    this.guest.lastname = result.last_name;
  }

  openModal(id: string) {
    this.modalService.open(id);
  }

  closeModal(id: string) {
    this.modalService.close(id);
  }

  public submit() {
    this.apiManager.sendSTD(this.guest, this.plusOne)
      .subscribe(
        () => {
          this.router.navigate(['/']);
        },
        () => {
          this.snackBar.open('Something went wrong. Reload the page and try again', 'Dismiss', {
            duration: 5000,
          });
        }
      );
  }

  private displayInvalidGuestSnackBar() {
    this.snackBar.open(
      'Sorry, we can\'t find you. Please try again. The name is likely as on facebook.\n' +
      'If you still can\'t find yourself please get in touch with us!',
      'Dismiss', {
      duration: 5000,
    });
  }
}
