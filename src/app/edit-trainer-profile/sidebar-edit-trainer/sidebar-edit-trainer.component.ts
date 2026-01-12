import { HttpClient } from '@angular/common/http';
import { Component, HostListener, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RealoadServiceService } from 'src/app/common_service/reaload-service.service';

@Component({
  selector: 'app-sidebar-edit-trainer',
  templateUrl: './sidebar-edit-trainer.component.html',
  styleUrls: ['./sidebar-edit-trainer.component.css']
})
export class SidebarEditTrainerComponent implements OnInit {

  userImage: string = '';
  showSidebar = false;
  is768px = false;
  Showcoursedetails: any;

  constructor(
    private router: Router,
    private reload: RealoadServiceService
  ) { }

  ngOnInit() {
    this.checkViewport();
    window.addEventListener('resize', this.checkViewport.bind(this));

    this.reload.userImage$.subscribe((image) => {
      this.userImage = image || '../../../assets/expert-icon-login';
    });
  }

  editUserImg() {
    this.router.navigate(['profile/my-profile/edit-user-img']);
  }

  @HostListener('window:resize')
  checkViewport() {
    const width = window.innerWidth;
    this.is768px = width >= 768 && width < 992; 
  
    if (!this.is768px) {
      this.showSidebar = false;
    }
  }

  toggleSidebar() {
    this.showSidebar = !this.showSidebar;
    console.log("Sidebar toggled. Now showSidebar =", this.showSidebar);
  }

}
