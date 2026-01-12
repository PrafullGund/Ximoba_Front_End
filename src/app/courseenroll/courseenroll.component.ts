import {Component,ElementRef,OnDestroy,OnInit,ViewChild} from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ModalServiceService } from '../common_service/modal-service.service';
import { Validators } from 'ngx-editor';
import { LoginService } from '../common_service/login.service';
declare var bootstrap: any;

@Component({
  selector: 'app-courseenroll',
  templateUrl: './courseenroll.component.html',
  styleUrls: ['./courseenroll.component.css'],
})
export class CourseenrollComponent implements OnInit, OnDestroy {
  id: any;
  studentForm!: FormGroup;
  Showcoursedetails: any;
  ShowCourseReview: any;
  RelatedCourses: any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 3;
  starsArray = Array(5).fill(0);
  routeSub: Subscription = new Subscription();
  @ViewChild('closeModalBtn') closeModalBtn!: ElementRef;
  videoPlaying = false;
  showIcon = true;
  enlargedVideoVisible = false;

  constructor(
    private dashboardService: DashboardService,
    private router: ActivatedRoute,
    private route: Router,
    private modalService: ModalServiceService,
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private routers:ActivatedRoute
  ) {
    this.id = this.router.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.enrollNowForm();

    this.courseid = this.routers.snapshot.paramMap.get('id') || '';

    this.id = this.router.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadCourseDetails(this.id);
      this.loadreview(this.currentPage, this.itemsPerPage);
      this.review.courseid = this.id;
    }

    this.routeSub = this.router.params.subscribe((params) => {
      const newId = params['id'];
      if (newId !== this.id) {
        this.id = newId;

        this.currentPage = 1;
        this.ShowCourseReview = [];
        this.totalItems = 0;

        this.loadCourseDetails(this.id);
        this.loadreview(this.currentPage, this.itemsPerPage);
      }
    });

    if (!this.isLoggedIn) {
      this.openLoginModal();
    }
  }

  private enrollNowForm(): void {
    this.studentForm = this.formBuilder.group({
      f_Name: ['', Validators.required],
      l_Name: ['', Validators.required],
      middle_Name: [''],
      email_id: ['', [Validators.required]],
      mobile_number: ['', [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(8)]],
    });
  }

  signInForm(): void {
    if (this.studentForm.invalid) {
      this.studentForm.markAllAsTouched();
      return;
    }

    this.loginService.postSignupData(this.studentForm.value).subscribe({
      next: (response) => {
        this.closeModalBtn.nativeElement.click();
        this.studentForm.reset();
      },
      error: (err) => {
        console.error('Signup failed:', err);
      },
      complete: () => {},
    });
  }

  showcourseName = false;
  truncatecourseName(name: string): string {
    return name.length > 18 ? name.slice(0, 12) + '...' : name;
  }
  showbusinessName = false;
  trunbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 13) + '...' : name;
  }

  loadCourseDetails(id: string): void {
    this.dashboardService.getCourseDataById(id).subscribe(
      (data) => {
        this.Showcoursedetails = data?.course;
        this.RelatedCourses = data?.relatedCourses;

        if (this.Showcoursedetails && this.Showcoursedetails.course_name) {
          this.formData.area_of_interest = this.Showcoursedetails.course_name;
        } else {
        }
      },
      (error) => {
        console.error('Error fetching course details:', error);
      }
    );
  }

  downloadMaterial(url: string): void {
    if (url) {
      window.open(url, '_blank');
    }
  }

  loadreview(page: number, limit: number): void {
    this.dashboardService
      .getCourseReview(this.id, page, limit)
      .subscribe((Response) => {
        this.ShowCourseReview = Response.data.reviews;
        this.totalItems = Response.pagination.totalReviews;
      });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  CourseEnroll(course_id: string) {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      const data = { course_id };
      this.dashboardService.courseEnroll(data).subscribe(
        (response) => {
          Swal.fire(
            'Congratulation',
            'You have Succssfully Enroll! ',
            'success'
          );
        },
        (error) => {
          Swal.fire('Error', 'You Have Already Enrolled This course.', 'error');
        }
      );
    } else {
      sessionStorage.setItem('course_id', course_id);
      this.modalService.openModal();
    }
  }

  token = sessionStorage.getItem('Authorization');
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
    name: '',
    email: '',
    review: '',
    star_count: 0,
    courseid: ''
  };
  courseid: string = '';

setRating(count: number) {
  this.rating = count;
}

postreviewCourse() {
  if (!this.review.review || this.rating === 0) {
    Swal.fire('Sorry', 'Please provide both a review and a star rating to submit your feedback.', 'warning');
    return;
  }

  if (this.token) {
    this.review.star_count = this.rating;
    this.review.courseid = this.courseid;
    this.dashboardService.postReviewCourse(this.review).subscribe({
      next: (Response) => {
        Swal.fire('Success!', 'You added a review successfully!', 'success');
        this.loadreview(this.currentPage, this.itemsPerPage);
        this.resetForm();
      },
      error: () => {
        Swal.fire('Error', 'Sorry, something went wrong.', 'error');
      }
    });
  } else {
    this.modalService.openModal();
  }
}

resetForm() {
  this.review = {
    name: '',
    email: '',
    review: '',
    star_count: 0,
    courseid: ''
  };
  this.rating = 0;
}


  getFormattedPrice(price: number): string {
    if (price >= 100000) {
      return '₹' + (price / 100000).toFixed(1) + 'L';
    } else if (price >= 1000) {
      return '₹' + (price / 1000).toFixed(1) + 'K';
    } else {
      return '₹' + price.toString();
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadreview(this.currentPage, this.itemsPerPage);
    this.p = page;
  }

  currentUrl: string = window.location.href;
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

  isLoggedIn = false;
  openLoginModal() {
    const loginModal = new bootstrap.Modal(
      document.getElementById('loginModal'),
      {
        backdrop: 'static',
        keyboard: false,
      }
    );
    loginModal.show();
  }

  formData = {
    name: '',
    mobile: '',
    email: '',
    area_of_interest: '',
  };

  submitForm(): void {
    if (
      !this.formData.name ||
      !this.formData.mobile ||
      !this.formData.email ||
      !this.formData.area_of_interest
    ) {
      alert('Please fill in all fields.');
      return;
    }

    this.dashboardService.submitInquiry(this.formData).subscribe(
      (response) => {
        Swal.fire('Success!', ' submitted successfully!', 'success');
        const modal = bootstrap.Modal.getInstance(
          document.getElementById('loginModal')
        );
        modal.hide();
      },
      (error) => {
        Swal.fire('Failed to submit the form. Please try again.', 'error');
      }
    );
  }

  openEnrollModal() {
    const modalElement = document.getElementById('enrollModal');
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  confirmEnroll() {
    this.CourseEnroll(this.Showcoursedetails._id);
  }

  togglePasswordVisibility() {}

  userData = {
    f_Name: '',
    middle_Name: '',
    l_Name: '',
    email_id: '',
    password: '',
    mobile_number: '',
  };

  allowOnlyNumbers(event: KeyboardEvent): void {
    const charCode = event.key.charCodeAt(0);
    if (charCode < 48 || charCode > 57) {
      event.preventDefault();
    }
  }

  limitToTenDigits(): void {
    if (this.userData.mobile_number.length > 10) {
      this.userData.mobile_number = this.userData.mobile_number.slice(0, 10);
    }
  }

  show: boolean = false;
  togglePassword() {
    this.show = !this.show;
  }

  openModal() {
    if (this.route.url == '/signin') {
      this.route.navigate(['/signin']);
    } else {
      this.modalService.closeModal();
      this.modalService.openLoginModal();
    }
  }

  postComment(comment: string): void {
    if (!sessionStorage.getItem('Authorization')) {
      this.modalService.openLoginModal();
      return;
    }
    if (!comment.trim()) {
      console.error('Comment cannot be empty.');
      return;
    }

    const commentData = {
      comment_text: comment,
      courseId: this.id,
      userId: sessionStorage.getItem('userId') || 'guest',
    };

    this.dashboardService.postCourseComment(commentData).subscribe(
      (response) => {
        Swal.fire('Success', 'Your comment has been posted!', 'success');
      },
      (error) => {
        Swal.fire(
          'Error',
          'Failed to post your comment. Please try again.',
          'error'
        );
      }
    );
  }

  openVideoModal(): void {
    this.enlargedVideoVisible = true;
  }

  closeVideoModal(): void {
    this.enlargedVideoVisible = false;
  }
}
