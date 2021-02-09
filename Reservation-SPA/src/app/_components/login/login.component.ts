import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { AlertService } from 'src/app/_services/alert.service';
import { AuthService } from 'src/app/_services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  model : any = {userName:'', password: ''};  
   
  constructor(private http : HttpClient,
    public authService : AuthService,
    private alertService: AlertService) { }
    
  ngOnInit(): void {
    throw new Error('Method not implemented.');
  }

  login(){
    this.authService.login(this.model)
    .subscribe(() => {
      this.alertService.success("successfully logged!");      
    });
  }

  register(){
    this.authService.register(this.model)
    .subscribe(() => {
      this.alertService.success("successfully registered!");          
    });
  }

  logout(){
    this.authService.logout();
    this.alertService.success("successful loggout!");    
  }
}
