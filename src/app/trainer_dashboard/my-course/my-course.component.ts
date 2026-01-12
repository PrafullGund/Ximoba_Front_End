import { Component, ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { AdminService } from 'src/app/common_service/admin.service';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { LoginService } from 'src/app/common_service/login.service';
import { StudentService } from 'src/app/common_service/student.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import { CookieService } from 'ngx-cookie-service';
import Swal from 'sweetalert2';
import { MatTabGroup } from '@angular/material/tabs';

@Component({
  selector: 'app-my-course',
  templateUrl: './my-course.component.html',
  styleUrls: ['./my-course.component.css']
})
export class MyCourseComponent implements OnInit, AfterViewInit {

  displayedColumns: string[] = ['srNo', 'thumbnail_image', 'course_name', 'category_name', 'start_date', 'course_duration', 'online_offline', 'course_price', 'level', 'action'];
  displayedColumnsOngoing: string[] = ['srNo', 'thumbnail_image', 'course_name', 'category_name', 'start_date', 'course_duration', 'online_offline', 'course_price'];
  displayedColumnsCompleted: string[] = ['srNo', 'thumbnail_image', 'course_name', 'category_name', 'start_date', 'end_date', 'course_duration', 'online_offline', 'course_price'];
  displayedColumnsCertificate: string[] = ['srNo', 'thumbnail_image', 'courseName', 'studentName', 'issuedDate', 'email'];

  dataSource = new MatTableDataSource<any>([]);
  dataSourceOngoing = new MatTableDataSource<any>([]);
  dataSourceCompleted = new MatTableDataSource<any>([]);
  dataSourceCertificate = new MatTableDataSource<any>([
    { courseName: 'HTML & CSS', studentName: 'Ashok Kumar', issuedDate: new Date(2024, 11, 20), email: 'test@test.com' },
    { courseName: 'HTML 5', studentName: 'Tina Dhabi', issuedDate: new Date(2024, 10, 20), email: 'test@test.com' }
  ]);

  @ViewChild('paginatorCourses') paginatorCourses!: MatPaginator;
  @ViewChild('paginatorOngoing') paginatorOngoing!: MatPaginator;
  @ViewChild('paginatorCompleted') paginatorCompleted!: MatPaginator;
  @ViewChild('paginatorCertificates') paginatorCertificates!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatTabGroup) tabGroup!: MatTabGroup;

  constructor(
    private trainerService: TrainerService,
    private authService: AuthServiceService,
    private studentService: StudentService,
    private route: ActivatedRoute,
    private rout: Router) { }

  filteredCourses = [
    {
      _id: "1",
      course_name: "Angular for Beginners",
      thumbnail_image: "assets/angular-course.jpg",
      course_duration: "4",
      online_offline: "Online",
      business_Name: "Tech Academy",
      course_rating: 4.5
    },
    {
      _id: "2",
      course_name: "React Masterclass",
      thumbnail_image: "assets/react-course.jpg",
      course_duration: "6",
      online_offline: "Offline",
      business_Name: "Web Experts",
      course_rating: 5
    }
  ];
  isUser: boolean = true;
  isTrainer: boolean = false;
  isSELF_EXPERT: boolean = false;
  isInstitute: boolean = false;
  isAdmin: boolean = false;
  minDate: string = '';
  starsArray = Array(5).fill(0);
  showCourseDataStudent: any[] = [];

  checkUserRole() {
    const role = this.authService.getUserRole();
    console.log("role", role);
    this.isTrainer = role === 'TRAINER';
    this.isSELF_EXPERT = role === 'SELF_EXPERT';
    this.isInstitute = role === 'INSTITUTE';
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isUser = role === 'USER';
  }

  ngOnInit(): void {
    this.setTabFromQueryParam();
    this.checkUserRole();
    this.fetchTotalCourses();
    this.fetchOngoingCourses();
    this.fetchCompletedCourses();
    this.fetchStudentData();
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginatorCourses;
    this.dataSource.sort = this.sort;
    this.dataSourceOngoing.paginator = this.paginatorOngoing;
    this.dataSourceOngoing.sort = this.sort;
    this.dataSourceCompleted.paginator = this.paginatorCompleted;
    this.dataSourceCompleted.sort = this.sort;
    this.dataSourceCertificate.paginator = this.paginatorCertificates;
  }

  fetchTotalCourses() {
    this.trainerService.getCoursesByTrainerId().subscribe((result: any) => {
      this.dataSource.data = result?.coursesWithFullImageUrl || [];
    });
  }

  fetchStudentData() {
    this.studentService.getStudentDataByID().subscribe(
      (result: any) => {
        this.showCourseDataStudent = result;
      });
  }

  fetchOngoingCourses() {
    this.trainerService.getOngoingCourse(1, 10).subscribe((result: any) => {
      this.dataSourceOngoing.data = result?.ongoingCourses || [];
    });
  }

  fetchCompletedCourses() {
    this.trainerService.getCompleteCourses(1, 10).subscribe((result: any) => {
      this.dataSourceCompleted.data = result?.completedCourses || [];
    });
  }

  onToggleCourseType(element: any, isChecked: boolean): void {
    element.online_offline = isChecked ? 'Offline' : 'Online';
    console.log(`Course "${element.course_name}" is now set to: ${element.online_offline}`);
  }

  convertToMonthsAndDays(days: number): string {
    if (!days) return "N/A";
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return remainingDays > 0 ? `${months} months, ${remainingDays} days` : `${months} months`;
  }

  onActionSelected(event: any, element: any) {
    const action = event.value;
    if (action === 'edit') {
      this.rout.navigate([`/dashboard/editcourse/${element._id}`]);
    } else if (action === 'disable') {
    } else if (action === 'delete') {
      this.deleteCourse(element._id);
    }
  }

  deleteCourse(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this course? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteCourse(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The course has been deleted successfully.', 'success');
            this.fetchTotalCourses();
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the course.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The course is safe :)', 'info');
      }
    });
  }

  setTabFromQueryParam(): void {
    this.route.queryParams.subscribe(params => {
      const tabIndex = +params['tab'] || 0;
      setTimeout(() => {
        if (this.tabGroup) {
          this.tabGroup.selectedIndex = tabIndex;
        }
      });
    });
  }
  
}