import { Component, ElementRef, ViewChild } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgForm } from '@angular/forms';
import { LoginService } from '../common_service/login.service';
import { AuthServiceService } from '../common_service/auth-service.service';
import { Subscription } from 'rxjs';
import { ModalServiceService } from '../common_service/modal-service.service';


@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.css']
})
export class ShopComponent {

  @ViewChild('closebutton') closebutton!: ElementRef;

  id: any;
  Showproductdata: any;
  ShowRelatedPeoduct:any;
  isLoggedIn: boolean = false;
  starsArray: number[] = [1, 2, 3, 4, 5]; // 5 stars total
  ShowProductReview:any;
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 3; 
  routeSub: Subscription = new Subscription();
  count: number = 1;

  increment() {
    this.count++;
  }

  decrement() {
    if (this.count > 1) {
      this.count--;
    }
  }

  constructor(
    private dashboardService: DashboardService, 
    private router: ActivatedRoute,
    private route: Router, 
    private modalService:ModalServiceService,
  ) 
  { this.id = this.router.snapshot.paramMap.get('id');this.checkLoginStatus(); }

     checkLoginStatus() {
      const token = sessionStorage.getItem('Authorization');
      this.isLoggedIn = !!token; // Set true if token exists
    }


  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    if (this.id) {
      this.loadProducts(this.id); 
      this.loadreview(this.currentPage, this.itemsPerPage); 
      this.review.productid = this.id; 
    }
  
    this.routeSub = this.router.params.subscribe((params) => {
      const newId = params['id'];
      
      if (newId !== this.id) {
        this.id = newId;
        this.currentPage = 1; 
        this.review.productid = this.id; 
        this.ShowProductReview = []; 
        this.totalItems = 0; 
  
        this.loadProducts(this.id);
        this.loadreview(this.currentPage, this.itemsPerPage);
      }
    });
  }
  

  loadProducts(id:string): void{
    // console.log("Course ID:", this.id);
    this.dashboardService.getProductDataById(this.id).subscribe((data) => {
      console.log("API Response:", data);
      this.Showproductdata = data.productDetail;
      this.ShowRelatedPeoduct = data?.relatedProducts;
    });
  }

  loadreview(page: number, limit: number): void{
    this.dashboardService.getProductReview(this.id,page, limit).subscribe((Response) =>{
      console.log("Review",Response);
    this.ShowProductReview = Response.data.reviews;
    this.totalItems = Response.pagination.totalReviews;
    });
  }

  ngOnDestroy(): void {
    if (this.routeSub) {
      this.routeSub.unsubscribe();
    }
  }

  buyproduct(quantity:number, productId:string) {
    const token = sessionStorage.getItem('Authorization'); // Assuming your token is stored in sessionStorage
    if (token) {
      const  cart = { quantity, productId };
      this.dashboardService.postToCart(cart).subscribe({
        next: (Response) =>{
          Swal.fire('Success!', 'Added to cart..!', 'success');
          this.register(productId); // Call register with the product ID
          this.route.navigate(['/cart'])
        },
        error : (error)=>{
          Swal.fire('Error', 'sorry..!', 'error');
        }
      })
    }
    else {
      // console.log(quantity);
      // console.log(productId);
      sessionStorage.setItem('productId',productId);
      sessionStorage.setItem('quantity',quantity.toString());
            
      // const modalElement = document.getElementById('CheckLoggedIN');
      // if (modalElement) {
      //   const modal = new (window as any).bootstrap.Modal(modalElement);
      //   modal.show();
      // }

      this.modalService.openModal();

    }
  }

  register(productId: string) {
    const product = { product_id: productId }; // Corrected to send product ID properly
    this.dashboardService.postRegisterProduct(product).subscribe({
      next: (response) => {
        console.log('Product registered successfully:', response);
      },
      error: (error) => {
        console.error('Error registering product:', error);
      }
    });
  }


  token = sessionStorage.getItem('Authorization');

  stars: number[] = [1, 2, 3, 4, 5];  
  rating: number = 0;  


  toggleRating(clickedStar: number): void {
    if (this.rating === clickedStar) {
      this.rating = 0; // Reset the rating if the same star is clicked
    } else {
      this.rating = clickedStar; // Set the new rating
    }
    this.review.star_count = this.rating; // Ensure star count is updated
  }

  review = {
    review: '',
    star_count: 0,
    productid:'',
  }

  postreviewProduct(){
    if (!this.review.review || !this.review.star_count) {
      Swal.fire('Sorry', 'Please provide both a review and a star rating to submit your feedback.', 'warning');
      return;
    }
    if(this.token){
      this.review.star_count = this.rating;
    this.dashboardService.postReviewProduct(this.review).subscribe({
      next : (Response) =>{
        Swal.fire('Success!', 'You are Review Add Successfully..!', 'success');
        this.loadreview(this.currentPage, this.itemsPerPage);
        this.resetForm();
      },
      error : (Error) => {
        Swal.fire('Error', 'sorry..!', 'error');
      }
    })
  }
  else{
    // const modalElement = document.getElementById('CheckLoggedIN');
    // if (modalElement) {
    //   const modal = new (window as any).bootstrap.Modal(modalElement);
    //   modal.show();
    // }  

       this.modalService.openModal();

    }
  }

  resetForm() {
    this.review = {
      star_count: 0,
      review: ' ',
      productid: this.review.productid 
    };
    this.rating = 0;  
  }

    // Handle page change for pagination
    onPageChange(page: number): void {
      this.currentPage = page;
      this.loadreview(this.currentPage, this.itemsPerPage); 
      this.p = page;
    }


    currentUrl: string = window.location.href;

  shareOnWhatsApp() {
      const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(this.currentUrl)}`;
      window.open(whatsappUrl, '_blank');
  }
  
  
  copyLink() {
      navigator.clipboard.writeText(this.currentUrl).then(() => {
          alert('Link copied to clipboard!');
      }).catch(err => {
          console.error('Could not copy text: ', err);
      });
  }
  
  shareOnFacebook() {
      const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(this.currentUrl)}`;
      window.open(facebookUrl, '_blank');
  }

  showshare=false;
  shareicon(){
    this.showshare = !this.showshare;
  }

  public onSave() {
    this.closebutton.nativeElement.click();
  }
  
  showproductName = false;
  trunproductName(name: string): string {
    return name.length > 10 ? name.slice(0, 12) + '...' : name;
  }

}
