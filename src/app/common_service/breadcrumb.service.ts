import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap, map } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {

  // BehaviorSubject to manage breadcrumb data
  private breadcrumbsSubject = new BehaviorSubject<Array<{ label: string, url: string }>>([]);
  breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor(private http: HttpClient) { }

  // Fetch and update breadcrumb data based on parameters
  getBreadCrumbs(category: string, type: string, id: string): void {
    const url = `${API_END_POINTS.search.getBreadCrumb}?category=${category}&type=${type}&id=${id}`;

    this.http.get<any>(url)
      .pipe(
        map(response => response.data || []),
        tap(breadcrumbs => this.breadcrumbsSubject.next(breadcrumbs))
      )
      .subscribe();
  }
}