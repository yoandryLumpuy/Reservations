import { Subject } from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ProgressSpinnerService {
  uploadProgress: Subject<number> = new Subject();

  constructor() { }

  updateProgress(param : any){
    this.uploadProgress.next(param);
  }
}


