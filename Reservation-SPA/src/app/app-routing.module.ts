import { ContactListComponent } from './_components/contact-list/contact-list.component';
import { CanEditReservationGuard } from './_guards/can-edit-reservation.service';
import { ReservationListComponent } from './_components/reservation-list/reservation-list.component';
import { AuthGuardService } from './_guards/authGuard.service';
import { Routes, RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { LoginComponent } from './_components/login/login.component';
import { EditReservationComponent } from './_components/edit-reservation/edit-reservation.component';
import { EditContactComponent } from './_components/edit-contact/edit-contact.component';
import { CanEditContactGuard } from './_guards/can-edit-contact.service';

const routes: Routes = [
  {path: '', component: LoginComponent}, 
  {
    path: '',
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuardService],
    children:[
      {path: 'reservations', component: ReservationListComponent},
      {path: 'reservations/new', component: EditReservationComponent},
      {path: 'reservations/:id/edit', component: EditReservationComponent, canActivate: [CanEditReservationGuard]},
      {path: 'contacts/new', component: EditContactComponent},      
      {path: 'contacts/:id/edit', component: EditContactComponent, canActivate: [CanEditContactGuard]},
      {path: 'contacts', component: ContactListComponent},
    ]
  },  
  {path: '**', redirectTo: '', pathMatch: 'full'}       
];

@NgModule({
  imports:[
    RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class appRoutingModule {}


