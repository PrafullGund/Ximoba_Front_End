import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../common_service/dashboard.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ForumAddPageComponent } from '../forum-add-page/forum-add-page.component';
import { ForumDetailsComponent } from '../forum-details/forum-details.component';
import Swal from 'sweetalert2';
import { ModalServiceService } from '../common_service/modal-service.service';

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.css']
})

export class ForumComponent implements OnInit {
  replyDataMap: { [key: string]: any[] } = {};
  selectedCategories: any[] = [];
  ShowForumdata: any[] = [];
  replydata: any[] = [];
  showEmojiPicker = false;
  message = '';
  Showcategorydata: any[] = [];
  activeCategoryIndex: number = 0;
  messageInput: any;
  forumMessages: { [key: string]: string } = {};
  activeForumId: number | null = null;
  UserImage: string | null = null;
  expandedReplies: { [key: string]: boolean } = {};
  replyInputForumId: string | null = null;
  likeCount: number = 0;
  sharecount: number = 0;
  constructor(
    private dashboardService: DashboardService,
    private sanitizer: DomSanitizer,
    private dialog: MatDialog,
    private modalService: ModalServiceService
  ) { }

  ngOnInit(): void {
    this.UserImage = sessionStorage.getItem("Profile");
    this.getcategories()
    this.getAllForum();
    this.dashboardService.getAllForum().subscribe(result => {
      this.ShowForumdata = result?.data.map((forum: any) => ({
        ...forum,
        sanitizedDescription: this.sanitizer.bypassSecurityTrustHtml(forum.description)
      }));
    });
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }

  addEmoji(event: any) {
    console.log(this.message)
    const { message } = this;
    console.log(message);
    console.log(`${event.emoji.native}`)
    const text = `${message}${event.emoji.native}`;
    this.message = text;

    if (this.activeForumId) {
      this.forumMessages[this.activeForumId] =
        (this.forumMessages[this.activeForumId] || '') + event.emoji.native;
    }
  }

  onFocus() {
    this.showEmojiPicker = false;
  }

  onBlur() {
    console.log('Input blurred');
  }

  toggleReplyBox(comment: any) {
    comment.showReplyBox = !comment.showReplyBox;
  }

  toggleCategory(category: any) {
    this.selectedCategories = [];
    const index = this.selectedCategories.findIndex(c => c._id === category._id);
    if (index > -1) {
      this.selectedCategories.splice(index, 1);
    } else {
      this.selectedCategories.push(category);
    }
  }

  getcategories() {
    this.dashboardService.getAllCategory().subscribe(data => {
      this.Showcategorydata = data;
    });
  }

  activateTextarea(forum: any) {
    const token = sessionStorage.getItem('Authorization');
    if (token) {
      this.activeForumId = this.activeForumId === forum ? null : forum;
    } else {
      sessionStorage.setItem('forum._id', forum._id);
      Swal.fire({
        title: 'Login Now!',
        text: 'Sign in Now to Join Our Community Forum!',
        showConfirmButton: true,
        confirmButtonText: 'Login'
      }).then((result) => {
        if (result.isConfirmed) {
          this.modalService.openModal();
        }
      });
    }
  }

  getAllForum() {
    this.dashboardService.getAllForum().subscribe(result => {
      this.ShowForumdata = result?.data
    });
  }

  AddReply(forum: any) {

    if (!this.message) return;
    let messagedata = this.message.trim();
    this.dashboardService.addReply(forum, { replyContent: messagedata }).subscribe(() => {
      Swal.fire("Reply Added Successfully..! ");
      this.message = '';
      this.activeForumId = null;
      this.getAllForum();
    },
      error => {
        Swal.fire("Reply Not  Added please try once..! ", error)
      }
    );
  }

  likepost(id: any, data: any) {
    this.dashboardService.likeanddislike(id, { action: data }).subscribe(result => {
      this.getAllForum();
    });
  }

  likepostforReply(id: any, data: any) {
    this.dashboardService.likeanddislikeforReply(id, { action: data }).subscribe(result => {
      const parsedResponse = JSON.parse(result);
      this.likeCount = parsedResponse.data?.likes
    });
  }

  replyData(forumId: number) {
    if (this.activeForumId === forumId) {
      this.activeForumId = null;
    } else {
      this.activeForumId = forumId;
      this.dashboardService.getForumReplyById(forumId.toString()).subscribe((result: any) => {
        this.replyDataMap[forumId] = result?.replies || [];
      });
    }
  }

  toggleReplies(forumId: string) {
    this.expandedReplies[forumId] = !this.expandedReplies[forumId];
  }

  getReplies(forumId: number) {
    return this.replyDataMap[forumId] || [];
  }

  showReplyInput(forumId: string) {
    this.replyInputForumId = forumId;
    this.activeForumId = null;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(ForumAddPageComponent, {
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  openDialogDetail(forumid: any) {
    const dialogRef = this.dialog.open(ForumDetailsComponent, {
      data: { id: forumid }
    });

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  shareOnWhatsApp(forum: any) {
    const postUrl = encodeURIComponent(window.location.href);
    const postText = encodeURIComponent(`Check out this forum post: ${forum.description}`);

    this.sharecountforum(forum._id);
    // Construct WhatsApp Share URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${postText} ${postUrl}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }

  shareOnWhatsAppreply(reply: any) {
    const postUrl = encodeURIComponent(window.location.href);
    const postText = encodeURIComponent(`Check out this forum post: ${reply.content}`);

    this.sharecountforumreply(reply._id);
    // Construct WhatsApp Share URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${postText} ${postUrl}`;

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, '_blank');
  }

  sharecountforum(id: any) {
    return this.dashboardService.shareforumcount(id).subscribe(result => {
      this.getAllForum();
    });
  }

  sharecountforumreply(id: any) {
    return this.dashboardService.shareforumreplycount(id).subscribe(result => {
      this.getReplies(id);
    });
  }
}
