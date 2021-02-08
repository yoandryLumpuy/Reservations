import { User } from './../_model/user.interface';
import { AuthService } from './../_services/auth.service';
import { Directive, Input, TemplateRef, ViewContainerRef, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

@Directive({
  selector: '[userWithRoles]'
})
export class UserWithRolesDirective implements OnInit, OnDestroy{
  @Input('userWithRoles') roles: string[] = [];  
  user : User;
  isVisible : boolean = false;  
  subscription: Subscription;

  constructor(private viewContainerRef : ViewContainerRef, 
    private templateRef : TemplateRef<any>, 
    private authService: AuthService) { }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  ngOnInit(): void {
    this.subscription = this.authService.user.subscribe(user => 
    {
      this.user = user;
      if (!this.user) 
      {
        this.isVisible = false; 
        this.viewContainerRef.clear(); 
        return      
      }
      
      var thereIsMatch = false;
      for(const role of this.roles)
        if (this.user.roles.includes(role))
        {
            thereIsMatch = true;
            break;
        }
      this.viewContainerRef.clear();  
      if (thereIsMatch){
        this.isVisible = true;        
        this.viewContainerRef.createEmbeddedView(this.templateRef);
      }
      else{
        this.isVisible = false;
        this.viewContainerRef.clear();
      }
    });
  }
}
