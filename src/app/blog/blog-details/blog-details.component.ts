import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-blog-details',
  templateUrl: './blog-details.component.html',
  styleUrls: ['./blog-details.component.css']
})
export class BlogDetailsComponent implements OnInit {

  id: string | null = null;
  showBlogDetails: any;

  constructor(
    private dashboardService: DashboardService,
    private router: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.id = this.router.snapshot.paramMap.get('id');
    if (this.id) {
      this.dashboardService.blogDataById(this.id).subscribe(
        (data) => {
          this.showBlogDetails = data.course || data;
        },
        (error) => {
          console.error('Error fetching blog details:', error);
        }
      );
    }
  }
}