import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Subscription } from 'rxjs';
import { defaultPaginationResult, PaginationResult } from 'src/app/_model/paginationResult.interface';
import { defaultQueryObject, QueryObject } from 'src/app/_model/queryObject.interface';
import { Reservation } from 'src/app/_model/reservation.interface';
import { User } from 'src/app/_model/user.interface';
import { ProgressSpinnerService } from 'src/app/_services/progress-spinner.service';

@Component({
  selector: 'app-reservation-list',
  templateUrl: './reservation-list.component.html',
  styleUrls: ['./reservation-list.component.css']
})
export class ReservationListComponent implements OnInit {
  availableRoles : string[];

  subscription : Subscription;
  subscriptionToUsers : Subscription;
  subscriptionToProgressSpinner : Subscription;

  isLoadingOrUploading = false;

  paginationResult : PaginationResult<Reservation> = defaultPaginationResult;
  queryObject : QueryObject = defaultQueryObject;  
  showProgressSpinner = false;

  displayedColumns: string[] = ['contactName', 'userName', 'roles'];
  dataSource = new MatTableDataSource(this.paginationResult.items);  

  constructor(public progressSpinnerService : ProgressSpinnerService) { }

  ngOnDestroy(): void {
    if (!!this.subscription) this.subscription.unsubscribe();
    if (!!this.subscriptionToUsers) this.subscriptionToUsers.unsubscribe();
    if (this.subscriptionToProgressSpinner) this.subscriptionToProgressSpinner.unsubscribe();
  }

  ngOnInit() {     
     this.subscriptionToProgressSpinner =
      this.progressSpinnerService.uploadProgress.subscribe(
        res => {
          this.isLoadingOrUploading = !!res && res < 100;
        }
      ); 
  } 
  
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
}
