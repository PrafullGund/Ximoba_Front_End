import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { finalize, Observable } from 'rxjs';
import { SpinnerServiceService } from '../Loader/spinner-service.service';

@Injectable({
  providedIn: 'root'
})
export class InterceptorService implements HttpInterceptor {

  constructor(private loadingService: SpinnerServiceService) {}


  // intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
  //   const token = sessionStorage.getItem('Authorization');

  //   if (token) {
  //     const cloned = req.clone({
  //       headers: req.headers.set("Authorization", `Bearer ${token}`)
  //     });

  //     return next.handle(cloned);
  //   } else {
  //     return next.handle(req);
  //   }
  // }

  // intercept(
  //   request: HttpRequest<unknown>,
  //   next: HttpHandler
  // ): Observable<HttpEvent<unknown>> {
  //   this.loadingService.show();
  //   return next.handle(request).pipe(finalize(() => this.loadingService.hide()));
  // }
  
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Show spinner
    this.loadingService.show();
    const token = sessionStorage.getItem('Authorization');
    const clonedRequest = token
      ? req.clone({
          headers: req.headers.set('Authorization', `Bearer ${token}`),
        })
      : req;
    return next.handle(clonedRequest).pipe(finalize(() => this.loadingService.hide()));
  }
 
}
