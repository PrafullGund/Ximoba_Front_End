import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  // private Search URL= ""

  private searchData = new BehaviorSubject<string>('');  // This will store the search term
  currentSearchData = this.searchData.asObservable();

  private sortOptionSubject = new BehaviorSubject<string>('');
  sortOption$ = this.sortOptionSubject.asObservable();

  setSortOption(option: string): void {
    this.sortOptionSubject.next(option);
  }

  constructor() {}

  changeSearchData(data: string) {
    this.searchData.next(data);  
  }
}
