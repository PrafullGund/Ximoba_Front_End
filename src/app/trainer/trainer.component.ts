import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { RelevanceComponent } from '../relevance/relevance.component';

@Component({
  selector: 'app-trainer',
  templateUrl: './trainer.component.html',
  styleUrls: ['./trainer.component.css']
})
export class TrainerComponent implements OnInit {
  showtrainerData: any[] = [];
  filteredtrainer: any[] = [];
  selectedCategories: any = [];
  selectedSubCategory: any = [];
  searchTerm: string = '';
  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9;
  categoryId: string | null = null;
  showFullName = false;
  trainerList:any[]=[];
  allTrainerList: any[] = [];


  constructor(
    private dashboardService: DashboardService,
    private filterService: FilterService,
    private http: HttpClient,
    private searchService: SearchService,
    private route: ActivatedRoute,
    private relevanceComponent: RelevanceComponent
  ) { }

  truncateBusinessName(name: string): string {
    return name.length > 18 ? name.slice(0, 15) + '...' : name;
  }

  ngOnInit(): void {
    this.loadTrainers(this.currentPage, this.itemsPerPage);

    this.route.queryParams.subscribe(params => {
      const filter = params['filter']?.toLowerCase() || '';
      this.trainerList = this.allTrainerList.filter(trainer =>
        (trainer.f_Name + ' ' + trainer.l_Name).toLowerCase().includes(filter)
      );
    });
    
    this.relevanceComponent.getSubcategorySubject().subscribe(subcategory => {
      const subcategoryArray = Array.isArray(subcategory) ? subcategory : [subcategory];
      this.selectedSubCategory = subcategoryArray;

      if (subcategoryArray.filter((sub: any) => sub !== "").length > 0) {
        this.filterTrainers(subcategoryArray);
      } else {
        this.filteredtrainer = [...this.showtrainerData];
      }
    });

    this.route.queryParams.subscribe(params => {
      this.categoryId = params['id'] || null;
      if (this.categoryId) {
        this.filterTrainers(this.selectedSubCategory);
      }
    });

    this.filterService.selectedCategories$
      .pipe(distinctUntilChanged())
      .subscribe(categories => {
        this.selectedCategories = categories;
      });

    this.searchService.currentSearchData
      .pipe(debounceTime(300), distinctUntilChanged())
      .subscribe(term => {
        this.searchTerm = term;
      });
  }

  loadTrainers(page: number, limit: number): void {
    this.dashboardService.getTrainerData(page, limit).subscribe(data => {
      this.showtrainerData = data.trainers;
      this.filteredtrainer = [...this.showtrainerData];
      this.totalItems = data.pagination.totalItems;
    });
  }

  filterTrainers(subcategoryArray: any): void {
    let trainers = [...this.showtrainerData];

    if (this.searchTerm) {
      trainers = trainers.filter(trainer =>
        trainer.Business_Name?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        trainer.f_Name?.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
    const validSubcategories = subcategoryArray.filter((subcategory: any) => subcategory !== "");

    if (validSubcategories.length > 0) {
      this.dashboardService.getTrainersBySubCategory(validSubcategories, this.currentPage, this.itemsPerPage)
        .subscribe({
          next: (result) => {
            console.log("API Response:", result);
            this.filteredtrainer = result?.data || [];
          },
          error: (err) => {
            console.error("Error fetching trainers by subcategory:", err);
            this.filteredtrainer = [];
          }
        });
    } else {
      this.filteredtrainer = trainers;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadTrainers(this.currentPage, this.itemsPerPage);
    this.p = page;
  }
}
