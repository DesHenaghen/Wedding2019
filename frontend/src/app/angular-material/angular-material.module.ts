import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatInputModule,
  MatSelectModule, MatSnackBarModule,
  MatExpansionModule, MatTabsModule, MatTableModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule, MatExpansionModule, MatTabsModule, MatTableModule],
  exports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule, MatExpansionModule, MatTabsModule, MatTableModule],
})
export class AngularMaterialModule { }
