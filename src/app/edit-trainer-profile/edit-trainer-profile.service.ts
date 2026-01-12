import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_END_POINTS } from '../constants/api-endpoints-constant';

@Injectable({
  providedIn: 'root'
})
export class EditTrainerProfileService {

  constructor(private http: HttpClient) { }

  postInstitute(data:any):Observable<any>{
    return this.http.post(API_END_POINTS.institute.postInstitute,data);
  }

  getInstituteProfile(): Observable<any> {
    return this.http.get(API_END_POINTS.institute.getInstituteProfile);
  }
  
  updateInstituteProfile(updatedData: any): Observable<any> {
    return this.http.put(API_END_POINTS.institute.updateInstituteProfile, updatedData);
  }
  
  
  postEducation(data:any):Observable<any>{
    return this.http.post(API_END_POINTS.education.postEducation,data);
  }

  getEducationDetails(): Observable<any> {
    return this.http.get(API_END_POINTS.education.getEducationDetails);
  }
  
  updateEducationDetails(educationData: any): Observable<any> {
    return this.http.put(API_END_POINTS.education.updateEducationDetails, educationData);
  }
  
}