import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { OAuthService } from 'angular-oauth2-oidc';
import { linkedinAuthConfig } from '../app.config';
import { Location } from '@angular/common';

@Component({
  selector: 'app-linkedin-auth-callback',
  templateUrl: './linkedin-auth-callback.component.html',
  styleUrls: ['./linkedin-auth-callback.component.css']
})
export class LinkedinAuthCallbackComponent implements OnInit{

  userProfile: any;

  constructor(private oauthService: OAuthService,private location: Location,
    private http:HttpClient,private router:Router) {}

  ngOnInit() {
    // debugger;
    const token=localStorage.getItem('linkedin_access_token');
    if(token)
    {
      this.fetchUserProfile(token);
    }
    else{
    this.oauthService.configure(linkedinAuthConfig);
    const url= this.location.path();
    const queryParams=new URLSearchParams(url.split('?')[1])
      const code = queryParams.get('code');

      if (code) {
        this.getAccessToken(code);
      } else {
        // Handle error
      }
    }
  }

  login() {
    this.oauthService.initLoginFlow();
  }

  fetchUserProfile(token:string) {
    const apiUrl = 'http://localhost:1000/api/linkedin/userinfo';
    
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${token}`, 
      'Content-Type': 'application/json' 
    });
   this.http.get(apiUrl,{headers}).subscribe((responspe:any)=>
    {console.log(responspe)},(error)=>{console.error('Error fetching profile', error);});  
  }
  
  getAccessToken(code: string) {
    this.http.post('http://localhost:1000/api/linkedin/access-token', { code })
      .subscribe(
        (response: any) => {
          console.log('Access token received', response);
          localStorage.setItem('linkedin_access_token', response.access_token);
          this.router.navigate(['/alltrainer']); 
        },
        (error) => {
          console.error('Error fetching access token', error);
        }
      );
  }
}
