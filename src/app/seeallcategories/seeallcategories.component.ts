import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';
import { ActivatedRoute, Router } from '@angular/router';
import { RelevanceComponent } from '../relevance/relevance.component';
import { first, Subscription } from 'rxjs';

@Component({
  selector: 'app-seeallcategories',
  templateUrl: './seeallcategories.component.html',
  styleUrls: ['./seeallcategories.component.css']
})
export class SeeallcategoriesComponent implements OnInit {
  isLoading: boolean = true;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9;
  ShowCourseData: any[] = [];
  filteredCourses: any;
  selectedCategory: string[] = [];
  p: number = 1;
  term: any;
  searchTerm: string = '';
  courses: any[] = [];
  starsArray = Array(5).fill(0);
  currentSortOption: string = '';
  selectedsubcategoryid:any[]=[];
  private subcategorySubscription: Subscription | null = null;

  constructor(
    private dashboardService: DashboardService, 
    private filterService: FilterService,
    private http: HttpClient, 
    private searchService: SearchService, 
    private route: ActivatedRoute, 
    private relevanceComponent: RelevanceComponent
  ) { }

  ngOnInit(): void {
    this.subcategorySubscription = this.relevanceComponent.getSubcategorySubject().subscribe(subcategory => {
      this.isLoading = true;
      // Ensure subcategory is always an array
      const subcategoryArray = Array.isArray(subcategory) ? subcategory : [subcategory];
      

      this.selectedsubcategoryid = subcategoryArray;
      console.log('Subcategory changed:', subcategoryArray.join(","));

      this.filteredCourses = [];

      if (subcategoryArray.length > 0) {
        this.dashboardService.getCoursesBySubcategory(subcategoryArray.join(","), this.currentPage, this.itemsPerPage)
        .subscribe(result => {
            console.log("Filtered subcategory-wise courses:", result);

            if (Array.isArray(result?.data)) {
              this.filteredCourses = result.data.filter((course: any) =>
                subcategoryArray.includes(course.sub_category_id)
              );
            }
            this.isLoading = false;
          });
        } 
        else {
          this.isLoading = true;
          // If no subcategory is selected, load all courses
          this.loadCourses(this.currentPage, this.itemsPerPage);
          this.isLoading = false;
      }
    });
     

      // Handle the subcategory change here`
    // this.loadCourses(this.currentPage, this.itemsPerPage);

    // if property selected and available in url and property search in global search else loadc


    this.route.queryParams.subscribe((params: any) => {

      const selected = params['selected'] || null;
      const available = params['available'] || null;
      const categoryName = params['category'] || null;

      // Apply conditions based on query parameters
      if (selected && available ) {
        this.searchFilter();
      } else if (categoryName && !this.selectedsubcategoryid) {
        // this.applyFilter();
      } else {
        // this.loadAllCourses();
      }
    });
    this.filterService.selectedCategories$.subscribe((selectedCategoriesresult: any) => {
      this.selectedCategory = selectedCategoriesresult;
      console.log('Received Selected category:', this.selectedCategory);
       // this.applyFilter();
    });

    this.searchService.currentSearchData.subscribe((term: any) => {
      this.searchTerm = term;
      console.log('Received search term in SeeAllCategoriesComponent:', this.searchTerm);  // Log the search term
      //this.searchFilter();
      this.fetchCourses();
    });

    this.searchService.sortOption$.subscribe((option: any) => {
      this.currentSortOption = option;
      console.log('Received Sort Option:', this.currentSortOption);
      // this.applyFilter();
    });
  }

    ngOnDestroy(): void {
    if (this.subcategorySubscription) {
      this.subcategorySubscription.unsubscribe();
    }
  }
  // Fetch courses from the backend
  loadCourses(page: number, limit: number): void {
    this.isLoading = true;
    this.route.queryParams.pipe(first()).subscribe((params: any) => {
      const selected = params['selected'] || null;
      const available = params['available'] || null;
      const categoryName = params['category'] || null;
      const filter=params['filter']||'';
      console.log("courses ", filter);
  
      this.dashboardService.getAllCourses(page, limit,filter).subscribe((result: any) => {
        console.log("courses ", result);
        this.ShowCourseData = result?.coursesWithFullImageUrl;
        this.filteredCourses = this.ShowCourseData;
        this.totalItems = result?.pagination.totalItems;
        this.isLoading = false;
      });
    });
  }

  searchFilter(): void {
    this.filteredCourses = this.ShowCourseData;
    if (this.searchTerm) {
      this.filteredCourses = this.filteredCourses.filter((course: any) =>
        course.course_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
      this.totalItems = this.filteredCourses.length;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadCourses(this.currentPage,this.itemsPerPage)
    this.p = page;
  }



  fetchCourses() {
    if (this.searchTerm) {
      this.http.get<any>(`https://rshvtu5ng8.execute-api.ap-south-1.amazonaws.com/api/search/courses?course_name=${this.searchTerm}`)
        .subscribe(
          (response: any) => {
            this.ShowCourseData = response.data;
            console.log('Fetched Courses:', response);
            this.totalItems = response.pagination.totalItems;

          },
          (error: any) => {
            console.error('Error fetching courses:', error);
          }
        );
    } else {
      this.route.queryParams.subscribe((params: any) => {


        const categoryName = params['category'];

        if (!categoryName) {
          this.loadCourses(this.currentPage, this.itemsPerPage);
        }
        else{
          // this.applyFilter();
        }
      });


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


  showcourseName = false;
  truncatecourseName(name: string): string {
    return name.length > 18 ? name.slice(0, 13) + '...' : name;
  }
  showbusinessName = false;
  trunbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 16) + '...' : name;
  }

}
