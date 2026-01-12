import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FilterService {

  constructor() { }

  private selectedCategoriesSubject = new BehaviorSubject<string[]>([]);
  selectedCategories$ = this.selectedCategoriesSubject.asObservable();

  updateSelectedCategories(categories: string[]) {
    this.selectedCategoriesSubject.next(categories);
  }

  filterDataByCategories(allData: any[], selectedCategories: string[]): any[] {
    if (!selectedCategories.length) {
      return allData; 
    }
    return allData.filter(item => selectedCategories.includes(item.category_name)); 
  }

  private subCategoriesSubject = new BehaviorSubject<{ id: string; isChecked: boolean }[]>([]);
  subCategories$ = this.subCategoriesSubject.asObservable();

  updateSubCategories(selectedSubCategories: { id: string; isChecked: boolean }[]) {
    console.log("data",selectedSubCategories)
    this.subCategoriesSubject.next(selectedSubCategories);
  }

}
