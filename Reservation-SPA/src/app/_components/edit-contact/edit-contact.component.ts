import { ContactType } from './../../_model/ContactType.interface';
import { ContactService } from './../../_services/Contact.service';
import { observable, Observable, Subscription } from 'rxjs';
import { PhonePattern } from './../../_model/Constants';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Contact } from 'src/app/_model/Contact.interface';
import { AlertService } from 'src/app/_services/alert.service';
import { forkJoin } from 'rxjs';
import {  ActivatedRoute, Router } from '@angular/router';
import { ContactForModifications } from 'src/app/_model/ContactForModifications.interface';
import { parse } from 'path';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit, OnDestroy {
  contacts: Contact[] = [];
  contactTypes: ContactType[] = [];
  subscription : Subscription; 

  model: ContactForModifications;
  isEditing = false; 
  contactId: any;

  form = new FormGroup({
    contactName: new FormControl('', Validators.required),    
    contactTypeId: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(PhonePattern)]),
    birthDate: new FormControl('', Validators.required)
  });

  constructor(private contactService : ContactService, private alertService : AlertService,
    private router : Router, private  route : ActivatedRoute) { 
        this.subscription  = route.paramMap.subscribe(res =>
        {
           this.isEditing = res.get('id') != null;            
           if (this.isEditing) this.contactId = res.get('id');           
        });
  } 

  get contactName(){
     return this.form.controls['contactName'] 
  }

  get contactTypeId(){
    return this.form.controls['contactTypeId'] 
  }

  get phone(){
    return this.form.controls['phone'] 
  }

  get birthDate(){
    return this.form.controls['birthDate'] 
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  ngOnInit() {
    forkJoin([
      this.contactService.getAllContacts(),
      this.contactService.getAllContactTypes()
    ])
    .subscribe(data => {
        this.contacts = data[0];
        this.contactTypes = data[1];
    }, 
    error => {
      if (error.status == 404)
        {
            this.alertService.error("There was an error retrieving data!");
            this.router.navigate(['']);
        }
    });  
    
    if (this.isEditing)
      this.contactService.getContact(parseInt(this.contactId))
        .subscribe(contact => 
          {

            this.form.setValue({
              contactName: contact.name,    
              contactTypeId: contact.contactType.id,
              phone: contact.phone,
              birthDate: contact.birthDate
            });
          },
          error => {
            if (error.status == 404)
              {
                  this.alertService.error("There was an error retrieving data!");
                  this.router.navigate(['']);
              }
          });    
  }

  onSubmit(){
    this.model = {...this.form.value};
    this.contactService.postContact(this.model)
      .subscribe(res => {
          this.alertService.success(`Contact successfully ${this.isEditing ? 'updated' : 'created'}`);
      });
  }
}
