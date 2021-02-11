import { User } from 'src/app/_model/user.interface';
import { AuthService } from 'src/app/_services/auth.service';
import { ContactService } from 'src/app/_services/Contact.service';
import { Contact } from './../../_model/Contact.interface';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { defaultPaginationResult, PaginationResult } from 'src/app/_model/paginationResult.interface';
import { defaultQueryObject, QueryObject } from 'src/app/_model/queryObject.interface';
import { Subscription } from 'rxjs';
import { ProgressSpinnerService } from 'src/app/_services/progress-spinner.service';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-contact-list',
  templateUrl: './contact-list.component.html',
  styleUrls: ['./contact-list.component.css']
})
export class ContactListComponent implements OnInit {
    SortByContactName : string = 'ContactName';
    SortByPhone : string = 'Phone';
    SortByBirthDate : string = 'BirthDate';
    SortByContactType : string = 'ContactType';
    ColumnButton : string = 'Button';

    subscriptionToGetPaginatedContacts : Subscription;
    subscriptionToProgressSpinner : Subscription;  

    isLoadingOrUploading = false;

    paginationResult : PaginationResult<Contact> = defaultPaginationResult;
    queryObject : QueryObject = defaultQueryObject;  
    showProgressSpinner = false;

    displayedColumns: string[] = [this.SortByContactName, this.SortByPhone, this.SortByBirthDate, 
                                  this.SortByContactType, this.ColumnButton];
    dataSource = new MatTableDataSource(this.paginationResult.items);  
    user : User;

    constructor(private contactService : ContactService, 
      public progressSpinnerService : ProgressSpinnerService,
      private authService : AuthService) { }

    ngOnDestroy(): void {
      if (!!this.subscriptionToGetPaginatedContacts) 
        this.subscriptionToGetPaginatedContacts.unsubscribe();
      if (this.subscriptionToProgressSpinner) 
        this.subscriptionToProgressSpinner.unsubscribe();
    }

    ngOnInit() {     
      this.subscriptionToProgressSpinner =
        this.progressSpinnerService.uploadProgress.subscribe(
          res => {
            this.isLoadingOrUploading = !!res && res < 100;
          }
        ); 
        
      this.authService.user
        .pipe(switchMap(u => {
          this.user = u;
          return this.contactService.getPaginatedContacts(this.queryObject)
        })) 
        .subscribe(
          res => this.paginationResult = res
        );  
    } 

    onPageChanged($event: PageEvent){    
      console.log($event);
      this.queryObject.page = $event.pageIndex;
      this.queryObject.pageSize = $event.pageSize;
      this.loadPaginatedContacts();
    }

    loadPaginatedContacts(){
      if (this.subscriptionToGetPaginatedContacts) this.subscriptionToGetPaginatedContacts.unsubscribe();
      this.subscriptionToGetPaginatedContacts 
        = this.contactService.getPaginatedContacts(this.queryObject)
          .subscribe(
            res => this.paginationResult = res
          );
    }

    onSortChange($event : Sort){
        this.queryObject.sortBy = $event.active;
        this.queryObject.isSortAscending = $event.direction == 'asc';  
        this.loadPaginatedContacts();
    }

    deleteContact(id : number){
      this.contactService.deleteContact(id)
      .subscribe(res => {
        this.loadPaginatedContacts();
      });    
    }
}
