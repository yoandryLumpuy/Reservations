import { Subscription } from 'rxjs';
import { AuthService } from './../../_services/auth.service';
import { Reservation } from './../../_model/reservation.interface';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReservationService } from 'src/app/_services/Reservation.service';

@Component({
  selector: 'app-reservation-list-item',
  templateUrl: './reservation-list-item.component.html',
  styleUrls: ['./reservation-list-item.component.css']
})
export class ReservationListItemComponent implements OnInit, OnDestroy {
  @Input('reservation') reservation: Reservation;
  subscription: Subscription;
  userId: number;

  constructor(private reservationService: ReservationService,
    private authService: AuthService) { }

  ngOnInit() {
     this.authService.user.subscribe(user =>
      this.userId = !!user ? user.id : 0);
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  modifyFavorite(){
    this.reservationService.modifyFavorite(this.reservation.id)
    .subscribe(res => 
      this.reservation = res);
  }
}
