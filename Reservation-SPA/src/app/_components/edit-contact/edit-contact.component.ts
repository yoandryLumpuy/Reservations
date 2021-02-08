import { Observable } from 'rxjs';
import { PhonePattern } from './../../_model/Constants';
import { validateVerticalPosition } from '@angular/cdk/overlay';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit-contact',
  templateUrl: './edit-contact.component.html',
  styleUrls: ['./edit-contact.component.css']
})
export class EditContactComponent implements OnInit {
  filteredOptions: string[] = [];

  form = new FormGroup({
    userName: new FormControl('', Validators.required),
    birthdate: new FormControl('', Validators.required),
    phone: new FormControl('', [Validators.required, Validators.pattern(PhonePattern)]),
    contactTypeId: new FormControl('', Validators.required)
  });

  constructor() { }

  ngOnInit() {
    
  }

}
