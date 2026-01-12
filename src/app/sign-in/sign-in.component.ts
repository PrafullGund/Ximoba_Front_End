import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import { Router } from '@angular/router';
import { AuthServiceService } from '../common_service/auth-service.service';
import Swal from 'sweetalert2';
import { jwtDecode } from "jwt-decode";
import { RealoadServiceService } from '../common_service/reaload-service.service';
import { ModalServiceService } from '../common_service/modal-service.service';
import { NgForm } from '@angular/forms';
declare var bootstrap: any;


@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})

export class SignInComponent implements OnInit {

  email_id: string = '';
  password: string = '';
  message: string = '';
  show: boolean = false;
  rememberMe: boolean = false;
  token = "";
  decoded: any;

  constructor(
    private loginService: LoginService,
    private router: Router,
    private authService: AuthServiceService,
    private route: Router,
    private modalService: ModalServiceService,
    private realoadservice: RealoadServiceService
  ) { }

  ngOnInit(): void {

  }



  onSubmit(token: string) {

    this.loginService.login(token).subscribe({
      next: (response: any) => {
        sessionStorage.setItem("Authorization", response.token);
        sessionStorage.setItem("Profile", response.profile);
        if (this.route.url == '/signin') {
          this.route.navigate(['/dashboard']);
        }
        this.email_id = '';
        this.password = '';
        this.rememberMe = false;

        this.modalService.CloseLoginModal();
        this.authService.login(response.token);
        this.realoadservice.triggerReloadHeader();
        Swal.fire('', 'We’re excited to see you again. Your login was successful, and you’re now ready to continue creating amazing learning experiences.', 'success');
      },
      error: () => {
        this.message = 'An error occurred';
        Swal.fire('Error', 'Your email or password is incorrect. Try again...', 'error');
      }
    });
  }

  // institute login
  onInstituteLogin(token: string) {
    this.loginService.onInstituteLogin(token).subscribe({
      next: (response: any) => {
        sessionStorage.setItem("Authorization", response.token);
        sessionStorage.setItem("Profile", response.profile);
        if (this.route.url == '/signin') {
          this.route.navigate(['/dashboard']);
        }
        // this.route.navigate(['/dashboard']);
        this.email_id = '';
        this.password = '';
        this.rememberMe = false;

        this.modalService.CloseLoginModal();
        this.authService.login(response.token);
        this.realoadservice.triggerReloadHeader();
        Swal.fire('', 'We’re excited to see you again. Your login was successful, and you’re now ready to continue creating amazing learning experiences.', 'success');
      },
      error: () => {
        this.message = 'An error occurred';
        Swal.fire('Error', 'Your email or password is incorrect. Try again...', 'error');

      }
    });
  }

  forget = {
    email_id: ' ',
  }

  forgotpwd() {
    this.loginService.forgotPassword(this.forget).subscribe({
      next: (response: any) => {
        Swal.fire('', 'Password Reset Link sent to your Email ID', 'success');
        this.closeModal();
      },
      error: (error: any) => {
        if (error.status === 400) {
          Swal.fire('Error', 'Please enter a valid email address, like name@example.com.', 'error');
        } else if (error.status === 404) {
          Swal.fire('Error', 'Email Not Registered. If an account with this email exists, a password reset link has been sent.', 'error');
        } else if (error.status === 429) {
          Swal.fire('Error', 'Multiple requests detected. Please wait a few minutes before trying again.', 'error');
        } else if (error.status === 410) {
          Swal.fire('Error', 'This password reset link has expired or is invalid. Please request a new one.', 'error');
        } else {
          Swal.fire('Error', 'An error occurred while processing your request. Please try again later or contact support.', 'error');
        }
      }
    });
  }

  togglePassword() {
    this.show = !this.show;
  }

  closeModal() {
    const modalElement = document.getElementById('forgotpwd');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  registermodal() {
    if (this.route.url == '/signin') {
      this.route.navigate(['/signup']);
    }
    else {
      this.modalService.CloseLoginModal();
      this.modalService.openModal();
    }
  }


  
}