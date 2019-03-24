import {Component, Inject, OnInit} from '@angular/core';
import {ApiManagerService} from '../services/api-manager.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
import {Attending, Guest} from '../models';
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  public guests: Guest[];
  public newGuest: Guest = new Guest();
  plusOnes: number = 0;
  attendingGuests: number = 0;
  nonAttendingGuests: number = 0;

  constructor(private apiManager: ApiManagerService,
              public snackBar: MatSnackBar,
              public dialog: MatDialog,
              private router: Router) { }

  ngOnInit() {
    this.apiManager.getGuests()
      .subscribe((data: any[]) => {
        // console.log(data);
        let filteredData = data.filter(guest => guest.first_name);
        this.guests = filteredData.sort((g1, g2) => {
          const id1 = g1.main_guest_id | g1.id;
          const id2 = g2.main_guest_id | g2.id;
          return id1 - id2
        });
        filteredData.forEach((guest)=> {
          console.log(guest.attending, Attending.Yes);
          if (guest.attending == Attending.Yes) this.attendingGuests++;
          else {
            if (guest.guest=='false') this.plusOnes++;
            else this.nonAttendingGuests++;
          }
        });
        console.log(this.nonAttendingGuests, this.attendingGuests, this.plusOnes)
      });
  }

  confirmAction(next, parameters) {
    next = next.bind(this);
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      width: '250px'
    });

    dialogRef.afterClosed().subscribe(cancel => {
      console.log('The dialog was closed', cancel);
      if (!cancel) {
        next(...parameters);
      }
    });
  }

  goToInvite(id: any, guest: any) {
    if (guest == "true") {
      this.router.navigate(['/invitation', {id}]);
    } else {
      this.router.navigate(['/invitation', {id, extra: true}]);
    }
  }

  compareFn(op1, op2) {
    // console.log(op1, typeof op1, op2, typeof op2);

    return '' + op1 === '' + op2;
  }

  public addGuest() {
    this.apiManager.addGuest(this.newGuest)
      .subscribe(
        res => {
          console.log(res);
          this.guests.push(this.newGuest);
          this.newGuest = new Guest();

          this.snackBar.open('Added guest successfully', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred adding guest', 'Dismiss', {
            duration: 2000,
          });
          console.error('Error occurred', err);
        });
  }

  public removeGuest(id: number) {
    this.apiManager.removeGuest(id)
      .subscribe(
        res => {
          console.log(res);
          const index = this.guests.findIndex(guest => guest.id === id);
          this.guests.splice(index, 1);

          this.snackBar.open('Guest successfully removed', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred removing guest', 'Dismiss', {
            duration: 2000,
          });
          console.error('Error occurred', err);
        }
      );
  }

  public updateGuest(id: number) {
    const editedGuest = this.guests.find(guest => guest.id === id);
    console.log(id, editedGuest);
    this.apiManager.updateGuest(editedGuest)
      .subscribe(
        res => {
          console.log(res);
          this.snackBar.open('Successfully updated guest', 'Dismiss', {
            duration: 2000,
          });
        },
        err => {
          this.snackBar.open('Error occurred updating guest', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }

  public emailAll() {
    this.apiManager.emailAll()
      .subscribe(
        res => {
          this.snackBar.open('Successfully emailed all guests', 'Dismiss', {
            duration: 2000,
          });
          console.log(res);
        },
        err => {
          this.snackBar.open('Error occurred emailing all guests', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }

  public emailGuest(email) {
    this.apiManager.emailGuest(email)
      .subscribe(
        res => {
          this.snackBar.open('Successfully emailed guest', 'Dismiss', {
            duration: 2000,
          });
          console.log(res);
        },
        err => {
          this.snackBar.open('Error occurred emailing guest', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }

  public emailGuestRSVPResponse(email) {
    this.apiManager.emailGuestRSVPResponse(email)
      .subscribe(
        res => {
          this.snackBar.open('Successfully emailed guest', 'Dismiss', {
            duration: 2000,
          });
          console.log(res);
        },
        err => {
          this.snackBar.open('Error occurred emailing guest', 'Dismiss', {
            duration: 2000,
          });
          console.error(err);
        }
      );
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  template: '<div mat-dialog-content>\n' +
  '  <p>Are you sure you want to do that?</p>\n' +
  '</div>\n' +
  '<div mat-dialog-actions>\n' +
  '  <button mat-button [mat-dialog-close]="false">Ok</button>\n' +
  '  <button mat-button [mat-dialog-close]="true">Cancel</button>\n' +
  '</div>',
})
export class DialogOverviewExampleDialog {

  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) { }
}
