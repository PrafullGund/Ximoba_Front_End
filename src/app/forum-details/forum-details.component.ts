import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
import { Editor, Toolbar } from 'ngx-editor';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { DashboardService } from '../common_service/dashboard.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import Swal from 'sweetalert2';
import { LoginService } from '../common_service/login.service';
import { AuthServiceService } from '../common_service/auth-service.service';
import { ModalServiceService } from '../common_service/modal-service.service';

@Component({
  selector: 'app-forum-details',
  templateUrl: './forum-details.component.html',
  styleUrls: ['./forum-details.component.css'],
  encapsulation: ViewEncapsulation.None,
})
export class ForumDetailsComponent implements OnInit, OnDestroy {

  id: any; 
  Forum: any; 
  editor!: Editor; 

  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link', 'image'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
  ];

  form = new FormGroup({
    editorContent: new FormControl('', { validators: Validators.required }),
  });

  ForumAnswer = {
    content: '',
    forumid: ''
  };

  constructor(
    private dashboardService: DashboardService,
    private router: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private loginservices: LoginService,
    private authService: AuthServiceService,
    private modalService:ModalServiceService,
  ) {
    this.id = this.router.snapshot.paramMap.get('id'); 
  }

  ngOnInit(): void {
    this.editor = new Editor();
    this.ForumAnswer.forumid = this.id; 
    this.loadForumDetails(); 
  }

  loadForumDetails(): void {
    this.dashboardService.getForumById(this.id).subscribe(result => {
      if (result?.data) {
        if (Array.isArray(result.data)) {
          this.Forum = result.data.map((forum: any) => ({
            ...forum,
            sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(forum.description),
            answer: forum.answer.map((ans: any) => ({
              ...ans,
              sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(ans.content)
            }))
          }));
        } else {
          this.Forum = {
            ...result.data,
            sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(result.data.description),
            answer: result.data.answer.map((ans: any) => ({
              ...ans,
              sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(ans.content)
            }))
          };
        }
      } else {
        console.error("No data received from the API");
      }
    }, error => {
      console.error("Error fetching forum data:", error);
    });
  }

  token = sessionStorage.getItem('Authorization');

  PostAnswer(): void {
    if(this.token){
    this.dashboardService.addForumAnswer(this.ForumAnswer).subscribe({
      next: (response) => {
        Swal.fire('Success!', 'Your answer has been posted successfully!', 'success');
        this.form.reset(); 
        this.loadForumDetails(); 
      },
      error: (error) => {
        Swal.fire('Error', 'There was an issue posting your answer. Please try again.', 'error');
      }
    });
  }else{
    this.modalService.openModal();
   }
  }

  ngOnDestroy(): void {
    this.editor.destroy(); 
  }


  show: boolean = false;
  rememberMe: boolean = false;

  userData = {
    f_Name: '',
    middle_Name: '',
    l_Name: '',
    email_id: ' ',
    password: '',
    mobile_number: ' ',

  }




  onSubmit(form: NgForm) {
    if (form.valid) {
      this.loginservices.postSignupData(this.userData).subscribe({
        next: (response) => {
          sessionStorage.setItem("Authorization",response.token);
          this.authService.login(response.token); // Set login state
          Swal.fire('Congratulation','Welcome to Ximbo! <br> Were thrilled to have you join our community of esteemed trainers, coaches, and educators. Ximbo is designed to empower you with the tools and resources needed to deliver exceptional training and create impactful learning experiences. <br> You Have Register successfully!', 'success');
        },
        error: (error)=>{
          Swal.fire('Error', 'Please Enter Valid Details.', 'error');
        } 
      });
    } else {
      console.log('Form is invalid');
    }
  }


   // Hide And Show Password Logic
   togglePassword() {
    this.show = !this.show;
  }

}
