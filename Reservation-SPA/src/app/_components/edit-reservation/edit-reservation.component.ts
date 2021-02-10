import { Reservation } from './../../_model/reservation.interface';
import { User } from './../../_model/user.interface';
import { Contact } from './../../_model/Contact.interface';
import { AuthService } from './../../_services/auth.service';
import { ReservationService } from './../../_services/Reservation.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap} from 'rxjs/operators';
import { PhonePattern } from 'src/app/_model/Constants';
import { ContactType } from 'src/app/_model/ContactType.interface';
import { ReservationForModifications } from 'src/app/_model/ReservationForModifications.interface';
import { AlertService } from 'src/app/_services/alert.service';
import { ContactService } from 'src/app/_services/Contact.service';

@Component({
  selector: 'app-edit-reservation',
  templateUrl: './edit-reservation.component.html',
  styleUrls: ['./edit-reservation.component.css']
})
export class EditReservationComponent implements OnInit {
  contacts: Contact[] = [];
  contactTypes: ContactType[] = [];
  subscriptionLoadData : Subscription;   
  subscriptionFillForm : Subscription;

  model: ReservationForModifications;
  isEditingReservation = false; 
  reservationId: any;
  disableContactEdition = false; 

  form = new FormGroup({
    contactName: new FormControl('', Validators.required),    
    contactTypeId: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(PhonePattern)]),
    birthDate: new FormControl('', Validators.required)
  });

  constructor(private contactService : ContactService, 
    private reservationService : ReservationService, private alertService : AlertService,
    private authService : AuthService,
    private router : Router, private  route : ActivatedRoute) {         
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
    this.subscriptionLoadData = forkJoin([
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
  }

  fillForm(){
    if (this.subscriptionFillForm) this.subscriptionFillForm.unsubscribe();
    this.subscriptionFillForm  = this.route.paramMap.pipe(
      switchMap(res =>
        {
           this.isEditingReservation = res.get('id') != null;            
           if (this.isEditingReservation) this.reservationId = res.get('id');  
           return this.reservationService.getReservation(parseInt(this.reservationId));        
        })
      )
      .subscribe(reservation => {
        if (this.isEditingReservation) this.fillReservationData(reservation);        
      },
      (error) => {}); 
  }

  fillContactData(c : Contact){ 
    //set values in the form
    this.form.setValue({
      contactName: c.name,    
      contactTypeId: c.contactType.id,
      phone: c.phone,
      birthDate: c.birthDate
    })
  }

  fillReservationData(r : Reservation){ 
    //set values in the form
    this.form.setValue({
      contactName: r.contact.name,    
      contactTypeId: r.contact.contactType.id,
      phone: r.contact.phone,
      birthDate: r.contact.birthDate
    })
  }

  includeContactToSourceLists(c : Contact){
    //update souce list for mat-autocomplete component 
    var index = this.contacts.findIndex(c => c.id == c.id);    
    if (index != -1)
      this.contacts.splice(index, 1, c);
    else
      this.contacts.push(c); 

    //update souce list for the mat-select component in contactTypes edition
    index = this.contactTypes.findIndex(ct => ct.id == c.contactType.id);    
    if (index != -1)
      this.contactTypes.splice(index, 1, c.contactType);
    else 
      this.contactTypes.push(c.contactType);
  }

  onContactNameChange($event: any){
    var user: User;
    if (!!$event) 
      this.authService.user.pipe(
      switchMap(u => {
         user = u; 
         return this.contactService.getContactByName($event.target.value);
      }))
      .subscribe(c =>{  
        this.includeContactToSourceLists(c);            
        this.fillContactData(c);
        this.disableContactEdition = user.id !== c.CreatedByUser.id         
      },
      (error) => {});
  }

  onSubmit(){
    this.model = {...this.form.value};
    this.contactService.postContact(this.model)
      .subscribe(res => {
          this.alertService.success(`Contact successfully ${this.isEditingReservation ? 'updated' : 'created'}`);
      });
  }
}
