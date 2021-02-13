import { NavigateToCreateReservation } from './../../_model/Constants';
import { FormControl } from '@angular/forms';
import { AuthService } from 'src/app/_services/auth.service';
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
import { PageEvent } from '@angular/material/paginator';

interface SortOptions 
{
  title: string; 
  sortByKey: string;
  isSortAscending: boolean
}

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {  
  subscriptionToProgressSpinner : Subscription;
  subscriptionToBreakpointObserver: Subscription;
  subscriptionToGetPaginatedReservations: Subscription;

  paginationResult: PaginationResult<Reservation> = defaultPaginationResult; 
  queryObject : QueryObject = defaultQueryObject;  
  
  SortByContactName = "ContactName";
  SortByCreatedDateTime = "CreatedDateTime";
  SortByRanking = "Ranking";

  sortOptions : SortOptions[] = [{title: "By Date Ascending", sortByKey: this.SortByCreatedDateTime, isSortAscending: true}, 
          {title: "By Date Descending", sortByKey: this.SortByCreatedDateTime, isSortAscending: false},
          {title: "By Alphabetic Ascending", sortByKey: this.SortByContactName, isSortAscending: true},
          {title: "By Alphabetic Descending", sortByKey: this.SortByContactName, isSortAscending: false},
          {title: "By Ranking", sortByKey: this.SortByRanking, isSortAscending: false}];

  inSmallScreen = false;

  isLoadingOrUploading = false;

  selectSortOption = new FormControl();

  constructor(public progressSpinnerService : ProgressSpinnerService,
    private bannerStructureService: BannerStructureService,
    private breakpointObserverService: BreakpointObserverService,
    private reservationService: ReservationService,
    private auth : AuthService) { }

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
        navigationButtonText: NavigateToCreateReservation,
        emittedBy: this
    });        
        
    this.selectSortOption.valueChanges.subscribe((res : SortOptions) =>
      {
          this.onSortChange(res);
      });
    this.selectSortOption.setValue(this.sortOptions[0]);  
  }  

  loadPaginatedReservations(){
    if (this.subscriptionToGetPaginatedReservations) 
        this.subscriptionToGetPaginatedReservations.unsubscribe();

    this.subscriptionToGetPaginatedReservations 
        = this.reservationService.getReservations(this.queryObject).subscribe(      
          res => this.paginationResult = res
        );
  }

  onSortChange(option : SortOptions){
    this.queryObject.sortBy = option.sortByKey;
    this.queryObject.isSortAscending = option.isSortAscending;  
    this.loadPaginatedReservations();  
  }

  onPageChanged($event: PageEvent){   
    this.queryObject.page = $event.pageIndex;
    this.queryObject.pageSize = $event.pageSize;
    this.loadPaginatedReservations();
  }
}
