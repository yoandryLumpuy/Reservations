import { ReservationService } from './../../_services/Reservation.service';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { PhonePattern } from 'src/app/_model/Constants';
import { Contact } from 'src/app/_model/Contact.interface';
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
  subscription : Subscription; 

  model: ReservationForModifications;
  isEditing = false; 
  reservationId: any;

  form = new FormGroup({
    contactName: new FormControl('', Validators.required),    
    contactTypeId: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(PhonePattern)]),
    birthDate: new FormControl('', Validators.required)
  });

  constructor(private contactService : ContactService, 
    private reservationService : ReservationService, private alertService : AlertService,
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
    
    this.subscription  = this.route.paramMap.pipe(
      switchMap(res =>
        {
           this.isEditing = res.get('id') != null;            
           if (this.isEditing) this.reservationId = res.get('id');  
           return this.reservationService.getReservation(parseInt(this.reservationId));        
        })
      )
      .subscribe(reservation => {
        if (this.isEditing){
          this.form.setValue({
            contactName: reservation.contact.name,    
            contactTypeId: reservation.contact.contactType.id,
            phone: reservation.contact.phone,
            birthDate: reservation.contact.birthDate
          })
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
