import { ProgressSpinnerService } from './progress-spinner.service';
import { tap } from 'rxjs/operators';
import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UploadProgressInterceptorService implements HttpInterceptor {

constructor(private  progressSpinnerService : ProgressSpinnerService, private ngZone: NgZone) { }
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (req.reportProgress) {
      // only intercept when the request is configured to report its progress
      return next.handle(req).pipe(
        tap((event: HttpEvent<any>) => {
          if (event.type === HttpEventType.UploadProgress || event.type === HttpEventType.DownloadProgress) {
            this.progressSpinnerService.updateProgress(
              event.loaded != undefined && event.total != undefined 
              ? Math.round(event.loaded / event.total * 100) 
              : 100);
          } else if (event.type === HttpEventType.Response) {
            this.progressSpinnerService.updateProgress(undefined); // hide progress bar
          }
        }, error => {
          this.progressSpinnerService.updateProgress(undefined); // hide progress bar
        })
      );
    } else {
      return next.handle(req);
    }
  }

}
