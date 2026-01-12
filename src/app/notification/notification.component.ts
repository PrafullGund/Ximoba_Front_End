import { Component, OnInit } from '@angular/core';
import { LoginService } from '../common_service/login.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  Shownotification: any[] = [];  
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 7;
  p: number = 1;
  isUnread: boolean = false; 

  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    this.loadNotifications(this.currentPage, this.itemsPerPage);
  }

 
  loadNotifications(page: number, limit: number) {
    this.isUnread = false; 
    this.currentPage = 1;
    this.loginService.getNotifications(page, limit).subscribe(result => {
      this.Shownotification = result.notifications;
      this.totalItems = result.pagination.totalItems; 
    });
  }

  showUnreadNotifications() {
    this.isUnread = true;  
    this.currentPage = 1; 
    this.fetchAllUnreadNotifications(this.currentPage, this.itemsPerPage); 
  }

  fetchAllUnreadNotifications(page: number, limit: number) {
    this.loginService. showUnseenNotifications(page, limit).subscribe(result => {
      if (result.notifications.length > 0) {
        this.Shownotification = result.notifications;  
        this.totalItems = result.pagination.totalItems; 
        this.p = page;
      }
    });
  }

  markNotificationAsSeen(notificationId: string) {
    const notification = this.Shownotification.find(n => n._id === notificationId);
    if (notification) {
      this.loginService.updateNotificationStatus(notificationId).subscribe(() => {
        notification.isSeen = true; // Update the status locally
        if (this.isUnread) {
          this.fetchAllUnreadNotifications(this.currentPage, this.itemsPerPage); // Refresh unread notifications
        }
      });
    }
  }

  onPageChange(page: number): void {
    this.currentPage=page;
    this.loadNotifications(this.currentPage,this.itemsPerPage);
    this.p=page;
  } 
 
}
