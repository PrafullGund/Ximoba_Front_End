import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RealoadServiceService {
  
  private reloadHeaderSubject = new Subject<void>();
  reloadHeader$ = this.reloadHeaderSubject.asObservable();

  triggerReloadHeader() {
    this.reloadHeaderSubject.next();
  }

  private userImageSource = new BehaviorSubject<string | null>(sessionStorage.getItem('Profile'));
  userImage$ = this.userImageSource.asObservable();

  updateUserImage() {
    const image = sessionStorage.getItem('Profile'); 
    this.userImageSource.next(image); 
  }
  setUserImage(newImage: any) {
    sessionStorage.setItem('Profile', newImage);
    this.userImageSource.next(newImage); 
  }
}
