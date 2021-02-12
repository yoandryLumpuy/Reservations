import { defaultReservationForModifications } from './../_model/ReservationForModifications.interface';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BannerStructure, defaultBannerStructure } from '../_model/Constants';

@Injectable({
  providedIn: 'root'
})
export class BannerStructureService {    
  observer : BehaviorSubject<BannerStructure> = new BehaviorSubject<BannerStructure>(defaultBannerStructure);

  constructor() { }

  updateBanner(bannerStructure : BannerStructure){    
    this.observer.next(bannerStructure);
  }  
}
