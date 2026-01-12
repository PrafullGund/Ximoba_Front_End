import { Component } from '@angular/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enroll-now',
  templateUrl: './enroll-now.component.html',
  styleUrls: ['./enroll-now.component.css']
})
export class EnrollNowComponent {

  successNotification() {
    Swal.fire('Success!', 'Thank you for submitting the information,we will get back to you', 'success');
    
  }
  
}
