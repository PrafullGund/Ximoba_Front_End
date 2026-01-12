import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, Observable, retry, tap, throwError } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  constructor(private http: HttpClient) { }

  // ******************** Category API ***********************

  postCategory(name: string, sub_title: string, image: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('category_name', name);
    formData.append('category_image', image);
    formData.append('sub_title', sub_title);
    return this.http.post(`${API_END_POINTS.category.postCategory}`, formData);
  }

  getCategoryById(id: string): Observable<any> {
    return this.http.get(`${API_END_POINTS.category.getCategoryById}/${id}`);
  }

  updateCategory(id: string, updatedData: FormData): Observable<any> {
    return this.http.put(`${API_END_POINTS.category.updateCategory}/${id}`, updatedData);
  }

  deleteCategory(_id: string): Observable<any> {
    const url = `${API_END_POINTS.category.deleteCategory}/${_id}`;
    return this.http.delete(url);
  }

  postSubCategory(category_id: string, sub_category_name: string): Observable<any> {
    const payload = {
      category_id: category_id,
      sub_category_name: sub_category_name
    };
    return this.http.post(`${API_END_POINTS.category.postSubCategory}`, payload);
  }

  getSubCategoryByCategoryId(categoryID: string): Observable<any> {
    const url = `${API_END_POINTS.category.getSubCategory}/${categoryID}/sub-categories`;

    return this.http.get<any>(url).pipe(
      tap((response: any) => response),
      catchError((error) => {
        console.error("HTTP Error:", error.status, error.message);
        return throwError(() => new Error("Failed to fetch subcategories"));
      })
    );
  }

  updateSubCategory(id: string, sub_category_name: string, category_id: string): Observable<any> {
    return this.http.put<any>(
      `${API_END_POINTS.category.updateSubCategory}/${id}`,
      { sub_category_name, category_id }
    );
  }

  // ******************** Courses API ***********************

  postCourse(courseData: FormData): Observable<any> {
    return this.http.post(API_END_POINTS.course.postCourse, courseData);
  }

  getCourseById(id: string): Observable<any> {
    return this.http.get(`${API_END_POINTS.course.getCourseById}/${id}`);
  }

  updateCourse(id: string, data: FormData): Observable<any> {
    return this.http.put(`${API_END_POINTS.course.updateCourse}/${id}`, data);
  }

}
