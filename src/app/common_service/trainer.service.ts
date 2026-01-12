import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class TrainerService {

  constructor(private http: HttpClient) { }

  // *************** Trainer Profile API *****************

  getTrainerById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.trainer.getTrainerById);
  }

  getInstituteById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.institute.getInstituteProfile);
  }

  updateTrainerDetails(formData: FormData): Observable<any> {
    return this.http.put<any>(API_END_POINTS.trainer.updateTrainerDetails, formData);
  }

  updataInstituteDetails(formData: FormData): Observable<any> {
    return this.http.put<any>(API_END_POINTS.institute.updateInstituteDetails, formData);
  }

  updataInstituteProfile(formData: FormData): Observable<any> {
    return this.http.put<any>(API_END_POINTS.institute.updateInstituteProfile, formData);
  }

  postInstituteSocialLinks(formData: any): Observable<any> {
    return this.http.put<any>(API_END_POINTS.institute.postInstituteSocialLinks, formData);
  }

  postEducation(formData: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.education.postEducation, formData);
  }

  postAbout(formData: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.about.postAbout, formData);
  }

  postSkills(formData: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.skills.postSkills, formData);
  }

  postTestimonial(formData: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.testimonial.postTestimonial, formData);
  }

  postGallery(formData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.gallery.postGallery, formData);
  }
  // *************** Course API *****************

  getTrainerDataById(): Observable<any> {
    const headers = new HttpHeaders().set("Authorization", `Bearer ${sessionStorage.getItem('Authorization')}`);
    return this.http.get<any>(API_END_POINTS.trainer.getTrainerDataById, { headers });
  }

  getOngoingCourse(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.course.getOngoingCourses}?page=${page}&limit=${limit}`);
  }

  getAllCourseRequest(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.admin.getAllCourseRequest);
  }

  getCompleteCourses(page: any, limit: any): Observable<any> {
    const url = `${API_END_POINTS.course.getCompleteCourses}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  viewRequestCourseById(id: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.course.viewRequestCourseById}/${id}`);
  }

  courseRequestChangeStatus(courseId: string, status: string): Observable<any> {
    const body = { courseId, status };
    return this.http.put<any>(API_END_POINTS.admin.courseRequestChangeStatus, body);
  }

  deleteCourse(_id: string): Observable<any> {
    return this.http.delete(`${API_END_POINTS.course.deleteCourse}/${_id}`);
  }

  updateCourse(CID: any, CDATA: FormData): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.course.updateCourse}/${CID}`, CDATA);
  }

  // *************** Event API *****************

  getEventByTrainerId(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.event.getEventByTrainerId);
  }

  addEvent(eventData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.event.addEvent, eventData);
  }

  getAllEventsRequest(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.admin.getAllEventsRequest);
  }

  viewRequestEventsById(id: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.event.viewRequestEventById}/${id}`);
  }

  eventsRequestChangeStatus(eventId: string, status: string): Observable<any> {
    const body = { eventId, status };
    return this.http.put<any>(API_END_POINTS.admin.changeEventRequestStatus, body);
  }

  deleteEvent(_id: any): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.event.deleteEvent}/${_id}`);
  }

  getEventByID(_id: any): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.event.getEventByID}/${_id}`);
  }

  updateEventByID(_id: string, formData: any): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.event.updateEventByID}/${_id}`, formData);
  }

  getRegisteredEvents(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.event.getRegisteredEvents);
  }

  // *************** Product API *****************

  getAllProductByTrainerId(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.product.getAllProductsByTrainerId);
  }

  addProduct(productData: FormData): Observable<any> {
    return this.http.post<any>(API_END_POINTS.product.addProduct, productData);
  }

  getAllProductRequest(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.admin.getAllProductRequests);
  }

  viewRequestProductByID(id: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.product.viewProductRequestById}/${id}`);
  }

  productRequestChangeStatus(productId: string, status: string): Observable<any> {
    const body = { productId, status };
    return this.http.put<any>(API_END_POINTS.admin.changeProductRequestStatus, body);
  }

  deleteProductById(_id: string): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.product.deleteProduct}/${_id}`);
  }

  getProductById(_id: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.product.getProductByID}/${_id}`);
  }

  updateProduct(_id: string, formData: FormData): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.product.updateProduct}/${_id}`, formData);
  }

  getProductDataById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.product.getRegisteredProductData);
  }

  // *************** Enquiry API *****************

  deleteEnquiry(_id: string): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.enquiries.deleteEnquiry}/${_id}`);
  }

  getEnquiry(page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.enquiries.getEnquiries}?page=${page}&limit=${limit}`);
  }
  markaallseninquirybyid(id:any): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.enquiries.markseenbyid}/markAsSeen/${id}`, {});
  }

  markaallseninquiry(): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.enquiries.markallseen}/markAllSeen`, {});
  }
  getallunreadinquiry(page: number, limit: number):Observable<any>{
    return this.http.get<any>(
      `${API_END_POINTS.enquiries.getallunseeninquiry}/unseen?page=${page}&limit=${limit}`
    );
  }
  replyenquiry(payload: any): Observable<any> {
    return this.http.post<any>(
      `${API_END_POINTS.enquiries.postEnquiryreply}`, 
      payload 
    );
  }

  // *************** Appointment *****************

  deleteAppointmentById(_id: string): Observable<any> {
    return this.http.delete<any>(`${API_END_POINTS.appointment.deleteAppointment}/${_id}`);
  }

  approveAppointment(id: string): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.appointment.approveAppointment}/${id}/approve`, {});
  }

  rejectAppointment(id: string, rejectionReason: string): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.appointment.rejectAppointment}/${id}/reject`, {
      rejectionReason: rejectionReason,
    });
  }

  // ****************** Trainer Profile *********************  

  getProfile(id: string): Observable<any> {
    return this.http.get<any>(`${API_END_POINTS.trainer.getTrainerProfileById}/${id}`);
  }

  getAllCourseSonProfilePage(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.trainer.getAllCoursesOnProfilePage}/${id}?page=${page}&limit=${limit}`
    );
  }

  getAllEventSonProfilePage(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.event.getAllEventsOnProfilePage}/${id}?page=${page}&limit=${limit}`
    );
  }

  getAllProductOnProfilePage(id: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.product.getAllProductsOnProfilePage}/${id}?page=${page}&limit=${limit}`
    );
  }

  getAppointment(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.appointment.getTrainerAppointments}?page=${page}&limit=${limit}`
    );
  }

  //  ****************** 	Question ********************* 

  getQuestion(page: number, limit: number): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.questions.getTrainerQuestions}?page=${page}&limit=${limit}`
    );
  }
  replyquestions(payload: any): Observable<any> {
    return this.http.post<any>(
      `${API_END_POINTS.questions.replyToQuestion}`, 
      payload 
    );
  }

  markallread(): Observable<any> {
    return this.http.put<any>(
      `${API_END_POINTS.questions.markallread}`,
      {}
    );
  }
  markreadbyId(questionId: string): Observable<any> {
    return this.http.put<any>(
      `${API_END_POINTS.questions.markreadbyId}/${questionId}`, 
      { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) }
    );
  }
  getviewdata(): Observable<any> {
    return this.http.get<any>(
      `${API_END_POINTS.questions.statusgetdata}`
    );
  }
  

  deleteQuestion(_id: string): Observable<any> {
    return this.http.delete<any>(
      `${API_END_POINTS.questions.deleteQuestion}/${_id}`
    );
  }

  
  getallunreadquestions(page: number, limit: number):Observable<any>{
    return this.http.get<any>(
      `${API_END_POINTS.questions.getallunseenquestion}/unseen?page=${page}&limit=${limit}`
    );
  }

  //  ****************** 	Social Media ********************* 

  getInstituteSocialMediaById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.institute.getSocialMedia);
  }

  getEducationById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.education.getEducationById);
  }

  getAboutUsById(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.about.getAboutById);
  }

  getReviewByTrainerId(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.review.getTrainerReviews);
  }

  getCoursesByTrainerId(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.course.getCoursesByTrainerId)
  }

  replytoreview(): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.replyTrainerReviews, {})
  }
  markallseen(): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.markallseen, {})
  }
  markseenid(): Observable<any> {
    return this.http.post<any>(API_END_POINTS.review.markseenid, {})
  }

}
