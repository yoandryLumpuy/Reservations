import { ContactForModifications } from './../_model/ContactForModifications.interface';
import { ContactType } from './../_model/ContactType.interface';
import { Contact } from './../_model/Contact.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { from, Observable} from "rxjs";
import { environment } from 'src/environments/environment';
import { QueryObject } from '../_model/queryObject.interface';
import { PaginationResult } from '../_model/paginationResult.interface';

@Injectable({
  providedIn: 'root'
})
export class ContactService {

  constructor(private http : HttpClient, private authService: AuthService, 
    private router : Router, private alertService: AlertService) { }

    getAllContacts() : Observable<Contact[]>{
      if (!this.authService.loggedIn) {
        this.router.navigate(['/']);
        this.alertService.error("Please log in!");
        return from([]);
      };
      return this.http.get<Contact[]>(`${environment.baseUrl}contacts/all`);
    }

    getAllContactTypes() : Observable<ContactType[]>{
      if (!this.authService.loggedIn) {
        this.router.navigate(['/']);
        this.alertService.error("Please log in!");
        return from([]);
      };
      return this.http.get<ContactType[]>(`${environment.baseUrl}contacts/contacttypes`);
    }

    deleteContact(contactId : number){
      return this.http.delete(`${environment.baseUrl}contacts/${contactId}`);
    }

    postContact(contactForModifications : ContactForModifications){
      return this.http.post<Contact>(`${environment.baseUrl}contacts`, contactForModifications);
    }

    getContactById(id: number){
      return this.http.get<Contact>(`${environment.baseUrl}contacts/${id}`);
    }

    getContactByName(contactName : string){
      return this.http.get<Contact>(`${environment.baseUrl}contacts/byname/${contactName}`);
    }

    getPaginatedContacts(queryObject: QueryObject) : Observable<PaginationResult<Contact>>{           
      return this.http.get<PaginationResult<Contact>>(environment.baseUrl + "contacts?"+ this.queryObjectToString(queryObject), 
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
}
