import { Router } from '@angular/router';
import { BreakpointObserverService } from 'src/app/_services/breakpoint-observer.service';
import { Subscription } from 'rxjs';
import { AuthService } from './../../_services/auth.service';
import { Reservation } from './../../_model/reservation.interface';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { ReservationService } from 'src/app/_services/Reservation.service';

interface SortOptions 
{
  title: string; 
  sortByKey: string;
  isSortAscending: boolean
}

@Component({
  selector: 'app-reservation-list-item',
  templateUrl: './reservation-list-item.component.html',
  styleUrls: ['./reservation-list-item.component.css']
})
export class ReservationListItemComponent implements OnInit, OnDestroy {
  @Input('reservation') reservation: Reservation;
  subscription: Subscription;
  subscriptionToBreakpointObserverService : Subscription;  
  userId: number;
  inSmallScreen = false;

  SortByContactName = "ContactName";
  SortByCreatedDateTime = "CreatedDateTime";
  SortByRanking = "Ranking";

  sortOptions : SortOptions[] = [{title: "By Date Ascending", sortByKey: this.SortByCreatedDateTime, isSortAscending: true}, 
          {title: "By Date Descending", sortByKey: this.SortByCreatedDateTime, isSortAscending: false},
          {title: "By Alphabetic Ascending", sortByKey: this.SortByContactName, isSortAscending: true},
          {title: "By Alphabetic Descending", sortByKey: this.SortByContactName, isSortAscending: false},
          {title: "By Ranking", sortByKey: this.SortByRanking, isSortAscending: false}];

  constructor(private reservationService: ReservationService,
    private authService: AuthService,
    private breakpointObserverService : BreakpointObserverService,
    private router: Router) { }

  ngOnInit() {
    this.subscription = this.authService.user.subscribe(u => {
      this.userId = !!u ? u.id : 0;
     });

    this.subscriptionToBreakpointObserverService 
      = this.breakpointObserverService.inSmallScreen.subscribe(res =>
        this.inSmallScreen = res 
    ); 
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscriptionToBreakpointObserverService) 
      this.subscriptionToBreakpointObserverService.unsubscribe();
  }

  modifyFavorite(){
    this.reservationService.modifyFavorite(this.reservation.id)
    .subscribe(res => 
      this.reservation = res);
  }

  editReservation(reservationId: number){
      this.router.navigate(['reservations', reservationId, 'edit']);
  }
}
