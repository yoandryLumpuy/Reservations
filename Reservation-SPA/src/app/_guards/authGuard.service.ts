import { AlertComponent } from './../_services/alert/alert.component';
import { AuthService } from './../_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AlertService } from '../_services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate{
  constructor(private authService : AuthService, private router: Router,
    private alertService: AlertService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {    
    var logguedIn = this.authService.loggedIn;
    if (!logguedIn) 
    {
      this.router.navigate(['']);
      this.alertService.error('You are not allowed. Please signIn!');
      return false;
    }

      
    var arrayOfRoles = route.firstChild?.data['roles'] as string[];
    if (!!arrayOfRoles && arrayOfRoles.length > 0){
      var allowedAccess = this.authService.matchRoles(arrayOfRoles);
      if (!allowedAccess){
        this.router.navigate(['']);
        this.alertService.error('You are not allowed to access this area for admninistrators!');
      }
      return allowedAccess;
    }

    return true;
  }
}
