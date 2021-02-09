import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { AlertComponent } from './alert/alert.component';
import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material/snack-bar';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
private duration : number = 5000;

constructor(private snackBar : MatSnackBar, private matDialog : MatDialog) { }

success(message : string){  
  this.snackBar.openFromComponent(AlertComponent, {
    data: {
      message,
      backgroundColor: 'green'
    },
    duration: this.duration,
    horizontalPosition: "center",
    verticalPosition: "bottom"
  });
}

error(message : string){
  this.snackBar.openFromComponent(AlertComponent, {
    data: {      
      message,
      backgroundColor: 'red'
    },
    duration: this.duration,
    horizontalPosition: "center",
    verticalPosition: "bottom"
  });
}

message(message : string){
  this.snackBar.openFromComponent(AlertComponent, {
    data: {
      message,
      backgroundColor: 'transparent'
    },
    duration: this.duration,
    horizontalPosition: "center",
    verticalPosition: "bottom"
  });
}

confirm(message: string, callBack: () => void){  
  this.matDialog.open(ConfirmDialogComponent, {
    width: '300px',
    data: {message}
  }).afterClosed()
  .subscribe(res => {
    if (res) callBack();
  });
}
}




