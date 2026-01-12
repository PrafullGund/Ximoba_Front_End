import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-user-event',
  templateUrl: './user-event.component.html',
  styleUrls: ['./user-event.component.css']
})
export class UserEventComponent implements OnInit {

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9;
  showEventData: any[] = [];
  filteredEvent: any[] = [];
  selectedCategories: any;
  p: number = 1;
  term: any;
  searchTerm: string = '';
  currentSortOption: string = '';

  constructor(
    private dashboardService: DashboardService,
    private filterService: FilterService,
    private http: HttpClient,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.loadEvents(this.currentPage, this.itemsPerPage);
    this.filterService.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.filterEvents();
    });

    this.searchService.currentSearchData.subscribe(term => {
      this.searchTerm = term;
      this.searchFilter();
      this.fetchEvents();
    });

    this.searchService.sortOption$.subscribe(option => {
      this.currentSortOption = option;
      this.filterEvents();
    });
  }

  loadEvents(page: number, limit: number): void {
    this.dashboardService.getEventData(page, limit).subscribe(Response => {
      this.showEventData = Response.data;
      this.filteredEvent = this.showEventData;
      this.totalItems = Response.pagination.totalItems;
    });
  }

  searchFilter(): void {
    if (!this.searchTerm) {
      this.filteredEvent = this.showEventData;
    } else {
      this.filteredEvent = this.showEventData.filter(event =>
        event.event_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  filterEvents(): void {
    this.filteredEvent = this.showEventData;
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      this.dashboardService.getEventDataCategory(this.currentPage, this.itemsPerPage, this.selectedCategories, this.currentSortOption)
        .subscribe(result => {
          this.filteredEvent = result.data.filter((event: any) =>
            this.selectedCategories.includes(event.event_category)
          );
          this.totalItems = result.pagination.totalItems;
        });
    } else if (this.currentSortOption) {
      this.dashboardService.getEventDataCategory(this.currentPage, this.itemsPerPage, this.selectedCategories, this.currentSortOption)
        .subscribe(result => {
          this.showEventData = result.data;
          this.filteredEvent = this.showEventData;
          this.totalItems = result.pagination.totalItems;
        });
    }
    else {
      this.filteredEvent = this.showEventData;
      this.totalItems = this.showEventData.length;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.loadEvents(this.currentPage, this.itemsPerPage);
    this.p = page;
  }

  fetchEvents(): void {
    if (this.searchTerm) {
      this.http.get<any>(`https://rshvtu5ng8.execute-api.ap-south-1.amazonaws.com/api/search/events?event_name=${this.searchTerm}`)
        .subscribe(
          (response) => {
            this.showEventData = response.data;
            this.filteredEvent = response.data;
            this.totalItems = response.pagination.totalItems;
          },
          (error) => {
            console.error('Error fetching events:', error);
          }
        );
    } else {
      this.loadEvents(this.currentPage, this.itemsPerPage);
    }
  }
  showEventName = false;
  turnEventName(name: string): string {
    return name.length > 14 ? name.slice(0, 12) + '...' : name;
  }
}
