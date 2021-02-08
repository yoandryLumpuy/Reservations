import { AlertService } from './../../_services/alert.service';
import { AlertComponent } from './../../_services/alert/alert.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatInputModule} from '@angular/material/input';
import { AuthService } from './../../_services/auth.service';
import { HttpClient } from '@angular/common/http';
import { Component, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-navBar',
  templateUrl: './navBar.component.html',
  styleUrls: ['./navBar.component.css']
})
export class NavBarComponent{
  model : any = {userName:'', password: ''};  
   
  constructor(private http : HttpClient,
    public authService : AuthService,
    private alertService: AlertService) { }

  login(){
    this.authService.login(this.model)
    .subscribe(res => {
      this.alertService.success("successfully logged!");      
    });
  }

  register(){
    this.authService.register(this.model)
    .subscribe(res => {
      this.alertService.success("successfully registered!");          
    });
  }

  logout(){
    this.authService.logout();
    this.alertService.success("successful loggout!");    
  }

}
