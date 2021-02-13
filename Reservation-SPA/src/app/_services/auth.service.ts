import { defaultUser, User } from 'src/app/_model/user.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { JwtHelperService } from "@auth0/angular-jwt";
import { environment } from './../../environments/environment';
import {switchMap, tap} from 'rxjs/operators';
import { Subject, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {  
  helper = new JwtHelperService();
  user: BehaviorSubject<User> = new BehaviorSubject<User>(defaultUser);
  timeoutTimer : any;

  constructor(private http: HttpClient, private router: Router, private alertService: AlertService) {    
  }

  get loggedIn() : boolean{
    var token = localStorage.getItem('token');
    return !!token && !this.helper.isTokenExpired(token ?? undefined);
  }

  emitUser(value: User){
    this.user.next(value);
  }

  get token(): string | null{    
      return this.loggedIn ? localStorage.getItem('token') : null;
  }

  get decodedToken(){
    var token = localStorage.getItem('token');
    if (token) {
      return this.helper.decodeToken(token);
    }else {
      return {};
    }
  }

  login(model : {userName: string; password: string}){
    return this.http.post<{token : string; user: User}>(environment.baseUrl + 'auth/login', model)
           .pipe(tap(res => {             
             localStorage.setItem('token', res.token); 
             localStorage.setItem('user', JSON.stringify(res.user));  
             this.emitUser(res.user);
             this.configureAutoLogout();                         
            }));
  }

  register(model : {userName: string; password: string}){
    return this.http.post(environment.baseUrl + 'auth/register', model)
           .pipe(switchMap(res => this.login(model)));
  }

  logout(){    
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.emitUser(defaultUser);
    this.router.navigate(['/']);
    if (!!this.timeoutTimer) clearTimeout(this.timeoutTimer);
  }

  configureAutoLogout(){
    var token = localStorage.getItem('token');
    if (!token || !this.helper.getTokenExpirationDate(token) || this.helper.isTokenExpired(token)) 
    {
      if (!!this.timeoutTimer) clearTimeout(this.timeoutTimer);
      return;
    }
     
    this.timeoutTimer = setTimeout(() => this.logout(),
    (this.helper.getTokenExpirationDate(token) as Date).getTime() - new Date().getTime());
  }

  autologin(){
    var token = localStorage.getItem('token');
    if (!token || this.helper.isTokenExpired(token ?? undefined)) {
      this.emitUser(defaultUser);      
      return;
    };

     var userFromLocalStorage = localStorage.getItem('user'); 
     if (!userFromLocalStorage) {
        this.emitUser(defaultUser);        
        return;
     }

     var userClientApp : User = JSON.parse(userFromLocalStorage);     
     if (!userClientApp) {
        this.emitUser(defaultUser);        
        return;
     };
     
     this.emitUser(userClientApp);
  }

  matchRoles(roles: string[] = []) : boolean{
    var decodedToken = this.decodedToken;

    if (!decodedToken) return false;
    var rolesFromDecodedToken = decodedToken.role as Array<string>;

    for(const item of roles)
      if (rolesFromDecodedToken.includes(item)) 
        return true;
        
    return false;
  }
}
 