import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatInputModule,
  MatSelectModule, MatSnackBarModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule],
  exports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule],
})
export class AngularMaterialModule { }
