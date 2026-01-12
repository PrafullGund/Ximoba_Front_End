import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';

@Component({
  selector: 'app-trainer-home',
  templateUrl: './trainer-home.component.html',
  styleUrls: ['./trainer-home.component.css']
})
export class TrainerHomeComponent implements OnInit {
  isOffcanvasOpen = false;
  isSidebarCollapsed = false;
  isDarkMode = false;
  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
    console.log("Sidebar collapsed:", this.isSidebarCollapsed);
  }
  toggleOffcanvas() {
    this.isOffcanvasOpen = !this.isOffcanvasOpen;
  }
  isTrainer: boolean = false;
  isUser: boolean = false;
  isAdmin: boolean = false;
  isInstitute: boolean = false;
  isSELF_EXPERT: boolean = false

  constructor(
    private authService: AuthServiceService,
    private route: Router,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.checkUserRole();
    const storedTheme = localStorage.getItem('darkMode');
    this.isDarkMode = storedTheme === 'true';

    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark-theme', this.isDarkMode);
    htmlElement.classList.toggle('light-theme', !this.isDarkMode);
  }

  checkUserRole() {
    const role = this.authService.getUserRole();
    this.isAdmin = role === 'SUPER_ADMIN';
    this.isTrainer = role === 'TRAINER';
    this.isInstitute = role === 'INSTITUTE';
    this.isSELF_EXPERT = role == 'SELF_EXPERT';
    this.isUser = role === 'USER' || role === 'TRAINER' || role === 'SUPER_ADMIN' || role === 'INSTITUTE' || role === 'SELF_EXPERT';
  }

  logout() {
    this.authService.logout();
    this.route.navigate(['/'])
  }

  toggleDarkMode(): void {
    this.isDarkMode = !this.isDarkMode;
    localStorage.setItem('darkMode', this.isDarkMode.toString());
    const htmlElement = document.documentElement;
    htmlElement.classList.toggle('dark-mode', this.isDarkMode);
    htmlElement.classList.toggle('light-theme', !this.isDarkMode);
    this.cdr.detectChanges();
  }

  isCourseRelatedRoute(): boolean {
    const url = this.route.url;
    return (
      url.includes('/dashboard/mycourse') || url.includes('/dashboard/add-course') || url.includes('/dashboard/editcourse')
    );
  }
  
}
