import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from '../common_service/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  password: string='';
  rememberMe: boolean = false;

  token: string | null = null; // Variable to hold the token

  constructor(private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    // Get the token from the URL
    const urlParams = new URLSearchParams(window.location.search);
    this.token = urlParams.get('token');
  }

  resetpassword = {
    newPassword: ''
  }

  changepassword() {
    if (this.token) {
      // Add the token to the service call
      this.loginService.resetPassword(this.resetpassword.newPassword, this.token).subscribe({
        next: (response) => {
          Swal.fire('Success!', 'You have successfully reset your password!', 'success').then(() => {
            this.router.navigate(['/signin']); // Change to your target route
          });
        },
        error: (error) => {
          Swal.fire('Error', 'Sorry, something went wrong!', 'error');
        }
      });
    } else {
      Swal.fire('Error', 'Token is missing!', 'error');
    }
  }


   // Hide And Show Password Logic
   show: boolean = false; 
   togglePassword() {
    this.show = !this.show;
  }
}
