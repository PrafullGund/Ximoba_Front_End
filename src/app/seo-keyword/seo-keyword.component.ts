import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { AdminService } from '../common_service/admin.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-seo-keyword',
  templateUrl: './seo-keyword.component.html',
  styleUrls: ['./seo-keyword.component.css']
})
export class SEOKeywordComponent implements OnInit {

  categories: any[] = [];
  subcategories: any[] = [];
  selectedCategory: string | null = null;
  loadingSubcategories: boolean = false;
  courses: any[] = [];
  selectedSubcategory: any | null = null;
  loadingCourses: boolean = false;
  courseCache: { [key: string]: any[] } = {};
  subcategoryCache: { [key: string]: any[] } = {};
  Showcouserdata: any[] = [];
 

  constructor(
    private dashboardService: DashboardService,
    private adminService: AdminService,
    private router: Router,
    private route:ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.fetchCategories();
    this.dashboardService.getSEOKeywords().subscribe((data) => {
      this.courses = data.courses || [];
    })
  }

  // Fetch all categories
  fetchCategories() {
    this.dashboardService.getAllCategory().subscribe(
      (response) => {
        if (response && response.length > 0) {
          this.categories = response;

          if (this.categories.length > 0) {
            const firstCategoryId = this.categories[0]._id;
            this.fetchSubcategories(firstCategoryId);
          }
        } else {
          console.error('No categories data in the response!');
        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    );
  }

  fetchSubcategories(categoryID: string) {
    this.selectedCategory = categoryID;
    this.loadingSubcategories = true;

    if (this.subcategoryCache[categoryID]) {
      this.subcategories = this.subcategoryCache[categoryID];
      this.loadingSubcategories = false;

      if (this.subcategories.length > 0) {
        this.selectedSubcategory = this.subcategories[0]._id;
        this.fetchCourses(this.selectedSubcategory);
      }
      return;
    }

    this.adminService.getSubCategoryByCategoryId(categoryID).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.subcategories = response.data.filter(
            (subcategory: any) => subcategory.category_id === categoryID
          );
          this.subcategoryCache[categoryID] = this.subcategories;
          if (this.subcategories.length > 0) {
            this.selectedSubcategory = this.subcategories[0]._id;
            this.fetchCourses(this.selectedSubcategory);
          }
        } else {
          this.subcategories = [];
          this.selectedSubcategory = null;
        }
        this.loadingSubcategories = false;
      },
      (error) => {
        this.subcategories = [];
        this.selectedSubcategory = null;
        this.loadingSubcategories = false;
      }
    );
  }


  fetchCourses(subcategoryId: string) {
    this.selectedSubcategory = subcategoryId;
    this.loadingCourses = true;
    this.courses = [];

    if (this.courseCache[subcategoryId]) {
      this.courses = this.courseCache[subcategoryId];
      this.loadingCourses = false;
      return;
    }

    const page = 1;
    const limit = 10;

    this.dashboardService.getCoursesByFooterSubcategory(subcategoryId).subscribe(
      (response) => {
        if (response.success && response.courses) {
          this.courses = response.courses;
          this.courseCache[subcategoryId] = response.courses;
          console.log()
        } else {
          this.courses = [];
        }
        this.loadingCourses = false;
      },
      (error) => {
        this.courses = [];
        this.loadingCourses = false;
      }
    );
    
  }

  

  navigateToCourse(courseId: string) {
    this.router.navigate([`/courseenroll/${courseId}`]);
  }

  // navigateToSubCategory() {
  //   this.router.navigate([``]);
  // }


}
