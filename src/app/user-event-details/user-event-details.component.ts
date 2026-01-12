import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { Subscription } from 'rxjs';
import { ModalServiceService } from '../common_service/modal-service.service';

@Component({
  selector: 'app-user-event-details',
  templateUrl: './user-event-details.component.html',
  styleUrls: ['./user-event-details.component.css']
})
export class UserEventDetailsComponent {

  id: any;
  ShowEvent: any;
  relatedEvent: any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 3;
  showEventReview: any;
  starsArray = Array(5).fill(0);
  routeSub: Subscription = new Subscription();
  token = sessionStorage.getItem('Authorization');
  stars: number[] = [1, 2, 3, 4, 5];
  rating: number = 0;
  currentUrl: string = window.location.href;
  showEventName = false;
  showShare = false;

  constructor(
    private dashboardService: DashboardService,
    private router: ActivatedRoute,
    private modalService: ModalServiceService,
  ) { this.id = this.router.snapshot.paramMap.get('id'); }

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadEvent(this.id);
      this.loadReview(this.currentPage, this.itemsPerPage);
      this.review.eventid = this.id;
    }

    this.routeSub = this.router.params.subscribe((params) => {
      const newId = params['id'];
      if (newId !== this.id) {
        this.id = newId;
        this.currentPage = 1;
        this.showEventReview = [];
        this.totalItems = 0;
        this.loadEvent(this.id);
        this.loadReview(this.currentPage, this.itemsPerPage);
      }
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  bookEvent(event_id: string) {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      const data = { event_id };
      this.dashboardService.bookEvent(data).subscribe(
        response => {
          Swal.fire('Congratulation', 'You have Succssfully Booked Event! ', 'success');
        },
        error => {
          Swal.fire('Error', 'You Have Already Enrolled This Event.', 'error');
        });
    }
    else {
      sessionStorage.setItem('event_id', event_id)
      this.modalService.openModal()
    }
  }

  copyLink() {
    navigator.clipboard.writeText(this.currentUrl).then(() => {
      alert('Link copied to clipboard!');
    }).catch(err => {
    });
  }

  loadEvent(id: string): void {
    this.dashboardService.getEventDataById(this.id).subscribe((data) => {
      this.ShowEvent = data?.event;
      this.relatedEvent = data.relatedEvent;
    })
  }

  loadReview(page: number, limit: number): void {
    this.dashboardService.getEventReview(this.id, page, limit).subscribe((Response) => {
      this.showEventReview = Response.data.reviews;
      this.totalItems = Response.pagination.totalReviews;
    })
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadReview(this.currentPage, this.itemsPerPage);
    this.p = page;
  }

  postReviewEvent() {
    if (!this.review.review || !this.review.star_count) {
      Swal.fire('Sorry', 'Please provide both a review and a star rating to submit your feedback.', 'warning');
      return;
    }
    if (this.token) {
      this.review.star_count = this.rating;
      this.dashboardService.postReviewEvent(this.review).subscribe({
        next: (Response) => {
          Swal.fire('Success !', 'You are Review Add Successfully..!', 'success');
          this.loadReview(this.currentPage, this.itemsPerPage);
          this.resetForm();
        },
        error: (Error) => {
          Swal.fire('Error', 'sorry..!', 'error');
        }
      })
    }
    else {
      this.modalService.openModal();
    }
  }

  resetForm() {
    this.review = {
      star_count: 0,
      review: '',
      eventid: this.review.eventid
    };
    this.rating = 0;
  }

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
    eventid: '',
  }

  shareOnWhatsApp() {
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(this.currentUrl)}`;
    window.open(whatsappUrl, '_blank');
  }

  shareOnFacebook() {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentUrl)}`;
    window.open(facebookUrl, '_blank');
  }

  shareIcon() {
    this.showShare = !this.showShare;
  }

  turnEventName(name: string): string {
    return name.length > 14 ? name.slice(0, 12) + '...' : name;
  }
}
