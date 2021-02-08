import { Reservation } from '../_model/reservation.interface';
import { AuthService } from './auth.service';
import { PaginationResult } from '../_model/paginationResult.interface';
import { QueryObject } from '../_model/queryObject.interface';
import { environment } from '../../environments/environment';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AlertService } from './alert.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ReservationService {

  constructor(private http : HttpClient, private authService: AuthService, 
    private router : Router, private alertService: AlertService) { }

  getReservations(queryObject: QueryObject) : Observable<PaginationResult<Reservation>>{              
    return this.http.get<PaginationResult<Reservation>>(environment.baseUrl + "reservations?"+ this.queryObjectToString(queryObject), 
                {reportProgress: true});
  }

  queryObjectToString(queryObject : any) : string{
    var parts : string[] = [];
    if (!!queryObject){
      for(let prop in queryObject){
        var value = queryObject[prop];
        if (value != null && value != undefined) 
          parts.push(encodeURIComponent(prop) + '='+ encodeURIComponent(queryObject[prop]))
      }
    }
    return parts.join('&');
  }

  modifyFavorite(reservationId: number){
    if (!this.authService.loggedIn) {
      this.router.navigate(['/']);
      this.alertService.error("Please log in!");
      return null;
    };
    return this.http.post<Reservation>(`${environment.baseUrl}reservations/${reservationId}/favorite`, {});
  }
}
