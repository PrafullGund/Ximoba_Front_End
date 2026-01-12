import { Component, HostListener, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthServiceService } from '../common_service/auth-service.service';
import { RealoadServiceService } from '../common_service/reaload-service.service';
import { ModalServiceService } from '../common_service/modal-service.service';
import { MatDialog } from '@angular/material/dialog';
import { DashboardService } from '../common_service/dashboard.service';
import { TermsDialogComponent } from '../terms-dialog/terms-dialog.component';

interface Location {
  pincode: string;
  location: string;
}

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  currentUrl: string = '';
  password: string = '';
  rememberMe: boolean = false;
  rememberMeInstitute: boolean = false;
  Institutedata: any;
  locationData: Location[] = [];
  // locationSuggestionsFirst: any[] = [];
  // locationSuggestionsSecond:any[]=[];
  // groupedLocationResultsFirst: { [key: string]: any[] } = {};
  // groupedLocationResultsSecond: { [key: string]: any[] } = {};
  // private searchTimeout: any;

  userData = {
    f_Name: '',
    middle_Name: '',
    l_Name: '',
    email_id: '',
    password: '',
    mobile_number: '',
  }
  instituteData = {
    institute_name: '',
    address_1: '',
    f_Name: '',
    l_Name: '',
    middle_Name: '',
    password: '',
    address_2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
    email: '',
    role: '',
    phone_no: '',
    whatsapp_no: '',
    instituteid: ''
  };

  constructor(
    private loginservices: LoginService,
    private route: Router,
    private modalService: ModalServiceService,
    private authService: AuthServiceService,
    private realoadservice: RealoadServiceService,
    private dialog: MatDialog,
    private dashboardService:DashboardService
  ) { }

  ngOnInit() {
    this.currentUrl = this.route.url;
    this.GetInstitutelist();
  }

  onSubmit(form: NgForm) {
    if (form.valid && this.rememberMe) {
      this.loginservices.postSignupData(this.userData).subscribe({
        next: (response) => {
          sessionStorage.setItem("Authorization", response.token);
          if (this.route.url == '/signup') {
            this.route.navigate(['/dashboard']);
          }
          this.resetForm(form);
          this.modalService.closeModal();
          this.authService.login(response.token);
          this.realoadservice.triggerReloadHeader();
          Swal.fire(
            'Congratulations',
            'Welcome to Ximbo! <br> We’re thrilled to have you join our community of esteemed trainers, coaches, and educators. Ximbo is designed to empower you with the tools and resources needed to deliver exceptional training and create impactful learning experiences. <br> You have registered successfully!', 'success');
        },
        error: (error) => {
          let errorMessage = 'Please enter valid details.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire('Error', errorMessage, 'error');
        },
      });
    } else if (!this.rememberMe) {
      Swal.fire('Error', 'You must accept the Terms & Conditions to submit the form.', 'error');
    } else {
      console.log('Form is invalid');
    }
  }

  onInstituteRegister(form: NgForm) {
    if (form.valid && this.rememberMeInstitute) {
      this.loginservices.onInstituteRegister(this.instituteData).subscribe({
        next: (response) => {
          sessionStorage.setItem("Authorization", response.token);
          if (this.route.url == '/signup') {
            this.route.navigate(['/dashboard']);
          }
          this.resetForm(form);
          this.modalService.closeModal();
          this.authService.login(response.token);
          this.realoadservice.triggerReloadHeader();
          Swal.fire(
            'Congratulations',
            'Welcome to Ximbo! <br> We’re thrilled to have you join our community of esteemed trainers, coaches, and educators. Ximbo is designed to empower you with the tools and resources needed to deliver exceptional training and create impactful learning experiences. <br> You have registered successfully!', 'success');
        },
        error: (error) => {
          let errorMessage = 'Please enter valid details.';
          if (error.error && typeof error.error === 'string') {
            errorMessage = error.error;
          } else if (error.error && error.error.message) {
            errorMessage = error.error.message;
          }
          Swal.fire('Error', errorMessage, 'error');
        },
      });
    } else if (!this.rememberMeInstitute) {
      Swal.fire('Error', 'You must accept the Terms & Conditions to submit the form.', 'error');
    } else {
      console.log('Form is invalid');
    }
  }


  show: boolean = false;
  togglePassword() {
    this.show = !this.show;
  }

  resetForm(signUpForm: NgForm) {
    signUpForm.resetForm();
    this.userData = {
      f_Name: '',
      l_Name: '',
      middle_Name: '',
      email_id: '',
      mobile_number: '',
      password: ''
    };
    this.rememberMe = false;
  }

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

  openModal() {
    if (this.route.url == '/signup') {
      this.route.navigate(['/signin']);
    }
    else {
      this.modalService.closeModal();
      this.modalService.openLoginModal();
    }
  }

  GetInstitutelist(): void {
    this.loginservices.getInstitutes().subscribe(response => {
      console.log(response);
      this.Institutedata = response?.data;
    });
  }

  locationSuggestions: { [key: string]: any[] } = {
    address_1: [],
    address_2: [],
  };
  
  groupedLocationResults: { [key: string]: any } = {
    address_1: {},
    address_2: {},
  };
  
  searchTimeout: any;
  
  onLocationSearch(event: KeyboardEvent, field: string): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.locationSuggestions[field] = [];
    this.groupedLocationResults[field] = {};
  
    clearTimeout(this.searchTimeout);
  
    this.searchTimeout = setTimeout(() => {
      this.fetchLocations(query, field);
    }, 500);
  }
  
  fetchLocations(query: string = "pune", field: string): void {
    this.dashboardService.getLocations(query).subscribe(
      (response: { message: string; data: Location[] }) => {
        if (response && response.data) {
          this.locationSuggestions[field] = response.data.filter(entry =>
            entry.pincode.includes(query) || entry.location.toLowerCase().includes(query)
          );
          this.groupedLocationResults[field] = this.groupLocationResults(this.locationSuggestions[field]);
        }
      },
      (error) => console.error('Error fetching locations:', error)
    );
  }
  
  groupLocationResults(locations: any[]): { [key: string]: any[] } {
    return locations.reduce((acc, item) => {
      const key = item.type || 'Unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: any[] });
  }
  
  selectLocation(item: any, field: string): void {
   (this.instituteData as any)[field] = `${item.pincode}, ${item.location}`
    this.locationSuggestions[field] = [];
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: Event) {
    Object.keys(this.locationSuggestions).forEach(field => {
      this.locationSuggestions[field] = [];
    });
  }

  openTermsDialog() {
    this.dialog.open(TermsDialogComponent, {
      width: '900px', 
      disableClose: false,
    })
}
}
