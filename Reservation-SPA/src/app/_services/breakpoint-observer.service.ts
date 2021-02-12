import { BreakpointObserver, Breakpoints, BreakpointState } from '@angular/cdk/layout';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BreakpointObserverService {
    inSmallScreen : BehaviorSubject<boolean> 
      = new BehaviorSubject<boolean>(false);

    constructor(private breakpointObserver : BreakpointObserver) { 
      this.breakpointObserver.observe([
        Breakpoints.XSmall
      ]).subscribe( (state: BreakpointState) => {
        this.inSmallScreen.next(state.breakpoints[Breakpoints.XSmall]); 
      });
    }
}
