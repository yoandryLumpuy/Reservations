import { ReservationService } from 'src/app/_services/Reservation.service';
import { BreakpointObserverService } from 'src/app/_services/breakpoint-observer.service';
import { BannerStructureService } from 'src/app/_services/banner-structure.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { defaultPaginationResult, PaginationResult } from 'src/app/_model/paginationResult.interface';
import { defaultQueryObject, QueryObject } from 'src/app/_model/queryObject.interface';
import { Reservation } from 'src/app/_model/reservation.interface';
import { User } from 'src/app/_model/user.interface';
import { ProgressSpinnerService } from 'src/app/_services/progress-spinner.service';
import { defaultBannerStructure } from 'src/app/_model/Constants';



@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {  
  subscriptionToProgressSpinner : Subscription;
  subscriptionToBreakpointObserver: Subscription;

  paginationResult: PaginationResult<Reservation> = defaultPaginationResult; 

  SortByContactName : string = "ContactName";
  SortByCreatedDateTime : string = "CreatedDateTime";

  inSmallScreen = false;

  isLoadingOrUploading = false;

  constructor(public progressSpinnerService : ProgressSpinnerService,
    private bannerStructureService: BannerStructureService,
    private breakpointObserverService: BreakpointObserverService,
    private reservationService: ReservationService) { }

  ngOnDestroy(): void {
    if (this.subscriptionToProgressSpinner) this.subscriptionToProgressSpinner.unsubscribe();
    if (this.subscriptionToBreakpointObserver) 
      this.subscriptionToBreakpointObserver.unsubscribe();
  }

  ngOnInit() {     
     this.subscriptionToProgressSpinner =
      this.progressSpinnerService.uploadProgress.subscribe(
        res => {
          this.isLoadingOrUploading = !!res && res < 100;
        }
      ); 

    this.subscriptionToBreakpointObserver 
      = this.breakpointObserverService.inSmallScreen.subscribe(res => {
        this.inSmallScreen = res;
      });

    this.bannerStructureService.updateBanner({
        ...defaultBannerStructure,
        leftText: 'Reservations List',
        middleText : 'Lorem ipsum dolor sit, amet consectetur adipisicing elit.' 
                      + 'Rem similique doloribus sunt earum commodi ad exercitationem error illum sed nam.',
        navigationButtonText: 'Reservation List',
        emittedBy: this
      }); 
      
    this.reservationService.getReservations(defaultQueryObject).subscribe(      
      res => {
        console.log(res);
        this.paginationResult = res;
      }
    ); 
  }  
}
