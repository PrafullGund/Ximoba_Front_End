import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { ModalServiceService } from './common_service/modal-service.service';

declare var bootstrap: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'multitainer';

  constructor(
    private router: Router,
    private modalService: ModalServiceService
  ) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        window.scrollTo(0, 0);
      }
    });
  }

  isSignInRoute(): boolean {
    let isRoute =
      this.router.url === '/signin' ||
      this.router.url === '/signup' ||
      this.router.url === '/forgotpassword' ||
      this.router.url === '/resetpassword' ||
      this.router.url === '/share-Expertise' ||
      this.router.url === '/terms-conditions' ||
      this.router.url === '/privacy-policy';
    return isRoute;
  }

  ngOnInit() {
    this.modalService.showModal$.subscribe((shouldOpen) => {
      if (shouldOpen) {
        const modalElement = document.getElementById('CheckLoggedIN');
        const modal = new bootstrap.Modal(modalElement!);
        modal.show();
      }
    });

    this.modalService.closeModal$.subscribe((shouldClose) => {
      if (shouldClose) {
        const modalElement = document.getElementById('CheckLoggedIN');
        const modalInstance = bootstrap.Modal.getInstance(modalElement!);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    });

    this.modalService.showLoginModal$.subscribe((shouldOpen) => {
      if (shouldOpen) {
        const modalElement = document.getElementById('LoggedIN');
        const modal = new bootstrap.Modal(modalElement!);
        modal.show();
      }
    });

    this.modalService.closeLoginModal$.subscribe((shouldClose) => {
      if (shouldClose) {
        const modalElement = document.getElementById('LoggedIN');
        const modalInstance = bootstrap.Modal.getInstance(modalElement!);
        if (modalInstance) {
          modalInstance.hide();
        }
      }
    });
  }
}
