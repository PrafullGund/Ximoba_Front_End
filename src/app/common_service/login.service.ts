import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  //********************** Trainer LOGIN API **********************

  constructor(private http: HttpClient, private router: Router) { }

  login(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.auth.login, data);
  }

  onInstituteLogin(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.instituteAuth.login, data);
  }

  postSignupData(Signup: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.auth.signup, Signup);
  }

  onInstituteRegister(Signup: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.institute.registerInstitute, Signup);
  }

  forgotPassword(data: { email_id: string }): Observable<any> {
    return this.http.post<any>(API_END_POINTS.auth.forgotPassword, data);
  }

  resetPassword(newPassword: any, token: string): Observable<any> {
    return this.http.post<any>(`${API_END_POINTS.auth.resetPassword}?token=${token}`, { newPassword });
  }

  postRequestRoleChange(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.user.requestRoleChange, data);
  }

  getPendingRoleRequests(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.user.getPendingRoleRequests);
  }

  getApprovedRoleRequests(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.user.getApprovedRoleRequests);
  }

  getRejectedRoleRequests(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.user.getRejectedRoleRequests);
  }

  approveRoleChange(data: { userid: string; approved: number }): Observable<any> {
    return this.http.post<any>(API_END_POINTS.user.approveRoleChange, data);
  }

  postInstitute(data: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.institute.createInstitute, data);
  }

  getInstitutes(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.institute.getInstitutes);
  }

  getNotifications(page: number, limit: number): Observable<any> {
    const headers = new HttpHeaders().set(
      "Authorization",
      `Bearer ${sessionStorage.getItem('Authorization')}`
    );
    const url = `${API_END_POINTS.notification.getUnseenNotifications}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url, { headers });
  }

  showUnseenNotifications(page: number, limit: number): Observable<any> {
    const url = `${API_END_POINTS.notification.getAllUnseenNotifications}?page=${page}&limit=${limit}`;
    return this.http.get<any>(url);
  }

  updateNotificationStatus(notificationId: string): Observable<any> {
    return this.http.put<any>(`${API_END_POINTS.notification.updateNotificationStatus}/${notificationId}`, {});
  }

  unseenNotification(): Observable<any> {
    return this.http.get<any>(API_END_POINTS.notification.getUnseenNotificationCount);
  }

  getUserDetails(id: string): Observable<any> {
    return this.http.get<any>(API_END_POINTS.user.getUserDetails(id));
  }

}
