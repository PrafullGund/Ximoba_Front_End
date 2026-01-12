import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { AdminService } from '../common_service/admin.service';

gsap.registerPlugin(MotionPathPlugin);

export interface Subcategory {
  _id: string;
  sub_category_name: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  

  hoverDirection: 'right' | 'left' | null = null;
  showAll: boolean = false;
  showCategorydata: any[] = [];
  Showcouserdata: any[] = [];
  showproductdata: any[] = [];
  showeventdata: any[] = [];
  ShowAllCategory: any[] = [];
  hoveredCourse: string | null = null;
  courses: any[] = [];
  selectedSubcategory: any = '';
  loadingCourses = false;
  showtrainerData: any[] = [];
  selectedProduct: any;
  categories: any[] = [];
  subcategories: any[] = [];
  selectedCategory: string | null = null;
  loadingSubcategories: boolean = false;
  subcategoryCache: { [key: string]: any[] } = {};
  selectedSubcategoryId: string | null = null;
  selectedCategoryName:string=''

  page = 0;
  limit = 4;
  starsArray: number[] = [1, 2, 3, 4, 5];

  showFullName = false;
  truncateBusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 15) + '...' : name;
  }

  showcourseName = false;
  truncatecourseName(name: string): string {
    return name.length > 15 ? name.slice(0, 12) + '...' : name;
  }

  showbusinessName = false;
  trunbusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 15) + '...' : name;
  }

  showeventName = false;
  truneventName(name: string): string {
    return name.length > 14 ? name.slice(0, 12) + '...' : name;
  }

  showproductName = false;
  trunproductName(name: string): string {
    return name.length > 14 ? name.slice(0, 16) + '...' : name;
  }

  showFullcategorytitle = false;
  truncatecategorytitle(name: string): string {
    return name?.length > 40 ? name.slice(0, 35) + '...' : name;
  }

  visibleCategories() {
    return this.showAll ? this.showCategorydata : this.showCategorydata.slice(0, 10);
  }

  visibleCourses() {
    return this.showAll ? this.Showcouserdata : this.Showcouserdata.slice(0, 4);
  }

  visibleProduct() {
    return this.showAll ? this.showproductdata : this.showproductdata.slice(0, 4);
  }

  visibleEvent() {
    return this.showAll ? this.showeventdata : this.showeventdata.slice(0, 4);
  }

  showAlltrainer: boolean = false;
  toggleViewtainer() {
    this.showtrainerData || [];
    this.showAlltrainer = !this.showAlltrainer;
  }

  visibleTrainer() {
    return this.showAlltrainer ? this.showtrainerData : this.showtrainerData.slice(0, 6)
  }

  @ViewChild('subcategoryList', { static: false }) subcategoryList!: ElementRef;
  @ViewChild('categoryList', { static: false }) categoryList!: ElementRef;

  constructor(
    private dashboardService: DashboardService,
    private admin: AdminService,
  ) { }

  ngAfterViewInit(): void {
    gsap.registerPlugin(MotionPathPlugin);
    const animateSVG = (lineId: string, arrowGroupId: string) => {
      gsap.set(arrowGroupId, { transformOrigin: "50% 50%" });
      const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

      timeline.to(lineId, {
        duration: 4,
        strokeDashoffset: 0,
        ease: "none"
      });

      timeline.to(arrowGroupId, {
        duration: 4,
        motionPath: {
          path: lineId,
          align: lineId,
          autoRotate: true,
          alignOrigin: [0.5, 0.5]
        },
        ease: "none"
      }, 0);
    }
    animateSVG("#line-1", "#arrow-group-1");
    animateSVG("#line-2", "#arrow-group-2");
    animateSVG("#line-3", "#arrow-group-3");
  }

  ngOnInit(): void {
    this.dashboardService.getHomeDataUser(this.page, this.limit).subscribe(data => {
      this.showCategorydata = data.categoriesWithFullImageUrl;
      this.showtrainerData = data.trainersWithFullImageUrl;
      this.showproductdata = data.productDetails;
      this.showeventdata = data.eventDetails;
    });

    this.dashboardService.getAllCategory().subscribe(response => {
      this.ShowAllCategory = response;
      this.ShowAllCategory.sort((a, b) => a.category_name.localeCompare(b.category_name));
    })
    this.fetchCategories();
  }

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

        }
      },
      (error) => {
        console.error('Error fetching categories:', error);
      }
    )
  }

  fetchSubcategories(categoryID: string) {
    this.selectedCategory = categoryID;
    this.loadingSubcategories = true;

    if (this.subcategoryCache[categoryID]) {
      this.subcategories = [...this.subcategoryCache[categoryID]];
      this.sortSubcategories();
      this.loadingSubcategories = false;
      this.selectFirstSubcategory();
      return;
    }
    this.admin.getSubCategoryByCategoryId(categoryID).subscribe(
      (response) => {
        if (response && response.data && response.data.length > 0) {
          this.subcategories = response.data.filter(
            (subcategory: any) => subcategory.category_id === categoryID
          );
          this.sortSubcategories();
          this.subcategoryCache[categoryID] = this.subcategories;
          this.selectFirstSubcategory();
        } else {
          this.subcategories = [];
        }
        this.loadingSubcategories = false;
      },
      (error) => {
        console.error('Error fetching subcategories:', error);
        this.loadingSubcategories = false;
        this.subcategories = [];
      }
    )
  }

  fetchCourses(subcategoryId: string): void {
    this.loadingCourses = true;
    this.selectedSubcategory = subcategoryId;
    const page = 1;
    const limit = 10;
    this.dashboardService.getCoursesBySubcategory(subcategoryId, page, limit).subscribe({
      next: (response) => {
        if (response.success) {
          this.Showcouserdata = response.data;
        } else {
          this.courses = [];
        }
        this.loadingCourses = false;
        console.log("fetchCourses", response)
      },
      error: (err) => {
        console.error('Error fetching courses:', err);
        this.courses = [];
        this.loadingCourses = false;
      },
    });
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

  selectFirstSubcategory() {
    if (this.subcategories.length > 0) {
      this.selectedSubcategory = this.subcategories[0]._id;
      this.fetchCourses(this.selectedSubcategory);
    }
  }

  scrollCategoryLeft() {
    if (this.categoryList) {
      this.categoryList.nativeElement.scrollBy({ left: -150, behavior: 'smooth' });
    }
  }

  scrollCategoryRight() {
    if (this.categoryList) {
      this.categoryList.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  scrollLeft() {
   if(this.subcategoryList){
    this.subcategoryList.nativeElement.scrollBy({left:-150,behavior:'smooth'})
   }
  }

  scrollRight() {
    if (this.subcategoryList) {
      this.subcategoryList.nativeElement.scrollBy({ left: 150, behavior: 'smooth' });
    }
  }

  selectSubCategory(subcategoryId: any) {
    this.selectedSubcategoryId = subcategoryId;

  }

  sortSubcategories() {
    this.subcategories.sort((a, b) =>
      a.sub_category_name.localeCompare(b.sub_category_name)
    )
  }
}