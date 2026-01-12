import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {

  constructor() { }
  
  private showModalSubject = new Subject<boolean>();
  showModal$ = this.showModalSubject.asObservable();

  private closeModalSubject = new Subject<boolean>();
  closeModal$ = this.closeModalSubject.asObservable();

  private showLoginModalSubject = new Subject<boolean>();
  showLoginModal$ = this.showLoginModalSubject.asObservable();

  private closeLoginModalSubject = new Subject<boolean>();
  closeLoginModal$ = this.closeLoginModalSubject.asObservable();

  openModal() {
    this.showModalSubject.next(true);
  }

  closeModal() {
    this.closeModalSubject.next(true);
  }

  openLoginModal(){
    this.showLoginModalSubject.next(true);
  }

  CloseLoginModal(){
    this.closeLoginModalSubject.next(true);
  }

}
