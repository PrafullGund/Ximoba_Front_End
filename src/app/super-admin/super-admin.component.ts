import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import Swal from 'sweetalert2';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-super-admin',
  templateUrl: './super-admin.component.html',
  styleUrls: ['./super-admin.component.css']
})
export class SuperAdminComponent implements OnInit {

  id: any;
  getrequest: any[] = [];
  getapprovedrequest: any;
  getRejectedrequest: any;
  UserDetailsinfo: any;

  constructor(
    private loginService: LoginService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      if (this.id) {
        this.UserDetails();
      }
    });
    this.getallrequest();
    this.getallApprovalreuest();
    this.getAllRejectRequest();
  }

  getallrequest() {
    this.loginService.getPendingRoleRequests().subscribe(data => {
      this.getrequest = data.data;
    })
  }

  getallApprovalreuest() {
    this.loginService.getApprovedRoleRequests().subscribe(result => {
      this.getapprovedrequest = result.data;
    });
  }

  getAllRejectRequest() {
    this.loginService.getRejectedRoleRequests().subscribe(result => {
      this.getRejectedrequest = result.data;
    });
  }

  handleApproval(userid: string, approved: number) {
    const data = { userid, approved };
    if (data.approved === 0) {
      Swal.fire({
        title: 'Are you sure?',
        text: 'Do you really want to reject this request? This action cannot be undone.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, reject it',
        cancelButtonText: 'Cancel'
      }).then((result) => {
        if (result.isConfirmed) {
          this.loginService.approveRoleChange(data).subscribe(response => {
            Swal.fire('Request Rejected', 'The user’s request has been successfully deleted.', 'success');
            this.getallrequest();
            this.getAllRejectRequest();
          });
        }
      });
    } else if (data.approved === 1) {
      this.loginService.approveRoleChange(data).subscribe(response => {
        Swal.fire('Request Approved', 'The user’s role has been successfully updated.', 'success');
        this.getallrequest();
        this.getallApprovalreuest();
      });
    }
  }

  UserDetails() {
    if (this.id) {
      this.loginService.getUserDetails(this.id).subscribe(result => {
        this.UserDetailsinfo = result;
      });
    }
  }

  openUserDetailsModal(userId: string): void {
    this.loginService.getUserDetails(userId).subscribe(result => {
      this.UserDetailsinfo = result;
    });
  }
}
