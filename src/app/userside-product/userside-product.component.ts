import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { FilterService } from '../common_service/filter.service';
import { HttpClient } from '@angular/common/http';
import { SearchService } from '../search.service';

@Component({
  selector: 'app-userside-product',
  templateUrl: './userside-product.component.html',
  styleUrls: ['./userside-product.component.css'],
})
export class UsersideProductComponent implements OnInit {

  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 9;
  showproductdata: any[] = [];
  filteredProducts: any[] = [];
  selectedCategories: any;
  p: number = 1;
  term: any;
  products: any[] = [];
  currentSortOption: string = '';
  starsArray: number[] = [1, 2, 3, 4, 5];
  searchTerm: string = '';

  constructor(
    private dashboardService: DashboardService,
    private filterService: FilterService,
    private http: HttpClient,
    private searchService: SearchService
  ) { }

  ngOnInit(): void {
    this.loadProducts(this.currentPage, this.itemsPerPage);
    this.filterService.selectedCategories$.subscribe(categories => {
      this.selectedCategories = categories;
      this.applyFilter();
    });
    this.searchService.currentSearchData.subscribe(term => {
      this.searchTerm = term;
      this.searchfilter();
      this.fetchProducts();
    });
    this.searchService.sortOption$.subscribe(option => {
      this.currentSortOption = option;
      this.applyFilter();
    });
  }

  loadProducts(page: number, limit: number): void {
    this.dashboardService.getProductData(page, limit).subscribe(data => {
      this.showproductdata = data?.productsWithFullImageUrls;
      this.filteredProducts = this.showproductdata;
      this.totalItems = data?.pagination.totalItems;
    });
  }

  searchfilter(): void {
    this.filteredProducts = this.showproductdata;

    if (this.searchTerm) {
      this.filteredProducts = this.filteredProducts.filter((product: any) =>
        product.products_name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }
  }

  applyFilter(): void {
    this.filteredProducts = this.showproductdata;
    if (this.selectedCategories && this.selectedCategories.length > 0) {
      this.dashboardService.getProductDataCategory(this.currentPage, this.itemsPerPage, this.selectedCategories, this.currentSortOption)
        .subscribe(result => {
          this.filteredProducts = result.data.filter((product: any) =>
            this.selectedCategories.includes(product.products_category)
          );
          this.totalItems = result.pagination.totalItems;
        });
    } else if (this.currentSortOption) {

      this.dashboardService.getProductDataCategory(this.currentPage, this.itemsPerPage, this.selectedCategories, this.currentSortOption)
        .subscribe(result => {
          this.showproductdata = result.data;
          this.filteredProducts = this.showproductdata;
          this.totalItems = result.pagination.totalItems;
        });
    }
    else {
      this.filteredProducts = this.showproductdata;
      this.totalItems = this.showproductdata.length;
    }
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    this.p = page;
    this.loadProducts(this.currentPage, this.itemsPerPage);
  }

  fetchProducts(): void {
    if (this.searchTerm) {
      this.http.get<any>(`https://rshvtu5ng8.execute-api.ap-south-1.amazonaws.com/api/search/products?product_name=${this.searchTerm}`)
        .subscribe(
          response => {
            this.showproductdata = response.data;
            this.totalItems = response.pagination.totalItems;
          },
          error => {
            console.error('Error fetching products:', error);
          }
        );
    } else {
      this.loadProducts(this.currentPage, this.itemsPerPage);
    }
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

  showproductName = false;
  trunproductName(name: string): string {
    return name.length > 10 ? name.slice(0, 12) + '...' : name;
  }
}