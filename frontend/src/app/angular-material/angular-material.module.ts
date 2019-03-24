import { NgModule } from '@angular/core';
import {
  MatButtonModule,
  MatCardModule,
  MatCheckboxModule, MatDialogModule,
  MatFormFieldModule, MatInputModule,
  MatSelectModule, MatSnackBarModule,
  MatExpansionModule, MatTabsModule, MatTableModule,
  MatStepperModule
} from '@angular/material';
import { FormsModule, ReactiveFormsModule  } from '@angular/forms';
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  imports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule, MatExpansionModule, MatTabsModule, MatTableModule, MatStepperModule,
    ReactiveFormsModule, MatIconModule ],
  exports: [MatInputModule, MatButtonModule, MatCheckboxModule, MatCardModule, MatFormFieldModule, MatSelectModule,
    MatSnackBarModule, MatDialogModule, FormsModule, MatExpansionModule, MatTabsModule, MatTableModule, MatStepperModule,
    ReactiveFormsModule, MatIconModule ],
})
export class AngularMaterialModule { }
