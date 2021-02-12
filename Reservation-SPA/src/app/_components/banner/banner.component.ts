import { EditReservationComponent } from './../edit-reservation/edit-reservation.component';
import { BreakpointObserverService } from './../../_services/breakpoint-observer.service';
import { Subscription } from 'rxjs';
import { BannerStructureService } from 'src/app/_services/banner-structure.service';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { BannerStructure } from 'src/app/_model/Constants';
import { ReservationListComponent } from '../reservation-list/reservation-list.component';

@Component({
  selector: 'app-banner',
  templateUrl: './banner.component.html',
  styleUrls: ['./banner.component.css']
})
export class BannerComponent implements OnInit, OnDestroy {
  subscription : Subscription;
  subscriptionToBreakpointObserver : Subscription;
  structure : BannerStructure;
  inSmallScreen: boolean;

  constructor(public bannerStructureService: BannerStructureService,
    public breakpointObserverService: BreakpointObserverService) { }

  get instanceOfEditReservation(){
    return this.structure?.emittedBy instanceof EditReservationComponent;
  }

  get instanceOfReservationList(){
    return this.structure?.emittedBy instanceof ReservationListComponent;
  }
  
  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
    if (this.subscriptionToBreakpointObserver) 
      this.subscriptionToBreakpointObserver.unsubscribe();
  }

  ngOnInit() {
    this.subscription = this.bannerStructureService.observer.subscribe(structure => {
      this.structure = structure;
    });
    this.subscriptionToBreakpointObserver 
      = this.breakpointObserverService.inSmallScreen.subscribe(res => {
        this.inSmallScreen = res;
      });
  }  
}
