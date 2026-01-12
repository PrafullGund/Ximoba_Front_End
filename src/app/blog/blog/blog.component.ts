import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { Router } from '@angular/router'

@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent implements OnInit {

  showBlogData: any;

  constructor(
    private dashboardService: DashboardService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.dashboardService.getBlogData().subscribe(result => {
      this.showBlogData = result;
    })
  }

  goToBlogDetail(id: number): void {
    this.router.navigate(['/blog', id]);
  }

}
