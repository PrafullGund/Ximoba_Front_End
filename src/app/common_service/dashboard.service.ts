import { query } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getAllCategory(): Observable<any> {
    // const cachedData = localStorage.getItem('AllCategory');
    // if (cachedData) {
    //   return new Observable(observer => {
    //     observer.next(JSON.parse(cachedData));
    //     observer.complete();
    //   });
    // } else {
    //   return this.http.get<any>(API_END_POINTS.category.getAllCategory).pipe(
    //     tap((data: any) => {
    //       localStorage.setItem('AllCategory', JSON.stringify(data));
    //     })
    //   );
    // }
    return this.http.get<any>(API_END_POINTS.category.getAllCategory)
  }

  getAllCourses(page: number, limit: number,filter:any=''): Observable<any> {
    return this.http.get<any>(API_END_POINTS.course.getAllCourses(page, limit,filter));
  }

  getCourseDataCategory(page: number, limit: number, category: string, filterType?: string): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.course.filterCourses(page, limit, category, filterType)
    );
}



  getHomeDataUser(page: number, limit: number): Observable<any> {
    return this.http.get<any>(API_END_POINTS.home.getHome(page, limit));
  }

  getCourseDataById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.course.getCoursesById(id));
  }

  getTrainerData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(API_END_POINTS.trainer.getTrainers(page, limit));
  }

  getTrainerDataCategory(page: number, limit: number, categories?: string, id?: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.trainer.filterTrainers(page, limit, categories='', id || ''));
  }

  getTrainersBySubCategory(subCategoryIds: string[], page: number = 1, limit: number = 10) {
    return this.http.post<{ statusCode: number; success: boolean; message: string; data: any[] }>(
      `${API_END_POINTS.trainer.filterBySubCategory}?page=${page}&limit=${limit}`,
      { subCategories: subCategoryIds }
    );
  }
  
  getProductData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(API_END_POINTS.product.getAllProducts(page, limit));
  }

  getProductDataCategory(page: number, limit: number, categories?: string, filterType?: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.product.filterProducts(page, limit, categories, filterType));
  }

  getProductDataById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.product.getProductById(id));
  }

  getCourseReview(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(API_END_POINTS.review.getCourseReview(id, page, limit));
  }

  getEventData(page: number, limit: number): Observable<any> {
    return this.http.get<any>(API_END_POINTS.event.getAllEvents(page, limit));
  }

  getEventDataCategory(page: number, limit: number, categories?: string, filterType?: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.event.filterEvents(page, limit, categories, filterType));
  }

  getEventDataById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.event.getEventById(id));
  }

  postReviewEvent(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.postEventReview, data);
  }

  getEventReview(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.review.getEventReview}/${id}?page=${page}&limit=${limit}`);
  }

  courseEnroll(data: { course_id: any }): Observable<any> {
    return this.http.post<any>(API_END_POINTS.enrollment.enrollCourse, data);
  }

  postReviewProduct(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.postProductReview, data);
  }

  getProductReview(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.review.getProductReview}/${id}?page=${page}&limit=${limit}`);
  }

  bookEvent(data: { event_id: any }): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.event.registerEvent}`, data);
  }

  getSEOKeywords(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.seo.getFooterData);
  }

  getCoursesBySubcategorys(subCategoryIds: string[]): Observable<any> {
    const ids = subCategoryIds.join(',');
    return this.http.get<any>(API_END_POINTS.seo.getCoursesBySubcategory(ids));
  }
  

  search(query: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.search.globalSearch}?q=${query}`);
  }

  postEnquiry(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.enquiries.postEnquiry, data);
  }

  postQuestions(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.questions.postQuestion, data);
  }

  postReview(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.postReview, data);
  }

  postReviewCourse(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.postCourseReview, data);
  }

  postBookAppointment(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.appointment.postBookAppointment, data);
  }

  postRegisterProduct(product: { product_id: string }): Observable<any> {
    return this.http.post(API_END_POINTS.product.postRegisterProduct, product);
  }

  postToCart(cart: { productId: any; quantity: any }): Observable<any> {
    return this.http.post<any>(API_END_POINTS.cart.postToCart, cart);
  }

  getCartProduct(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.cart.getCartProducts);
  }

  deleteCartProduct(productId: string): Observable<any> {
    return this.http.delete(API_END_POINTS.cart.deleteCartProductById(productId));
  }

  getBlogData(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.blog.getAllBlogs);
  }

  blogDataById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.blog.getBlogById(id));
  }

  getDashboardData(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.dashboard.getDashboardData);
  }

  getDashboardDataAdmin(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.dashboard.getAdminDashboardCounts);
  }

  getAllForum(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.forum.getAllForums);
  }

  getForumById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.forum.getForumById(id));
  }

  addForum(forum: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.addForum, forum);
  }

  addForumAnswer(forum: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.postAnswer, forum);
  }

  addReply(id: string, data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.Addreply(id), data
    , { responseType: 'text' as 'json' });
  }

  likeanddislike(id: string, data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.likedislike(id), data
    , { responseType: 'text' as 'json' });
  }
  likeanddislikeforReply(id: string, data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.likedislikeForReply(id), data
    , { responseType: 'text' as 'json' });
  }
  shareforumcount(id: string): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.shareforumcount(id), {}
    , { responseType: 'text' as 'json' });
  }
  shareforumreplycount(id: string): Observable<any> {
    return this.http.post<any>(API_END_POINTS.forum.shareForumReplycount(id), {}
    , { responseType: 'text' as 'json' });
  }
  getForumReplyById(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.forum.getForumReplyById(id));
  }

  submitInquiry(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.inquiry.submitInquiry, data);
  }

  getCoursesBySubcategory(subcategoryId: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      API_END_POINTS.course.getBySubcategory(subcategoryId, page, limit)
    );
  }

  getAllchat(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.chat.getAllchat);
  }
  Addchat(): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.Addchat, {});
  }
  getmessage(id: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.getmessage(id), {});
  }

  sendmessage(data:any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.chat.sendmessage, data, { responseType: 'text' as 'json' });
  }

  getLocations(query:any):Observable<any>{
    return this.http.get<any>(API_END_POINTS.location.getAllLocation(query));
  }

  postCourseComment(data: any): Observable<any> {
    return this.http.post<any>(
      API_END_POINTS.chat.postComment + '/' + data.courseId,
      { comment_text: data.comment_text },
      {
        responseType: 'text' as 'json'
      }
    );
  }

  getCoursesByFooterSubcategory(sub_category_ids: string): Observable<any> {
    const params = new HttpParams().set('sub_category_ids', sub_category_ids);
    return this.http.get<any>(API_END_POINTS.footer.getFooterCourse, { params });
  }
}
