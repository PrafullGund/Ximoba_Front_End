import { ChangeDetectorRef, Component, ElementRef, HostListener, Query, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, Event } from '@angular/router';
import { AuthServiceService } from '../common_service/auth-service.service';
import { Observable, Subject, Subscription } from 'rxjs';
import { LoginService } from '../common_service/login.service';
import { DashboardService } from '../common_service/dashboard.service';
import Swal from 'sweetalert2';
import { debounceTime, filter, switchMap, take } from 'rxjs/operators';
import { NgForm } from '@angular/forms';
import { RealoadServiceService } from '../common_service/reaload-service.service';
import { AdminService } from '../common_service/admin.service';

declare var bootstrap: any;

interface Location {
  pincode: string;
  location: string;
  // city: string;
}
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
  encapsulation: ViewEncapsulation.None,
})

export class HeaderComponent {
  private hoverCategorySubject = new Subject<string>();
  private searchTimeout: any;
  isUser: boolean = false;
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isDashboard: boolean = false;
  isLoggedIn$: Observable<boolean>;
  user$: Observable<string | null>;
  id$: Observable<string | null>;
  subcategoriesId: any;
  groupedSuggestions: Record<string, any[]> = {};
  isDashboardRoute = false;
  Showcategorydata: any;
  Institutedata: any;
  category: string = '';
  id: string = '';
  type: string = '';
  keyword: string = '';
  subCategory: any[] = [];
  selectedCategoryId: string | null = null;
  subCategoryLoading: boolean = false;
  UserImage: string | null = null;
  subcategoriesMap: { [key: string]: any[] } = {};
  hoveredCategory: string | null = null;
  unseennotificationcount: any;
  selectedSubcategoryId: string | null = null;
  query: string = '';
  results: any;
  searchitemresult: any[] = [];
  suggestions: any[] = [];
  locationQuery: string = '';
  locationSuggestions: any[] = [];
  groupedLocationResults: { [key: string]: any[] } = {};
  locationData: Location[] = [];
  courseName: string | null = null;
  private routerSubscription!: Subscription;
  searchPlaceholder: string = 'Search Course or Instructor';
  currentFilterGroup: string = 'course'; 

  role = {
    requested_Role: '',
    business_Name: '',
    address_1: '',
    mobile_number: '',
    whatsapp_no: '',
    date_of_birth: '',
    address2: '',
    pincode: '',
    city: '',
    state: '',
    country: '',
  }

  institute = {
    business_Name: '',
    address_1: '',
    mobile_number: '',
    whatsapp_no: '',
    date_of_birth: '',
    address2: '',
    city: '',
    state: '',
    country: '',
    pincode: '',
  }

  TrainerundersInstitute = {
    instituteId: ''
  }
 
  constructor(
    private authService: AuthServiceService,
    public route: Router,
    private loginService: LoginService,
    private dashboardService: DashboardService,
    private cdr: ChangeDetectorRef,
    private router: ActivatedRoute,
    private adminService: AdminService,
    private reloadservice: RealoadServiceService,
    private eRef: ElementRef
  ) 
  {
    this.route.events.subscribe(() => {
      this.isDashboardRoute = this.route.url.includes('/dashboard');
    });

    this.route.events
    .pipe(filter((event: Event): event is NavigationEnd => event instanceof NavigationEnd))
    .subscribe((event: NavigationEnd) => {
      this.updateSearchContext(event.urlAfterRedirects);
    });

    this.isLoggedIn$ = this.authService.isLoggedIn$;
    this.user$ = this.authService.user$;
    this.id$ = this.authService.id$;

    this.router.queryParams.subscribe(params => {
      this.category = params['category'];
      this.courseName = params['filter']; 
      this.id = params['id'];
      this.selectedCategoryId = params['id'] || null;
      this.type = params['type'];
      this.keyword = params['keyword'];

      if (this.courseName) {
        this.query = this.courseName;
        this.dashboardService.search(this.query).subscribe(result => {
          this.suggestions = this.formatSearchResults(result);
          this.groupedSuggestions = this.getGroupedSuggestions();
        },
          error => {
            console.error('Error:', error);
          }
        );
      } else if (this.category) {
        this.query = this.category;
      }
      else{
        this.query='';
      }
    });
  }

  token = sessionStorage.getItem('Authorization');

  ngOnInit(): void {
    this.fetchCategoriesHeader();
    document.addEventListener('click', this.handleOutsideLocationClick.bind(this));

    this.route.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.suggestions = [];
      }
    });

    this.reloadservice.reloadHeader$.subscribe(() => {
      this.checkUserRole();
      this.unseenNotification();
      this.cdr.detectChanges();
      this.UserImage = sessionStorage.getItem("Profile");
    });

    if (this.token) {
      this.checkUserRole();
      this.unseenNotification();
    }

    this.reloadservice.userImage$.subscribe(() => {
      this.UserImage = sessionStorage.getItem("Profile");
    })

    this.route.events
  .pipe(
    filter((event: Event) => event instanceof NavigationEnd)
  )
  .subscribe(event => {
    const navigationEvent = event as NavigationEnd;
    this.isDashboard = navigationEvent.urlAfterRedirects === '/dashboard';
    this.locationQuery = '';
    this.locationSuggestions = [];
    this.groupedLocationResults = {};
  });
  }

  ngAfterViewInit(): void {
    const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]');
    tooltipTriggerList.forEach((tooltipTriggerEl) => {
      new bootstrap.Tooltip(tooltipTriggerEl);
    });
  }

  ngOnDestroy() {
    document.removeEventListener('click', this.handleOutsideLocationClick.bind(this));
  }

  addinstitute() {
    const payload = {
      ...this.role,
      ...this.institute
    };

    this.loginService.postRequestRoleChange(payload).subscribe({
      next: (response) => {
        Swal.fire(
          'Congratulations..!',
          'Your request has been successfully submitted to the admin. You can expect access to the Institute role within the next 24 hours. If you experience any issues, please don’t hesitate to reach out to us at contact@ximboa.io.',
          'success'
        );
        this.closeModal();
      },
      error: (error) => {
        console.error("Error:", error);

        if (error?.error?.statusCode === 400 && error?.error?.message === "Role change request is already pending.") {
          Swal.fire(
            'Request Already Submitted',
            'Your request for access to the Institute role has already been submitted. Please allow up to 24 hours for processing. If you have any questions or concerns, feel free to contact us at contact@ximboa.io.',
            'error'
          );
        } else {
          Swal.fire(
            'Request Failed',
            'An unexpected error occurred. Please try again later.',
            'error'
          );
        }
      }
    });
  }

  addtrainerunderinstitute() {
    const payload = {
      ...this.role,
      ...this.TrainerundersInstitute
    };

    this.loginService.postRequestRoleChange(payload).subscribe({
      next: (response) => {
        Swal.fire(
          'Congratulations..!',
          'Your request has been successfully submitted to the admin. You can expect access to the Trainer role within the next 24 hours. If you experience any issues, please don’t hesitate to reach out to us at contact@ximboa.io.',
          'success'
        );
        this.closeModal();
      },
      error: (error) => {
        console.error("Error:", error);

        // Check for specific error message and status code in the nested error response
        if (error?.error?.statusCode === 400 && error?.error?.message === "Role change request is already pending.") {
          Swal.fire(
            'Request Already Submitted',
            'Your request for access to the Trainer role has already been submitted. Please allow up to 24 hours for processing. If you have any questions or concerns, feel free to contact us at contact@ximboa.io.',
            'error'
          );
        } else {
          // Show a generic error message for other cases
          Swal.fire(
            'Request Failed',
            'An unexpected error occurred. Please try again later.',
            'error'
          );
        }
      }
    });
  }

  checkUserRole() {
    const role = this.authService.getUserRole();
    console.log('User Role:', role);

    // this.isAdmin = role === 'ADMIN';
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isUser = role === 'USER';
  }

  @HostListener('document:click', ['$event'])
  clickOutside(event: MouseEvent) {
    if (!this.eRef.nativeElement.contains(event.target as Node)) {
      this.suggestions = [];
    }
  }

  closeModal() {
    const modalElement = document.getElementById('exampleModalExpert');
    const modalInstance = bootstrap.Modal.getInstance(modalElement);
    if (modalInstance) {
      modalInstance.hide();
    }
  }

  closeSubcategories(categoryId: string): void {
    if (this.hoveredCategory === categoryId) {
      this.hoveredCategory = null;
    }
  }

  executeLocationSearch(): void {
    if (this.locationQuery.length > 1) {
      this.onLocationSearchManual(this.locationQuery);
    } else {
      alert("Invalid Location Query");
    }
  }

  fetchSubcategories(categoryId: string): void {
    this.hoveredCategory = categoryId;
    this.removeLocalStorageItemsContaining('Subcategories');
    this.selectedSubcategoryId = "";
  
    if (this.subcategoriesMap[categoryId]) {
      return;
    }
    const category = this.Showcategorydata.find((cat: any) => cat._id === categoryId);
    if (category && category.sub_categories) {
      this.subcategoriesMap[categoryId] = category.sub_categories
        .map((subCategoryName: string) => ({ sub_category_name: subCategoryName }))
        .sort((a: any, b: any) => a.sub_category_name.localeCompare(b.sub_category_name));
      localStorage.setItem(`Subcategories_${categoryId}`, JSON.stringify(this.subcategoriesMap[categoryId]));
    }
  }

  fetchCategoriesHeader(): void {
    this.dashboardService.getAllCategory()
      .pipe(take(1)) 
      .subscribe((data: any[]) => {
        this.Showcategorydata = data.sort((a: any, b: any) => 
          a.category_name.localeCompare(b.category_name)
        );
      }, error => {
        console.error("Error fetching categories:", error);
      });
  }
  
  fetchLocations(query: string = "pune"): void {
    this.dashboardService.getLocations(query).subscribe(
      (response: { message: string; data: Location[] }) => {
        if (response && response.data) {
          this.locationData = response.data;
  
          // Now filter suggestions after fetching the latest data
          this.locationSuggestions = this.locationData.filter(entry =>
            entry.pincode.includes(query) ||
            entry.location.toLowerCase().includes(query)
          );
  
          this.groupedLocationResults = this.groupLocationResults();
        }
      },
      (error) => {
        console.error('Error fetching locations:', error);
      }
    );
  }

  formatSearchResults(result: any): any[] {
    const formattedResults = [];
    if (result.Courses) {
      formattedResults.push(...result.Courses.map((course: any) => ({
        type: 'course',
        name: `${course.course_name} (${course.business_Name})`,
        category_name: course.category_name,
        id: course._id
      })));
    }

    if (result.Products) {
      formattedResults.push(...result.Products.map((product: any) => ({
        type: 'product',
        name: `${product.product_name} (${product.business_Name})`,
        category: product.category,
        id: product._id
      })));
    }

    if (result.categories) {
      formattedResults.push(...result.categories.map((category: any) => ({
        type: 'category',
        name: category.category_name,
        id: category._id
      })));
    }

    if (result.Events) {
      formattedResults.push(...result.Events.map((event: any) => ({
        type: 'event',
        name: event.event_name,
        events_category: event.events_category,
        id: event._id
      })));
    }

    if (result.Trainers) {
      formattedResults.push(...result.Trainers.map((trainer: any) => ({
        type: 'trainer',
        name: `${trainer.f_Name} (${trainer.business_Name})`,
        trainer_categories: trainer.trainer_categories,
        id: trainer._id
      })));
    }

    if (result.institute) {
      formattedResults.push(...result.institute.map((institute: any) => ({
        type: 'institute',
        name: institute.institute_name,
        id: institute._id
      })));
    }

    if (result.InstituteDummy) {
      formattedResults.push(...result.InstituteDummy.map((institute: any) => ({
        type: 'institute',
        name: institute.institute_name,
        id: institute._id
      })));
    }
    return formattedResults;
  }

  GetInstitutelist(): void {
    this.loginService.getInstitutes().subscribe(response => {
      this.Institutedata = response?.data;
    });
  }

  getGroupedSuggestions(): Record<string, any[]> {
    return this.suggestions.reduce((groups: Record<string, any[]>, suggestion) => {
      const { type } = suggestion;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(suggestion);
      return groups;
    }, {});
  }

  groupLocationResults() {
    return this.locationSuggestions.reduce((acc, item) => {
      const key = item.type || 'Unknown';
      if (!acc[key]) acc[key] = [];
      acc[key].push(item);
      return acc;
    }, {} as { [key: string]: any[] });
  }

  handleOutsideLocationClick(event: MouseEvent): void {
    if (!(event.target as HTMLElement).closest('.globale-search')) {
      this.locationSuggestions = [];
      this.groupedLocationResults = {};
    }
  }

  // handleEnterKey(): void {
  //   this.navigateBasedOnGroup(this.currentFilterGroup);
  // }

  handleEnterKey(): void {
    const queryParams = { filter: this.query };
  
    if (this.currentFilterGroup === 'trainer' && this.route.url.includes('/relevance/alltrainer')) {
      this.route.navigate([], {
        relativeTo: this.router,
        queryParams,
        queryParamsHandling: 'merge'  // Keeps existing params
      });
    } else if (this.currentFilterGroup === 'product' && this.route.url.includes('/relevance/Allcourses')) {
      this.route.navigate([], {
        relativeTo: this.router,
        queryParams,
        queryParamsHandling: 'merge'
      });
    } else {
      this.navigateBasedOnGroup(this.currentFilterGroup);
    }
  }
  

  logout() {
    this.authService.logout();
    this.route.navigate(['/']);
  }

  markAllTouched(form: NgForm, fields: string[]) {
    fields.forEach(field => {
      const control = form.controls[field];
      if (control) {
        control.markAsTouched();
        control.updateValueAndValidity();
      }
    });
  }

  onKeyUp(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      if (this.currentFilterGroup === 'trainer') {
        this.navigateBasedOnGroup('trainer');
      } else {
        this.navigateBasedOnGroup('course');
      }
      return;
    }
    this.searchitem(event);
  }
  
  navigateBasedOnGroup(groupKey: string): void {
    console.log("header component",groupKey);
    switch (groupKey) {
      case 'course':
        this.route.navigate(['/relevance/Allcourses'],{
          queryParams: { filter: this.query }
        });
        break;
      case 'trainer':
        this.route.navigate(['/relevance/alltrainer']);
        break;
      case 'product':
        this.route.navigate(['/relevance/allproducts']);
        break;
      case 'event':
        this.route.navigate(['/relevance/allevents']);
        break;
      case 'institute':
        this.route.navigate(['/relevance/alltrainer']);
        break;
      default:
        console.log('No route defined for this group');
    }
  }

  navigateToLocationGroup(groupKey: string): void {
    if (groupKey === 'location') {
    } else {
      console.log('No route defined for this location group');
    }
  }

  onLocationSearch(event: KeyboardEvent): void {
    const query = (event.target as HTMLInputElement).value.trim().toLowerCase();
  
    this.locationSuggestions = [];
      this.groupedLocationResults = {};
     
    clearTimeout(this.searchTimeout);

    this.searchTimeout = setTimeout(() => {
      this.fetchLocations(query);
    }, 500);  
  }
 
  onLocationSearchManual(query: string) {
    const searchText = query.trim().toLowerCase();

    if (searchText.length > 1) {
      this.locationSuggestions = this.locationData.filter(entry =>
        entry.pincode.includes(searchText) ||
        entry.location.toLowerCase().includes(searchText) 
        // entry.city.toLowerCase().includes(searchText)
      );
      this.groupedLocationResults = this.groupLocationResults();
    } else {
      this.locationSuggestions = [];
      this.groupedLocationResults = {};
    }
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      Swal.fire('Form Invalid', 'Please fill out all required fields.', 'error');
      return;
    }

    if (this.role.requested_Role === 'SELF_EXPERT') {
      this.markAllTouched(form, ['business_Name']);
    } else if (this.role.requested_Role === 'INSTITUTE') {
      this.markAllTouched(form, ['business_Name', 'mobileNo', 'address_1', 'address_2', 'state', 'contry', 'pincode']);
    } else if (this.role.requested_Role === 'TRAINER') {
      this.markAllTouched(form, ['instituteId']);
    }

    if (this.role.requested_Role === 'INSTITUTE') {
      this.addinstitute();
    }
    else if (this.role.requested_Role === 'TRAINER') {
      this.addtrainerunderinstitute();
    }
    else {
      this.sendRequest();
    }
  }

  onsearch() {
    if (this.query) {
      this.dashboardService.search(this.query).subscribe(
        data => {
          this.results = this.formatSearchResults(data);
        },
        error => {
          alert("Invalid Query");
        }
      );
    }
  }

  onSelectSuggestion(event: MouseEvent, suggestion: any): void {
    event.preventDefault();

    this.suggestions = [];

    if (suggestion.type === 'course') {
      this.route.navigate([`/couserenroll/${suggestion.id}`], {
      });
    } else if (suggestion.type === 'category') {
      this.route.navigate(['/relevance/Allcourses'], {
      });
    } else if (suggestion.type === 'product') {
      this.route.navigate([`/productdetails/${suggestion.id}`], {
      });
    } else if (suggestion.type === 'event') {
      this.route.navigate([`/eventdetails/${suggestion.id}`], {
      });
    }
    else if (suggestion.type === 'trainer') {
      const trainerCategory = suggestion.trainer_categories.length > 0 ? suggestion.trainer_categories[0] : 'defaultCategory';
      console.log(trainerCategory);
      this.route.navigate([`/coursedetails/${suggestion.id}`], {
      });
      console.log(trainerCategory);
    }
    else if (suggestion.type === 'institute') {
      this.route.navigate([`/coursedetails/${suggestion.id}`], {
      });
    }
  }

  removeLocalStorageItemsContaining(substring: string): void {
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.includes(substring)) {
        localStorage.removeItem(key);
        i--;
      }
    }
  }

  // searchitem(event: KeyboardEvent) {
  //   const element = event.target as HTMLInputElement;
  //   const query = element.value.trim();
  //   if (query && query.length > 1) {
  //     this.dashboardService.search(query).subscribe(result => {
  //       this.suggestions = this.formatSearchResults(result);
  //       this.groupedSuggestions = this.getGroupedSuggestions();
  //     },
  //       error => {
  //         console.error('Error:', error);
  //       }
  //     );
  //   } else {
  //     this.suggestions = [];
  //   }
  // }

  searchitem(event: KeyboardEvent) {
    const element = event.target as HTMLInputElement;
    const query = element.value.trim();
  
    if (query && query.length > 1) {
      if (this.currentFilterGroup === 'trainer') {
        this.dashboardService.getTrainerData(1, 100).subscribe(data => {
          const trainers: any[] = data.trainers || [];
  
          this.suggestions = trainers
            .filter((trainer: any) =>
              (trainer.f_Name + ' ' + trainer.l_Name).toLowerCase().includes(query.toLowerCase())
            )
            .map((trainer: any) => ({
              name: trainer.f_Name + ' ' + trainer.l_Name,
              type: 'trainer',
              data: trainer
            }));
  
          this.groupedSuggestions = this.getGroupedSuggestions();
        }, error => {
          console.error('Error fetching trainers:', error);
        });
      } else {
        this.dashboardService.search(query).subscribe(result => {
          this.suggestions = this.formatSearchResults(result);
          this.groupedSuggestions = this.getGroupedSuggestions();
        }, error => {
          console.error('Error:', error);
        });
      }
    } else {
      this.suggestions = [];
    }
  }

  selectLocationResult(event: MouseEvent, suggestion: any): void {
    event.preventDefault();
    this.locationQuery = `${suggestion.location},${suggestion.pincode}`;
    this.locationSuggestions = [];
    this.groupedLocationResults = {};
  }
  selectSubcategory(subcategoryId: any, categoryId: any) {
    this.selectedSubcategoryId = subcategoryId;
  }

  sendRequest() {
    this.loginService.postRequestRoleChange(this.role).subscribe({
      next: (response) => {
        Swal.fire(
          'Congratulations..!',
          'Your request has been successfully submitted to the admin. You can expect access to the Self Expert role within the next 24 hours. If you experience any issues, please don’t hesitate to reach out to us at contact@ximboa.io.',
          'success'
        );
        this.closeModal();
      },
      error: (error) => {


        if (error?.error?.statusCode === 400 && error?.error?.message === "Role change request is already pending.") {
          Swal.fire(
            'Request Already Submitted',
            'Your request for access to the Self Expert role has already been submitted. Please allow up to 24 hours for processing. If you have any questions or concerns, feel free to contact us at contact@ximboa.io.',
            'error'
          );
        } else {
          Swal.fire(
            'Request Failed',
            'An unexpected error occurred. Please try again later.',
            'error'
          );
        }
      }
    });
  }

  updateSearchContext(url: string): void {
    if (url.includes('/alltrainer')) {
      this.searchPlaceholder = 'Search Trainer';
      this.currentFilterGroup = 'trainer';
    } else if (url.includes('/Allcourses')) {
      this.searchPlaceholder = 'Search Course';
      this.currentFilterGroup = 'product';
    } else {
      this.searchPlaceholder = 'Search Course or Instructor';
      this.currentFilterGroup = 'course';
    }
  }

  unseenNotification(): void {
    this.loginService.unseenNotification().subscribe(response => {
      this.unseennotificationcount = response.unseenCount;
      this.cdr.detectChanges();
    });
  }

  isClicked = false; 

  onLoginClick() {
    this.isClicked = true;  
  }
}
