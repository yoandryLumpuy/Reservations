import { Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {

  model : any = {userName:'', password: ''};  
  subscription: Subscription;
   
  constructor(private http : HttpClient,
    public authService : AuthService,
    private alertService: AlertService) { } 
    
  ngOnInit(): void {
    
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  login(){
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.authService.login(this.model)
    .subscribe(() => {
      this.alertService.success("successfully logged!");  
    });    
  }

  register(){
    if (this.subscription) this.subscription.unsubscribe();

    this.subscription = this.authService.register(this.model)
    .subscribe(() => {
      this.alertService.success("successfully registered!");          
    });
  }

  logout(){
    this.authService.logout();
    this.alertService.success("successful loggout!");    
  }
}
