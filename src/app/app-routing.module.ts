import { Component, NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignInComponent } from './sign-in/sign-in.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { RelevanceComponent } from './relevance/relevance.component';
import { TrainerComponent } from './trainer/trainer.component';
import { CourseDetailsComponent } from './course-details/course-details.component';
import { SeeallcategoriesComponent } from './seeallcategories/seeallcategories.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ShopComponent } from './shop/shop.component';
import { GalleryComponent } from './gallery/gallery.component';
import { AdminDashboardCategoriesComponent } from './Admin/admin-dashboard-categories/admin-dashboard-categories.component';
import { EnrollNowComponent } from './enroll-now/enroll-now.component';
import { CourseenrollComponent } from './courseenroll/courseenroll.component';
import { TrainerHomeComponent } from './trainer_dashboard/trainer-home/trainer-home.component';
import { MyCourseComponent } from './trainer_dashboard/my-course/my-course.component';
import { QuestionComponent } from './trainer_dashboard/question/question.component';
import { AppointmentComponent } from './trainer_dashboard/appointment/appointment.component';
import { EventComponent } from './trainer_dashboard/event/event.component';
import { EnquiryComponent } from './trainer_dashboard/enquiry/enquiry.component';
import { ProductComponent } from './trainer_dashboard/product/product.component';
import { EditCourseComponent } from './trainer_dashboard/edit-course/edit-course.component';
import { EditCategoryComponent } from './Admin/edit-category/edit-category.component';
import { UpdateProductComponent } from './trainer_dashboard/update-product/update-product.component';
import { UpdateEventComponent } from './trainer_dashboard/update-event/update-event.component';
import { TrainerMyhomeComponent } from './trainer_dashboard/trainer-myhome/trainer-myhome.component';
import { CartComponent } from './cart/cart.component';
import { UsersideProductComponent } from './userside-product/userside-product.component';
import { UserEventComponent } from './user-event/user-event.component';
import { UserEventDetailsComponent } from './user-event-details/user-event-details.component';
import { SuperAdminComponent } from './super-admin/super-admin.component';
import { ReviewComponent } from './trainer_dashboard/review/review.component';
import { NotificationComponent } from './notification/notification.component';
import { BlogDetailsComponent } from './blog/blog-details/blog-details.component';
import { BlogComponent } from './blog/blog/blog.component';
import { AboutComponent } from './about/about.component';
import { FAQComponent } from './faq/faq.component';
import { EditProfilePictureComponent } from './edit-profile-picture/edit-profile-picture.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { LinkedinAuthCallbackComponent } from './linkedin-auth-callback/linkedin-auth-callback.component';
import { ContactComponent } from './contact/contact.component';
import { ForumComponent } from './forum/forum.component';
import { ForumDetailsComponent } from './forum-details/forum-details.component';
import { ForumAddPageComponent } from './forum-add-page/forum-add-page.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { authGuard } from './AuthGuard/auth.guard';
import { AddnewcoursesComponent } from './trainer_dashboard/addnewcourses/addnewcourses.component';
import { ProfileComponent } from './edit-trainer-profile/profile/profile.component';
import { PhotoComponent } from './edit-trainer-profile/photo/photo.component';
import { SidebarEditTrainerComponent } from './edit-trainer-profile/sidebar-edit-trainer/sidebar-edit-trainer.component';
import { ViewPublicProfileComponent } from './edit-trainer-profile/view-public-profile/view-public-profile.component';
import { AddressComponent } from './edit-trainer-profile/address/address.component';
import { EducationalDetailsComponent } from './edit-trainer-profile/educational-details/educational-details.component';
import { AccountSecurityComponent } from './edit-trainer-profile/account-security/account-security.component';
import { CloseAccountComponent } from './edit-trainer-profile/close-account/close-account.component';
import { ViewDashboardComponent } from './edit-trainer-profile/view-dashboard/view-dashboard.component';
import { EditUserImgComponent } from './edit-trainer-profile/edit-user-img/edit-user-img.component';
import { SelfEvaluationComponent } from './self-evaluation/self-evaluation.component';
import { AddTrainerForumComponent } from './trainer_dashboard/add-trainer-forum/add-trainer-forum.component';
import { TrainerForumDataComponent } from './trainer_dashboard/trainer-forum-data/trainer-forum-data.component';
import { ChatboxComponent } from './chatbox/chatbox.component';
import { RoadMapComponent } from './road-map/road-map.component';
import { ShareExpertiseComponent } from './share-expertise/share-expertise.component';
import { TermsConditionsComponent } from './terms-conditions/terms-conditions.component';
import { CanDeactivateGuard } from '../app/add-new-course-can-deactivate-guard';

const routes: Routes = [

  { path: "signin", component: SignInComponent },
  { path: "signup", component: SignUpComponent },
  { path: "auth/linkedin", component: LinkedinAuthCallbackComponent },
  { path: "reset-password",component:ResetPasswordComponent},
  { path: "editcategory/:_id",component:EditCategoryComponent , canActivate: [authGuard]},
  { path: "Notification", component: NotificationComponent, canActivate: [authGuard]},
  { path: "editprofilepicture", component: EditProfilePictureComponent , canActivate: [authGuard] },

  //  Routing For Trainer Dashboard
  {
    path: "dashboard", component: TrainerHomeComponent, canActivate: [authGuard],
    children: [
      { path: "", component: TrainerMyhomeComponent, canActivate: [authGuard]},
      { path: "superadmin", component: SuperAdminComponent, canActivate: [authGuard]},
      { path: "admincategory", component: AdminDashboardCategoriesComponent ,canActivate: [authGuard], data: { role: 'SUPER_ADMIN' }},
      {  path: "mycourse", component: MyCourseComponent,canActivate: [authGuard], },
      { path: "product", component: ProductComponent,canActivate: [authGuard] },
      { path: "question", component: QuestionComponent, canActivate: [authGuard] },
      { path: "appointment", component: AppointmentComponent , canActivate: [authGuard] },
      { path: "event", component: EventComponent , canActivate: [authGuard] },
      { path: "add-course", component: AddnewcoursesComponent , canActivate: [authGuard],canDeactivate: [CanDeactivateGuard] },
      { path: "editcourse/:_id", component: AddnewcoursesComponent , canActivate: [authGuard] },
      { path: "enquiry", component: EnquiryComponent , canActivate: [authGuard]},
      { path: "review", component: ReviewComponent , canActivate: [authGuard] },
      { path: "Add-Forum", component: AddTrainerForumComponent , canActivate: [authGuard] },
      { path: "ForumDetails", component: TrainerForumDataComponent , canActivate: [authGuard] },
    ] },
    
      {
        path: "profile", component: SidebarEditTrainerComponent, canActivate: [authGuard],
        children: [
          { path: "my-profile", component: ProfileComponent, canActivate: [authGuard]},
          { path: "my-profile/edit-user-img", component: EditUserImgComponent, canActivate: [authGuard]},
          { path: "view-public-profile", component: ViewPublicProfileComponent, canActivate: [authGuard]},
          { path: "photo", component: PhotoComponent, canActivate: [authGuard]},
          { path: "address", component: AddressComponent, canActivate: [authGuard]},
          { path: "education-details", component: EducationalDetailsComponent, canActivate: [authGuard]},
          { path: "account-security", component: AccountSecurityComponent, canActivate: [authGuard]},
          { path: "close-account", component: CloseAccountComponent, canActivate: [authGuard]},
          { path: 'view-dashboard', component: TrainerHomeComponent, canActivate: [authGuard] },
        ] },

  // { path: "editcourse/:_id", component: EditCourseComponent , canActivate: [authGuard] },
  { path: "editcourse/:_id", component: AddnewcoursesComponent , canActivate: [authGuard] },
  { path: "editproduct/:_id", component: UpdateProductComponent , canActivate: [authGuard] },
  { path: "editevent/:_id", component: UpdateEventComponent , canActivate: [authGuard] },

  //  Routing For User Dashboard
  { path: "", component: DashboardComponent },
  { path: "Home", component: DashboardComponent},
  { path: "coursedetails/:id", component: CourseDetailsComponent },
  { path: "productdetails/:id", component: ShopComponent ,data: { breadcrumb: 'Product Details' }},
  { path: "eventdetails/:id", component: UserEventDetailsComponent,data: { breadcrumb: 'Events Details' } },
  { path: "cart", component: CartComponent },
  { path: "gallery", component: GalleryComponent },
  {
    path: "relevance", component: RelevanceComponent, data: { breadcrumb: 'Relevance' },
    children: [
      { path: "", component: SeeallcategoriesComponent },
      { path: "Allcourses", component: SeeallcategoriesComponent,data: { breadcrumb: 'All Courses' } },
      { path: "alltrainer", component: TrainerComponent ,data: { breadcrumb: 'All Trainer' } },
      { path: "allproducts", component: UsersideProductComponent ,data: { breadcrumb: 'All Product' } },
      { path: "allevents", component: UserEventComponent ,data: { breadcrumb: 'All Events' } },
    ]
  },
  { path: "self-evaluation", component: SelfEvaluationComponent  },
  { path: "roadmap", component: RoadMapComponent  },
  { path: "couserenroll/:id", component: CourseenrollComponent ,data: { breadcrumb: 'Course Details' } },
  { path: "enrollNow", component: EnrollNowComponent },
  { path: "chatbox", component: ChatboxComponent },

  // blog     
  { path: "blog", component: BlogComponent },
  { path: "blogdetails/:id", component: BlogDetailsComponent },
  { path: "about", component: AboutComponent },
  { path: "faq", component: FAQComponent },
  { path: "privacy-policy", component: PrivacyPolicyComponent },
  { path: "terms-conditions", component: TermsConditionsComponent },
  { path: "Contact", component:ContactComponent},
  { path: "forum",component:ForumComponent},
  { path: "forum-details/:id",component:ForumDetailsComponent},
  { path: "Add-Forum",component:ForumAddPageComponent},
  { path:"share-Expertise",component:ShareExpertiseComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})

export class AppRoutingModule { }
