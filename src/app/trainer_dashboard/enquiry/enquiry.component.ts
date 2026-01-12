import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-enquiry',
  templateUrl: './enquiry.component.html',
  styleUrls: ['./enquiry.component.css']
})
export class EnquiryComponent implements OnInit {

  showEnquiryData: any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 5;
  isUnread: boolean = false;
  groupedInquiries: { [key: string]: any[] } = {};

  loginUserId: any
  loginuserName: string = '';
  selectedQuestionId: string | null = null;
  allSelected = false;
  constructor(
    private trainerService: TrainerService,
    private authService: AuthServiceService
  ) { }

  convertToMonthsAndDays(days: number): string {
    if (!days) return "N/A";
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return remainingDays > 0 ? `${months} months, ${remainingDays} days` : `${months} months`;
  }

  ngOnInit(): void {
    this.loginuserName = this.authService.username() ?? '';
    this.loginUserId = this.authService.getUserId();
    this.loadAllEnquiry(this.currentPage, this.itemsPerPage);
    this.groupedInquiries = this.groupInquiriesByDate(this.showEnquiryData);
  }

  loadAllEnquiry(page: number, limit: number) {
    this.isUnread = false;
    this.currentPage = 1;
    this.trainerService.getEnquiry(page, limit).subscribe(data => {
      this.showEnquiryData = data.data;
      this.groupInquiriesByDate(this.showEnquiryData);
      this.totalItems = data.pagination.totalItems;
      this.p = 1;
    });
  }

  onDelete(id: string): void {
    debugger;
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Enquiry? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteEnquiry(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The Enquiry has been deleted successfully.', 'success');
            this.loadAllEnquiry(this.currentPage, this.itemsPerPage);
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the Enquiry.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The Enquiry is safe :)', 'info');
      }
    });
  }

  // getInquiryCount() {
  //   return this.showEnquiryData.filter((inquiry:any) => 
  //     inquiry._id && inquiry._id !== undefined && inquiry._id !== null && inquiry._id !== ''
  //   ).length;
  // }
  // getUnseenCount(): number {
  //   return this.showEnquiryData.filter((inquiry:any) => 
  //     (inquiry._id !== null && inquiry._id !== 0 && inquiry._id !== undefined) && !inquiry.isSeen
  //   ).length;
  // }

  getInquiryCount(): number {
    if (!this.showEnquiryData) {
      return 0;
    }

    return this.showEnquiryData.filter((inquiry: any) =>
      inquiry._id && inquiry._id !== undefined && inquiry._id !== null && inquiry._id !== ''
    ).length;
  }

  getUnseenCount(): number {
    if (!this.showEnquiryData) {
      return 0;
    }

    return this.showEnquiryData.filter((inquiry: any) =>
      (inquiry._id !== null && inquiry._id !== 0 && inquiry._id !== undefined) && !inquiry.isSeen
    ).length;
  }

  fetchAllUnreadinquiry(page: number, limit: number) {
    this.trainerService.getallunreadinquiry(page, limit).subscribe(result => {
      if (result.notifications.length > 0) {
        this.showEnquiryData = result.notifications;
        this.totalItems = result.pagination.totalItems;
        this.p = page;
      }
    });
  }

  ngAfterViewInit() {
    this.showEnquiryData.forEach((inquiry: any) => {
      if (!inquiry.isSeen) {
        this.markseenbyid(inquiry.id);
      }
    });
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.showEnquiryData.forEach((inquiry: any) => inquiry.isSelected = this.allSelected);
  }

  toggleDetails(question: any) {
    question.showDetails = !question.showDetails;
    this.selectedQuestionId = this.selectedQuestionId === question._id ? null : question._id;
  }

  toggleReply(question: any) {
    question.showReplyBox = !question.showReplyBox;
  }

  sendReply(inquiry: any): void {
    if (!inquiry.replyText.trim()) return;
    const replyData = {
      userid: inquiry.user_id,
      trainerid: this.loginUserId,
      reply: inquiry.replyText
    };
    const payload = {
      enquiryId: inquiry._id,
      replyData: replyData
    };

    this.trainerService.replyenquiry(payload)
      .subscribe(
        response => {
          inquiry.replies = inquiry.replies || [];
          inquiry.showReplyBox = false;
          inquiry.replyText = '';
          this.loadAllEnquiry(this.currentPage, this.itemsPerPage);
        },
        error => {
          console.error('Error sending reply:', error);
        }
      );
  }
  showUnreadinquiry() {
    this.isUnread = true;
    this.currentPage = 1;
    this.fetchAllUnreadinquiry(this.currentPage, this.itemsPerPage);
  }
  markseenbyid(id: any) {
    const inquiry = this.showEnquiryData.find((n: any) => n._id === id);
    if (inquiry) {
      this.trainerService.markaallseninquirybyid(id).subscribe(() => {
        inquiry.isSeen = true;
        if (this.isUnread) {
          this.fetchAllUnreadinquiry(this.currentPage, this.itemsPerPage);
        }
      });
    }
  }
  markAllAsCompleted() {
    this.trainerService.markaallseninquiry().subscribe(
      response => {
      })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.isUnread) {
      this.fetchAllUnreadinquiry(this.currentPage, this.itemsPerPage);
    } else {
      this.loadAllEnquiry(this.currentPage, this.itemsPerPage);
    }
    this.p = page;
  }


  // groupInquiriesByDate() {
  // const today = moment().startOf('day');
  // const yesterday = moment().subtract(1, 'days').startOf('day');

  // this.groupedInquiries = this.showEnquiryData.reduce((acc: { [key: string]: any[] }, inquiry: any) => {
  //   const inquiryDate = moment(inquiry.date).startOf('day');

  //   let dateLabel = inquiryDate.isSame(today) ? 'Today' :
  //                   inquiryDate.isSame(yesterday) ? 'Yesterday' :
  //                   inquiryDate.format('MMMM D, YYYY'); // Format: "February 16, 2025"

  //   if (!acc[dateLabel]) {
  //     acc[dateLabel] = [];
  //   }
  //   acc[dateLabel].push(inquiry);
  //   return acc;
  // }, {});
  //}
  groupInquiriesByDate(inquiries: any[]): any {
    return inquiries.reduce((acc, inquiry) => {
      const date = inquiry.createdAt;
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(inquiry);
      return acc;
    }, {});
  }

  // groupInquiries() {
  //   const groupedData: { [key: string]: any[] } = this.groupInquiriesByDate(this.showEnquiryData);
  //   console.log(groupedData);
  // }

}