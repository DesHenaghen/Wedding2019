import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatInputModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule],
  exports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule],
})
export class AngularMaterialModule { }
