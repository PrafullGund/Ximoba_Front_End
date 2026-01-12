import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SearchService } from '../search.service';
import { AdminService } from '../common_service/admin.service';
import { BehaviorSubject, Subject, Subscription, filter, of } from 'rxjs';

@Component({
  selector: 'app-relevance',
  templateUrl: './relevance.component.html',
  styleUrls: ['./relevance.component.css']
})
export class RelevanceComponent implements OnInit {
  private subcategorySubject = new Subject<string[]>();

  bannerImage$: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

  selectedSubcategoryIds: string[] = [];
  Showcategorydata: any[] = [];
  filteredCategoryData: any[] = [];
  selectedCategories: string[] = [];
  selectedSubcategories: string[] = [];
  category: string = '';
  categoryID: any = '';
  selectedSortOption: string = '';
  bannerImage: string | null = null;
  inputPlaceholder: string = 'Search';
  categoryName: string | null = null;
  categoryidfromsubcat: any;
  SubCategoryName: any
  headerdataarray: any[] = [];
  subcategoryId: any = '';
  subCategory: any[] = [];
  fetchcategoryID: string = '';

  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;

  constructor(
    private dashboardService: DashboardService,
    private filter: FilterService,
    private route: ActivatedRoute,
    public router: Router,
    private searchService: SearchService,
    private admin: AdminService,
  ) { }

  ngOnInit(): void {

    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event: any) => {
      if (event.url === '/relevance/alltrainer') {
        console.log('The current route is /relevence/alltrainer');
        // Perform actions if needed
      }
    });

    this.route.queryParams.subscribe(params => {
      this.subcategoryId = params['subcategoryId'];
      this.selectedSubcategoryIds.push(params['subcategoryId']);
      this.categoryName = params['category'];
      this.categoryID = params['id'];
      this.getsubcategory();
    });

    // this.dashboardService.getAllCategory().subscribe(data => {
    //   this.Showcategorydata = data;
    // });
    this.dashboardService.getAllCategory().subscribe((data: { category_name: string }[]) => {
      this.Showcategorydata = data.sort((a, b) => a.category_name.localeCompare(b.category_name));
    });
    

    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.updateBannerImage();
      });
    this.initializeSelectedCategory();  
    this.updateBannerImage();
  }

  applyCategoryFilter(): void {
    if (this.selectedCategories.length > 0) {
      this.filteredCategoryData = this.Showcategorydata.filter(cat =>
        this.selectedCategories.includes(cat.category_name));
    } else {
      this.filteredCategoryData = this.Showcategorydata;
    }
  }

  areAllCategoriesSelected(): boolean {
    return this.Showcategorydata.every(cat => this.selectedCategories.includes(cat.category_name));
  }

  getsubcategory() {
    if (this.categoryID) {
      this.admin.getSubCategoryByCategoryId(this.categoryID).subscribe(result => {
        this.subCategory = (result.data || []).sort((a: { sub_category_name: string }, b: { sub_category_name: string }) => 
          a.sub_category_name.localeCompare(b.sub_category_name)
        ); 
        let subCategoryIds = this.subCategory.map((element: { _id: string }) => element._id);
        
        if (this.subcategoryId) {
          return this.subcategorySubject.next(this.subcategoryId);
        } else {
          this.selectedSubcategoryIds = subCategoryIds;
          return this.subcategorySubject.next(subCategoryIds);
        }
      });
  
      return this.admin.getSubCategoryByCategoryId(this.categoryID);
    } else {
      this.subCategory = [];
      return of({ data: [] });
    }
  }
  
  getSubcategorySubject(): Subject<string[]> {
    return this.subcategorySubject;
  }

  initializeSelectedCategory(): void {
    if (this.category) {
      this.selectedCategories = [this.category];
      this.filter.updateSelectedCategories(this.selectedCategories); 
      this.applyCategoryFilter();  
    }
  }

  isCategorySelected(categoryName: string): boolean {
    return this.selectedCategories.includes(categoryName);
  }

  loadSubCategory(subcategoryName: string) {
    const selectedSubcategory = this.subCategory.find(sub => sub.sub_category_name === subcategoryName);
    if (selectedSubcategory) {
      this.selectedSubcategoryIds = [selectedSubcategory._id];
      this.subcategoryId=this.selectedSubcategoryIds;
      this.subcategorySubject.next([selectedSubcategory._id]);
    }
    if (this.selectedSubcategoryIds.length === 0) {
      this.selectedSubcategories = [];
      this.categoryID = '';
      this.filter.updateSelectedCategories(this.selectedCategories);
      this.applyCategoryFilter();

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null, id: null, subcategoryId: '' },
        queryParamsHandling: 'merge'
      })
    }
  }

  onSubcategoryChange(subcategoryId: string, event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedSubcategoryIds.push(subcategoryId);
    } else {
      const index = this.selectedSubcategoryIds.indexOf(subcategoryId);
      if (index > -1) {
        this.selectedSubcategoryIds.splice(index, 1);
      }
    }
    this.subcategorySubject.next(this.selectedSubcategoryIds);

    if (this.selectedSubcategoryIds.length === 0) {
      this.selectedSubcategories = [];
      this.categoryID = '';
      this.filter.updateSelectedCategories(this.selectedCategories);
      this.applyCategoryFilter();

      this.router.navigate([], {
        relativeTo: this.route,
        queryParams: { category: null, id: null, subcategoryId: '' },
        queryParamsHandling: 'merge'
      })
    }
  }

  onCategoryChange(categoryName: string, categoryId: string, event: Event): void {
    this.selectedCategories = [];
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.categoryID = categoryId;
      this.selectedCategories.push(categoryName);
    } else {
      this.selectedSubcategoryIds = [];
      this.subcategorySubject.next(this.selectedSubcategoryIds);
    }

    this.filter.updateSelectedCategories(this.selectedCategories);
    this.applyCategoryFilter();
    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: { category: categoryName, id: categoryId, subcategoryId: '' },
      queryParamsHandling: 'merge'
    });
  }

  onSelectAll(event: Event): void {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedCategories = this.Showcategorydata.map(cat => cat.category_name);
    } else {
      this.selectedCategories = [];
    }
    this.filter.updateSelectedCategories(this.selectedCategories);
    this.applyCategoryFilter();
  }

  onSearch(event: any) {
    const searchTerm = event.target.value;
    this.searchService.changeSearchData(searchTerm);
  }

  onSortOptionChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSortOption = selectedValue;
    this.searchService.setSortOption(this.selectedSortOption);
  }

  scrollLeft() {
    this.scrollContainer.nativeElement.scrollBy({ left: -100, behavior: 'smooth' });
  }

  scrollRight() {
    this.scrollContainer.nativeElement.scrollBy({ left: 100, behavior: 'smooth' });
  }

  updateBannerImage(): void {
    const route = this.router.url;
    if (route.includes('/relevance/alltrainer')) {
      this.bannerImage = '../../assets/Trainer_list_Banner.png';
    } else if (route.includes('/relevance')) {
      this.bannerImage = '../../assets/courses_gridbannerimg.png';
    } else {
      this.bannerImage = null;
    }
    // setTimeout(() => {
    //   const bannerElement = document.querySelector('.banner-img') as HTMLElement;
    //   if (bannerElement) {
    //     bannerElement.style.marginTop = '';
    //   }
    // }, 0);
  }

  

  updatePlaceholder(event: Event) {
    const selectedValue = (event.target as HTMLSelectElement).value;

    switch (selectedValue) {
      case 'Courses':
        this.inputPlaceholder = 'Search Courses';
        this.router.navigate(['/relevance/Allcourses']);
        break;
      case 'Trainers':
        this.inputPlaceholder = 'Search Trainers';
        this.router.navigate(['/relevance/alltrainer']);
        break;
      case 'Products':
        this.inputPlaceholder = 'Search Products';
        this.router.navigate(['/relevance/allproducts']);
        break;
      case 'Events':
        this.inputPlaceholder = 'Search Events';
        this.router.navigate(['/relevance/allevents']);
        break;
    }
  }
}