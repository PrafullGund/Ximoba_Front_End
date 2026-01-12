import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { TrainerService } from '../common_service/trainer.service';
import { FormGroup, NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DashboardService } from '../common_service/dashboard.service';
import Swal from 'sweetalert2';
import { Token } from '@angular/compiler';
import { LoginService } from '../common_service/login.service';
import { AuthServiceService } from '../common_service/auth-service.service';
import { ModalServiceService } from '../common_service/modal-service.service';
import { RealoadServiceService } from '../common_service/reaload-service.service';
import { MatDialog } from '@angular/material/dialog';
import { TermsDialogComponent } from '../terms-dialog/terms-dialog.component';
declare var bootstrap: any;

@Component({
  selector: 'app-course-details',
  templateUrl: './course-details.component.html',
  styleUrls: ['./course-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class CourseDetailsComponent implements OnInit {
  showprofile: any;
  showReviewData: any[] = [];
  starsArray = Array(5).fill(0);
  id: any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  currentPageBatches: number = 1;
  currentPageUpcomingBatches: number = 1;
  currentPageOnlineEvents: number = 1;
  currentPageOfflineEvents: number = 1;
  currentPageProducts: number = 1;
  itemsPerPage: number = 2;
  itemsPerPageAllCourse: number = 4;
  minDate: string = '';
  AllCourses: any;
  AllEvents: any;
  AllProducts: any;
  currentUrl: string = window.location.href;
  isLoading: boolean = true;
  studentForm!: FormGroup;
@ViewChild('questionForm')questionForm!:NgForm
  @ViewChild('enquiryForm') enquiryForm!: NgForm;
  @ViewChild('reviewform') reviewForm!: NgForm;
  @ViewChild('ApmtForm') appointmentForm!: NgForm;
  

  makeCall() {
    const phoneNumber = this.showprofile.trainer.mobile_number;
    window.location.href = `tel:${phoneNumber}`;
  }

  constructor(
    private trainerService: TrainerService,
    private router: ActivatedRoute,
    private modalService: ModalServiceService,
    private dashboard: DashboardService,
    private loginService:LoginService,
    private route:Router,
    private authService:AuthServiceService,
    private realoadservice:RealoadServiceService,
    private dialog:MatDialog
  ) {
    this.id = this.router.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.trainerService.getProfile(this.id).subscribe({
      next: (data) => {
        this.showprofile = data;
        this.showReviewData = data?.reviews;
      },
      error: (error) => {
        console.error('Error fetching profile:', error);
        Swal.fire(
          'Error',
          'Failed to fetch profile data. Please try again later.',
          'error'
        );
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      },
    });

    this.GetAllCourses(this.currentPage, this.itemsPerPageAllCourse);
    this.GetAllEvents(this.currentPage, this.itemsPerPageAllCourse);
    this.GetAllProducts(this.currentPage, this.itemsPerPage);

    this.enquiry.trainerid = this.id;
    this.question.trainerid = this.id;
    this.review.t_id = this.id;
    this.Appoinment.t_id = this.id;

    const today = new Date();
    this.minDate = today.toISOString().split('T')[0];
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = document.querySelectorAll(
      '[data-bs-toggle="tooltip"]'
    );
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  GetAllCourses(page: number, limit: number) {
    this.trainerService
      .getAllCourseSonProfilePage(this.id, page, limit)
      .subscribe((Response) => {
        this.AllCourses = Response?.data || [];
        this.totalItems = Response.pagination?.totalItems || '';
        console.log('All Couese by id', Response);
      });
  }

  GetAllEvents(page: number, limit: number) {
    this.trainerService
      .getAllEventSonProfilePage(this.id, page, limit)
      .subscribe((Response) => {
        this.AllEvents = Response?.data || [];
        this.totalItems = Response.pagination?.totalItems || '';
        console.log('All Couese by id', Response);
      });
  }

  GetAllProducts(page: number, limit: number) {
    this.trainerService
      .getAllProductOnProfilePage(this.id, page, limit)
      .subscribe((Response) => {
        this.AllProducts = Response?.data || [];
        this.totalItems = Response.pagination?.totalItems || '';
        console.log('All Couese by id', Response);
      });
  }

  totalPagescourses(): number {
    return Math.ceil(this.totalItems / this.itemsPerPageAllCourse);
  }

  AllCoursesnextPageBatches(): void {
    if (this.currentPage < this.totalPagescourses()) {
      this.currentPage++;
      this.GetAllCourses(this.currentPage, this.itemsPerPageAllCourse);
    }
  }

  AllCoursespreviousPageBatches(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.GetAllCourses(this.currentPage, this.itemsPerPageAllCourse);
    }
  }

  totalPagesEvents(): number {
    return Math.ceil(this.totalItems / this.itemsPerPageAllCourse);
  }

  AllEventsnextPageBatches(): void {
    if (this.currentPage < this.totalPagesEvents()) {
      this.currentPage++;
      this.GetAllEvents(this.currentPage, this.itemsPerPageAllCourse);
    }
  }

  AllEventspreviousPageBatches(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.GetAllEvents(this.currentPage, this.itemsPerPageAllCourse);
    }
  }

  totalPagesProducts(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  AllProductsnextPage(): void {
    if (this.currentPage < this.totalPagesProducts()) {
      this.currentPage++;
      this.GetAllProducts(this.currentPage, this.itemsPerPage);
    }
  }

  AllProductspreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.GetAllProducts(this.currentPage, this.itemsPerPage);
    }
  }

  //  redirect WhatsApp check Login Or Not
  handleWhatsAppClick() {
    if (this.token) {
      window.open(
        `https://wa.me/${this.showprofile.trainer.whatsapp_no}`,
        '_blank'
      );
    } else {
      this.modalService.openModal();
    }
  }

  shareOnWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
      this.currentUrl
    )}`;
    window.open(whatsappUrl, '_blank');
  }

  copyLink() {
    navigator.clipboard
      .writeText(this.currentUrl)
      .then(() => {
        alert('Link copied to clipboard!');
      })
      .catch((err) => {
        console.error('Could not copy text: ', err);
      });
  }

  shareOnFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      this.currentUrl
    )}`;
    window.open(facebookUrl, '_blank');
  }

  showshare = false;
  shareicon() {
    this.showshare = !this.showshare;
  }

  //  Here get token For user Logged in or not for post Enquiry, question and reviews
  token = sessionStorage.getItem('Authorization');
  enquiry = {
    description: '',
    trainerid: '',
  };

  postEnquiry() {
    if (!this.enquiry.description || this.enquiry.description.trim().length < 10) {
      Swal.fire(
        'Sorry',
        'Please enter an enquiry that is at least 10 characters long to proceed.',
        'warning'
      );
      return;
    }
  
    if (this.token) {
      const tokenPayload = JSON.parse(atob(this.token.split('.')[1]));
      const userRole = tokenPayload.role;
  
      if (userRole === 'USER') {
        this.dashboard.postEnquiry(this.enquiry).subscribe({
          next: (Response) => {
            Swal.fire('Success!', 'Your enquiry was sent successfully!', 'success');
            this.enquiryForm.resetForm({ description: '' }); 
          },
          error: (error) => {
            Swal.fire('Error', 'Sorry..!', 'error');
          },
        });
      } else {
        Swal.fire(
          'Sorry',
          'As an Instructor, you are not allowed to send enquiries!',
          'warning'
        );
      }
    } else {
      this.modalService.openModal();
    }
  }
  

question = {
    question: '',
    trainerid: '',
  };

  postquestion() {
    if (!this.question.question || this.question.question.trim().length < 10) {
      Swal.fire(
        'Sorry',
        'Please enter a question that is at least 10 characters long to proceed.',
        'warning'
      );
      return;
    }

    if (this.token) {
      this.dashboard.postQuestions(this.question).subscribe({
        next: (response) => {
          Swal.fire(
            'Success',
            'Your question has been submitted successfully!',
            'success'
          );
          this.questionForm.resetForm({ question: '' });
        },
        error: (Error) => {
          Swal.fire('Error', 'sorry..!', 'error');
        },
      });
    } else {
      this.modalService.openLoginModal();
    }
  }

  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;

  toggleRating(clickedStar: number): void {
    if (this.rating === clickedStar) {
      this.rating = 0;
    } else {
      this.rating = clickedStar;
    }
    this.review.star_count = this.rating;
  }

  
  review = {
    review: '',
    star_count: 0,
    t_id: '',
  };

 postreview() {
  if (!this.review.review || !this.review.star_count) {
    Swal.fire(
      'Sorry',
      'Please provide both a review and a star rating to submit your feedback.',
      'warning'
    );
    return;
  }

  if (this.token) {
    this.review.star_count = this.rating;
    this.dashboard.postReview(this.review).subscribe({
      next: (Response) => {
        Swal.fire('Success!', 'Your review was added successfully!', 'success');
        this.rating = 0;
        this.reviewForm.resetForm({
          review: '',
          star_count: 0,
          t_id: this.review.t_id,
        });
      },
      error: (Error) => {
        Swal.fire('Error', 'Sorry..!', 'error');
      },
    });
  } else {
    this.modalService.openModal();
  }
}

  Appoinment = {
    date: '',
    time: '',
    t_id: '',
  };

  BookAppoinment() {
    if (!this.Appoinment.date || !this.Appoinment.time) {
      Swal.fire(
        'Sorry',
        'Please select both a date and a time to proceed with your appointment.',
        'warning'
      );
      return;
    }
  
    if (this.token) {
      this.dashboard.postBookAppointment(this.Appoinment).subscribe({
        next: (Response) => {
          Swal.fire('Success!', 'Your appointment was booked successfully!', 'success');
          this.appointmentForm.resetForm();

          this.Appoinment = {
            date: '',
            time: '',
            t_id: this.Appoinment.t_id 
          };
        },
        error: (Error) => {
          Swal.fire('Error', 'Sorry..!', 'error');
        },
      });
    } else {
      this.modalService.openModal();
    }
  }
  
  // conver Rupees K or laks
  getFormattedPrice(price: number): string {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + 'L';
    } else if (price >= 1000) {
      return '₹' + (price / 1000).toFixed(1) + 'K';
    } else {
      return '₹' + price.toString();
    }
  }

  // scroll pages in click on nav
  scrollToSection(event: Event, sectionId: string) {
    event.preventDefault();

    const section = document.getElementById(sectionId);

    if (section) {
      const headerOffset = 70;
      const sectionPosition =
        section.getBoundingClientRect().top + window.scrollY;
      const offsetPosition = sectionPosition - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  }

  showcourseName = false;
  truncatecourseName(name: string): string {
    return name.length > 18 ? name.slice(0, 16) + '...' : name;
  }

  showbusinessName = false;
  trunbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 18) + '...' : name;
  }

  showupcommingName = false;
  truncateupcomingName(name: string): string {
    return name.length > 18 ? name.slice(0, 16) + '...' : name;
  }
  showupcommingbusinessName = false;
  trunupcommingbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 18) + '...' : name;
  }

chatBoxVisible = false;
scrollToEducation(event:Event){
  event.preventDefault();

  if (!this.chatBoxVisible) {
    this.chatBoxVisible = true;
    setTimeout(() => this.scrollToEducationPosition(), 100);
  } else {
    this.scrollToEducationPosition();
  }
}

private scrollToEducationPosition() {
  const totalPageHeight = document.body.scrollHeight;
  const targetScrollY = totalPageHeight * 0.1; 

  window.scrollTo({
    top: targetScrollY
  });
}

scrollToChatBox(event: Event) {
  event.preventDefault();

  if (!this.chatBoxVisible) {
    this.chatBoxVisible = true;
    setTimeout(() => this.scrollToChatBoxPosition(), 100);
  } else {
    this.scrollToChatBoxPosition();
  }
}

private scrollToChatBoxPosition() {
  const totalPageHeight = document.body.scrollHeight;
  const targetScrollY = totalPageHeight * 0.5; 

  window.scrollTo({
    top: targetScrollY
  });
}

setFilter(filter: string) {
  this.selectedFilter = filter;
  this.applyFilter();
}
filteredChats: any[] = [];
chats: any[] = [];
searchTerm:any='';
  selectedFilter: string = 'all'; 

applyFilter() {
  this.filteredChats = this.chats.filter(chat => {
    const fullName = `${chat.users[0]?.f_Name} ${chat.users[0]?.l_Name}`.toLowerCase();
    const matchesSearch = this.searchTerm ? fullName.includes(this.searchTerm.toLowerCase()) : true;

    if (this.selectedFilter === 'unread') {
      return matchesSearch && chat.latestMessage.isRead === false;
    }
    return matchesSearch;
  });
}

}
