import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';


@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.css']
})
export class AlertComponent implements OnInit {
  public backgroundColor: string = 'transparent';
  public message: string;
  public linesArray : string[] = [];  

  constructor(@Inject(MAT_SNACK_BAR_DATA) data: any) { 
    if (!!data?.backgroundColor) this.backgroundColor = data?.backgroundColor;
    if (!!data?.message) this.message = data?.message;
  }

  ngOnInit() {
    if (this.message) {
       this.linesArray = this.message ? this.message.split('\n') : []; 
    }
  }
}
