import { defaultQueryObject } from './../../_model/queryObject.interface';
import { ProgressSpinnerService } from './../../_services/progress-spinner.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from 'src/app/_model/user.interface';
import { defaultPaginationResult, PaginationResult } from 'src/app/_model/paginationResult.interface';
import { QueryObject } from 'src/app/_model/queryObject.interface';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-AdminListOfUsers',
  templateUrl: './AdminListOfUsers.component.html',
  styleUrls: ['./AdminListOfUsers.component.css']
})
export class AdminListOfUsersComponent implements OnInit, OnDestroy {
  availableRoles : string[];

  subscription : Subscription;
  subscriptionToUsers : Subscription;
  subscriptionToProgressSpinner : Subscription;

  isLoadingOrUploading = false;

  paginationResult : PaginationResult<User> = defaultPaginationResult;
  queryObject : QueryObject = defaultQueryObject;  
  showProgressSpinner = false;

  displayedColumns: string[] = ['id', 'userName', 'roles'];
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


