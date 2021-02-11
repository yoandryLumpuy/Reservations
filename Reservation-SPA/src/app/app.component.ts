import { FormGroup, FormControl, Validators } from '@angular/forms';
import { AuthService } from './_services/auth.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{
  constructor(private authService : AuthService){}   

  ngOnInit(): void {    
    setTimeout(() => this.authService.autologin(), 10);
  }
}
