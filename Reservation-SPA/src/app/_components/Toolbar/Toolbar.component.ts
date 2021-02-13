import { AuthService } from 'src/app/_services/auth.service';
import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { BannerStructure } from 'src/app/_model/Constants';
import { BannerStructureService } from 'src/app/_services/banner-structure.service';
import { BreakpointObserverService } from 'src/app/_services/breakpoint-observer.service';
import { EditReservationComponent } from '../edit-reservation/edit-reservation.component';
import { AlertService } from 'src/app/_services/alert.service';
import { ReservationListComponent } from '../reservation-list/reservation-list.component';

@Component({
  selector: 'app-Toolbar',
  templateUrl: './Toolbar.component.html',
  styleUrls: ['./Toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  subscription : Subscription;
  subscriptionToBreakpointObserver : Subscription;
  structure : BannerStructure;
  inSmallScreen: boolean;

  constructor(public bannerStructureService: BannerStructureService,
    public breakpointObserverService: BreakpointObserverService,
    public authService: AuthService,
    private alertService: AlertService) { }

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

  logout(){
    this.authService.logout();
    this.alertService.success("successful loggout!");    
  }
}
