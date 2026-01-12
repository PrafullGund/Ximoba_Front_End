import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  constructor(private http: HttpClient) { }

  postSignupData(Signup: any): Observable<any> {
    return this.http.post<any>(API_END_POINTS.login.studentRegister, Signup);
  }

  getStudentDataByID(): Observable<any> {
    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${sessionStorage.getItem('Authorization')}`);

    return this.http.get<any>(API_END_POINTS.student.getStudentDataById, { headers });
  }

}
