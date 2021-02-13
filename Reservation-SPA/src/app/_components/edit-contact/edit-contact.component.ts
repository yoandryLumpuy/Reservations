import { BannerStructureService } from 'src/app/_services/banner-structure.service';
import { User } from './../../_model/user.interface';
import { AuthService } from './../../_services/auth.service';
import { Contact } from './../../_model/Contact.interface';
import { catchError, switchMap } from 'rxjs/operators';
import { ContactType } from './../../_model/ContactType.interface';
import { ContactService } from './../../_services/Contact.service';
import { Observable, of, Subscription } from 'rxjs';
import { defaultBannerStructure, PhonePattern, PhonePlaceHolder } from './../../_model/Constants';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AlertService } from 'src/app/_services/alert.service';
import { forkJoin } from 'rxjs';
import {  ActivatedRoute, Router } from '@angular/router';
import { ContactForModifications } from 'src/app/_model/ContactForModifications.interface';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit, OnDestroy {
  contactTypes: ContactType[] = [];
  subscriptionLoadData : Subscription; 
  subscriptionFillForm : Subscription;
  phonePlaceHolder = PhonePlaceHolder;

  model: ContactForModifications;
  isEditing = false; 
  contactId: any = 0;
  disableContactEdition = false; 

  contact: Contact;

  form = new FormGroup({
    contactName: new FormControl('', Validators.required),    
    contactTypeId: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(PhonePattern)]),
    birthDate: new FormControl('', Validators.required)
  });

  constructor(private contactService : ContactService, 
    private alertService : AlertService,
    private router : Router, private  route : ActivatedRoute,
    private authService : AuthService,
    private bannerStructureService: BannerStructureService) {         
  } 

  get contactName(){
     return this.form.controls['contactName'] as FormControl
  }

  get contactTypeId(){
    return this.form.controls['contactTypeId'] as FormControl
  }

  get phone(){
    return this.form.controls['phone'] as FormControl
  }

  get birthDate(){
    return this.form.controls['birthDate'] as FormControl
  }

  ngOnDestroy(): void {
    if (this.subscriptionLoadData) this.subscriptionLoadData.unsubscribe();
    if (this.subscriptionFillForm) this.subscriptionFillForm.unsubscribe();
  }

  ngOnInit() { 
     this.loadData(); 
     this.fillForm();      
  }

  loadData(){
    if (this.subscriptionLoadData) this.subscriptionLoadData.unsubscribe();
    this.subscriptionLoadData = 
      this.contactService.getAllContactTypes()
      .subscribe(ct => {
        this.contactTypes = ct; 
      }, 
      error => {
        if (error.status == 404)
          {
              this.alertService.error("There was an error retrieving data!");
              this.router.navigate(['']);
          }
      });
  }

  fillForm(){
    if (this.subscriptionFillForm) this.subscriptionFillForm.unsubscribe();
    this.subscriptionFillForm  = this.route.paramMap.pipe(
      switchMap(res =>
        {
           this.isEditing = res.get('id') != null;    
           if (this.isEditing) {
              this.contactId = res.get('id'); 
              this.bannerStructureService.updateBanner({
                ...defaultBannerStructure,
                emittedBy: this,
                leftText: 'Edit Contact',
                navigationButtonText: 'Reservations List'
              });
           }
           else {
              this.contactName.setAsyncValidators(this.contactAlreadyExist.bind(this));    
              this.contactName.updateValueAndValidity();
              this.bannerStructureService.updateBanner({
                ...defaultBannerStructure,
                emittedBy: this,
                leftText: 'Create Contact',
                navigationButtonText: 'Reservations List'
              });
           }          

           return this.contactService.getContactById(parseInt(this.contactId));        
        })
      )
      .subscribe(contact => this.fillContactData(contact),
      (error) => {});
  }

  fillContactData(c : Contact){ 
    var values = this.form.value;
    //set values in the form    
    this.form.setValue({
      ...values,
      contactName: c.name,    
      contactTypeId: c.contactType.id,
      phone: c.phone,
      birthDate: c.birthDate
    });
    if (this.isEditing) this.contactName.disable()
    else this.contactName.enable();
  }

  includeContactTypeToSourceLists(c : Contact){ 
    //update souce list for the mat-select component in contactTypes edition
    var index = this.contactTypes.findIndex(ct => ct.id == c.contactType.id);    
    if (index != -1)
      this.contactTypes.splice(index, 1, c.contactType);
    else 
      this.contactTypes.push(c.contactType);
  }

  onSubmit(){
    this.model = {...this.form.value};
    this.contactService.postContact(this.model)
      .subscribe(res => {
          this.alertService.success(`Contact successfully ${this.isEditing ? 'updated' : 'created'}`);
      });
  }

  contactAlreadyExist(control: AbstractControl): 
              Promise<ValidationErrors | null> | Observable<ValidationErrors | null>{  
        return this.contactService.getContactByName(control.value)
           .pipe(switchMap(c => { 
              this.includeContactTypeToSourceLists(c);             
              return of({contactAlreadyExist: true});
           }),
           catchError(error => {
             return of(null);
           }));
  }  
}
