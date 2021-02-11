import { ReservationService } from 'src/app/_services/Reservation.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../_services/auth.service';
import { AlertService } from '../_services/alert.service';
import { Observable, of } from 'rxjs';
import { User } from '../_model/user.interface';
import { catchError, switchMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class CanEditReservationGuard {

  constructor(private authService : AuthService, private router : Router, 
    private alertService : AlertService, private reservationService : ReservationService) { }
    
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {    
    var userAux : User;    
    return this.authService.user
            .pipe(switchMap(u => {
              userAux = u;
              var id : any = route.paramMap.get('id');
              return this.reservationService.getReservation(id ?? 0);
            }))
            .pipe(switchMap(reservation => {
              var canPass = reservation.createdByUser.id == userAux.id;
              if (!canPass) {
                this.alertService.error('You are not the owner of this reservation. You can not modify it!');
                this.router.navigate(['reservations']);                 
              }
              return of(canPass); 
            }),
            catchError(error => {              
              this.alertService.error('The Reservation you are trying to edit, does not exist!');
              this.router.navigate(['reservations']);                 
              return of(false)
            }));
  }

}
