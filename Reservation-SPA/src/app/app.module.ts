import { CkeditorComponent } from './_components/ckeditor/ckeditor.component';
import { BannerComponent } from './_components/banner/banner.component';
import { ContactListComponent } from './_components/contact-list/contact-list.component';
import { ReservationListComponent } from './_components/reservation-list/reservation-list.component';
import { ToolbarComponent } from './_components/Toolbar/Toolbar.component';
import { StringsLimitedPipe } from './_pipes/strings-limited.pipe';
import { ConfirmDialogComponent } from './_services/confirm-dialog/confirm-dialog.component';
import { AlertComponent } from './_services/alert/alert.component';
import { MyErrorHandler } from './error-handler';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CommonModule } from "@angular/common";
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule} from '@angular/forms';
import { AppComponent } from './app.component';
import { NavBarComponent } from './_components/navBar/navBar.component';
import { UserWithRolesDirective } from './_directives/userWithRoles.directive';
import { appRoutingModule } from './app-routing.module';
import { AuthInterceptorService } from './_services/authInterceptor.service';

import {MatModule} from './_modules/mat.module';

import { MAT_SNACK_BAR_DATA, MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material/snack-bar';
import { UploadProgressInterceptorService } from './_services/upload-progress-interceptor.service';
import { EditReservationComponent } from './_components/edit-reservation/edit-reservation.component';
import { EditContactComponent } from './_components/edit-contact/edit-contact.component';
import { LoginComponent } from './_components/login/login.component';
import { ReservationListItemComponent } from './_components/reservation-list-item/reservation-list-item.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';

@NgModule({
  declarations: [					
      AppComponent,
      NavBarComponent,
      UserWithRolesDirective,
      AlertComponent, 
      ConfirmDialogComponent,
      StringsLimitedPipe,
      ToolbarComponent,
      ReservationListComponent,
      ReservationListItemComponent,
      EditReservationComponent,
      EditContactComponent,
      LoginComponent,      
      ContactListComponent,
      BannerComponent,
      CkeditorComponent
   ],
  imports: [
    BrowserModule, 
    CommonModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    appRoutingModule,
    MatModule, 
    ReactiveFormsModule,
    CKEditorModule
  ],
  providers: [
    {provide: ErrorHandler, useClass: MyErrorHandler},
    {
      provide: HTTP_INTERCEPTORS, 
      useClass: AuthInterceptorService, 
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UploadProgressInterceptorService,
      multi: true
    },
    {provide: MAT_SNACK_BAR_DATA, useValue: {}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
