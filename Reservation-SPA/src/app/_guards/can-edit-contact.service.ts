import { ContactService } from 'src/app/_services/Contact.service';
import { User } from 'src/app/_model/user.interface';
import { switchMap, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/_services/auth.service';
import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AlertService } from '../_services/alert.service';

@Injectable({
  providedIn: 'root'
})
export class CanEditContactGuard  implements CanActivate{

  constructor(private authService : AuthService, private router : Router, 
      private alertService : AlertService, private contactService : ContactService) { }
      
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {    
    var userAux : User;    
    return this.authService.user
            .pipe(switchMap(u => {
              userAux = u;
              var id : any = route.paramMap.get('id');
              return this.contactService.getContactById(id ?? 0);
            }))
            .pipe(switchMap(contact => {
               var canPass = contact.createdByUser.id == userAux.id;
               if (!canPass) {
                 this.alertService.error('You are not the owner of this contact. You can not modify it!');
                 this.router.navigate(['reservations']);                 
               }
               return of(canPass); 
            }),
            catchError(error => {              
              this.alertService.error('The Contact you are trying to edit, does not exist!');
              this.router.navigate(['reservations']);                 
              return of(false)
            }));
  }
}
