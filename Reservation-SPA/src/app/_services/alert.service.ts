import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { Injectable, NgZone } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private duration : number = 2000;

  constructor(private snackBar : MatSnackBar, private matDialog : MatDialog,
    private ngZone : NgZone) { }

  success(message : string){  
    this.ngZone.run(() => {
      this.snackBar.openFromComponent(AlertComponent, {
        data: {
          message,
          backgroundColor: 'green'
        },
        duration: this.duration,
        horizontalPosition: "center",
        verticalPosition: "bottom"
      });
    });  
  }

  error(message : string){
    this.ngZone.run(() => {
      this.snackBar.openFromComponent(AlertComponent, {
        data: {      
          message,
          backgroundColor: 'red'
        },
        duration: this.duration,
        horizontalPosition: "center",
        verticalPosition: "bottom"
      });
    });  
  }

  message(message : string){
    this.ngZone.run(() => {
      this.snackBar.openFromComponent(AlertComponent, {
        data: {
          message,
          backgroundColor: 'transparent'
        },
        duration: this.duration,
        horizontalPosition: "center",
        verticalPosition: "bottom"
      });
    });  
  }

  confirm(message: string, callBack: () => void){  
    this.ngZone.run(() => {
      this.matDialog.open(ConfirmDialogComponent, {
        width: '300px',
        data: {message}
      }).afterClosed()
      .subscribe(res => {
        if (res) callBack();
      });
    });    
  }
}




