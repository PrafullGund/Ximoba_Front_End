import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.css']
})
export class AppointmentComponent implements OnInit {

  showAppointmentData: any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 10;
  rejectionReason: string = '';
  selectedAppointmentId: string = '';
  isUser:boolean=false

  constructor(
    private trainerService: TrainerService,
    private authService:AuthServiceService,
  ) { }

  ngOnInit(): void {
    this.checkUserRole();
    this.loadAllAppointment(this.currentPage, this.itemsPerPage);
  }

  loadAllAppointment(page: number, limit: number) {
    this.trainerService.getAppointment(page, limit).subscribe(data => {
      this.showAppointmentData = data.data;
      this.totalItems = data.pagination.totalItems;
    })
  }

  checkUserRole() {
    const role = this.authService.getUserRole();
    this.isUser = role === 'USER';
  }

  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Appointment? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteAppointmentById(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The Appointment has been deleted successfully.', 'success');
            this.loadAllAppointment(this.currentPage, this.itemsPerPage);
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the Appointment.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The Appointment is safe :', 'info');
      }
    });
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.p = page;
    this.loadAllAppointment(this.currentPage, this.itemsPerPage);
  }

  rejectAppointment(appointmentId: string): void {
    this.selectedAppointmentId = appointmentId;
  }

  submitRejection(): void {
    if (this.rejectionReason) {
      this.trainerService.rejectAppointment(this.selectedAppointmentId, this.rejectionReason).subscribe(
        (response) => {
          Swal.fire('Rejected', 'The Appointment is Rejected', 'success');
          bootstrap.Modal.getInstance(document.getElementById('rejectModal'))?.hide();
          this.loadAllAppointment(this.currentPage, this.itemsPerPage);
          this.rejectionReason = '';
          this.selectedAppointmentId = '';
        },
        (error) => {
          Swal.fire(
            'Technical Issue', 'We encountered a technical issue while processing your request. Please try again later.', 'error');
        }
      );
    }
  }

  approveAppointment(id: string): void {
    this.trainerService.approveAppointment(id).subscribe(
      (response) => {
        Swal.fire('Confirmed', 'The appointment has been approved.', 'success');
        this.loadAllAppointment(this.currentPage, this.itemsPerPage);
      },
      (error) => {
        console.error(error);
        Swal.fire('Error', 'There was an issue approving the appointment.', 'error');
      }
    );
  }
}
