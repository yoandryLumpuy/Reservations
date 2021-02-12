import { NgModule } from '@angular/core';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatInputModule} from '@angular/material/input';
import {MatButtonModule} from '@angular/material/button';
import {MatMenuModule} from '@angular/material/menu';
import {MatTableModule} from '@angular/material/table';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatPaginatorModule} from '@angular/material/paginator';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatDialogModule} from '@angular/material/dialog';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatGridListModule} from '@angular/material/grid-list';
import { MatAutocompleteModule } from "@angular/material/autocomplete";
import { MatSelectModule } from "@angular/material/select";
import {  MatDatepickerModule } from "@angular/material/datepicker";
import { MatListModule } from "@angular/material/list";
import { MatSortModule } from "@angular/material/sort";
import { LayoutModule } from "@angular/cdk/layout";
import { MatNativeDateModule } from '@angular/material/core';

@NgModule({
  exports:[
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatButtonModule,
    MatMenuModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatPaginatorModule,
    MatSnackBarModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTooltipModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatDatepickerModule,
    MatListModule,
    MatSortModule,
    LayoutModule,
    MatNativeDateModule
  ]
})
export class MatModule { }
