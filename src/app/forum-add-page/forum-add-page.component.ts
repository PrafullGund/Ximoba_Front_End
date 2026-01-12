import { Component, ViewEncapsulation } from '@angular/core';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { Editor, Toolbar } from 'ngx-editor';
import { DashboardService } from '../common_service/dashboard.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { LoginService } from '../common_service/login.service';
import { AuthServiceService } from '../common_service/auth-service.service';
import { ModalServiceService } from '../common_service/modal-service.service';

interface ForumThread {
  id: number;
  title: string;
  description: string;
  date: string;
  comments: Comment[];
}

interface Comment {
  id: number;
  user: string;
  text: string;
  date: string;
  replies?: Comment[];
}

interface Reply {
  author: string;
  date: string;
  content: string;
  replies?: Reply[];
  showReplyBox?: boolean;
}


@Component({
  selector: 'app-forum-add-page',
  templateUrl: './forum-add-page.component.html',
  styleUrls: ['./forum-add-page.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class ForumAddPageComponent {
  // Forum = {
  //   title: '',
  //   description: ''
  // };
  selectedForum: any = null;
  newMessage: string = '';
  showReplyBox: boolean=false;
  replynewMessage: string = '';
  showEmojiPicker = false;
  constructor(
    private dashboardService: DashboardService,
    private route: Router,
    private modalService: ModalServiceService
  ) { }

  // token = sessionStorage.getItem('Authorization');
  // AddForum(): void {
  //   if (this.token) {
  //     console.log(this.Forum);
  //     this.dashboardService.addForumAnswer(this.Forum).subscribe({
  //       next: (response) => {
  //         Swal.fire('Ohh...!', 'Your question has been sent successfully!', 'success');
  //         this.route.navigate(['/forum']);
  //       },
  //       error: (error) => {
  //         Swal.fire('Error', 'Sorry, something went wrong.', 'error');
  //       }
  //     });
  //   }
  //   else {
  //     this.modalService.openModal();
  //   }
  // }

  // editor!: Editor;
  // toolbar: Toolbar = [
  //   ['bold', 'italic'],
  //   ['underline', 'strike'],
  //   ['code', 'blockquote'],
  //   ['ordered_list', 'bullet_list'],
  //   [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
  //   ['link', 'image'],
  //   ['text_color', 'background_color'],
  //   ['align_left', 'align_center', 'align_right', 'align_justify'],
  // ];

  // form = new FormGroup({
  //   editorContent: new FormControl('', { validators: Validators.required }),
  // });

  // ngOnInit(): void {
  //   this.editor = new Editor();
  // }

  // ngOnDestroy(): void {
  //   this.editor.destroy();
  // }

  forumData = [
    {
      name: 'HTML',
      expanded: true,
      forums: [
        { id: 1, title: 'Forum 1', description: 'What is HTML & CSS and how it works', date: '12 Dec 2024', unreadCount: 12, messages: [] },
        { id: 2, title: 'Forum 2', description: 'CSS Best Practices', date: '12 Jan 2025', unreadCount: 0, messages: [] }
      ]
    },
    {
      name: 'CSS',
      expanded: false,
      forums: [
        { id: 3, title: 'Forum 3', description: 'Advanced CSS Grid', date: '02 Jan 2025', unreadCount: 0, messages: [] }
      ]
    },
    {
      name: 'Web Development',
      expanded: false,
      forums: []
    },
    {
      name: 'Web Applications',
      expanded: false,
      forums: []
    }
  ];
  
  
  selectedForum1 = {
    messages: [
      { sender: 'Tejas Rao', time: '10:00 AM', text: 'Baik bu sya kerjakan nanti malam jam 12 bu.', replies: [] },
      { sender: 'DK Mishra', time: '10:05 AM', text: 'okee', replies: [] }
    ]
  };
  

  
  
  
  toggleCategory(category: any) {
    category.expanded = !category.expanded;
  }
  
  selectForum(forum: any) {
    this.selectedForum = forum;
    this.selectedForum.messages = [
      { id: 101,sender: 'DK Mishra', text: 'What is CSS and how it works?', time: '09:00 AM',
        replies: [
          { id:1,sender: 'DK Mishra', time: '10:05 AM', text: 'testing dummy data display' },
          { id:2,sender: 'DK Mishra', time: '10:05 AM', text: 'okee' }
        ]
       },
      { id:102,sender: 'Tejas Rao', text: 'I will work on it tonight.', time: '09:10 AM' },
      { sender: 'You', text: 'Okay!', time: '09:15 AM' }
    ];
  }
  
  sendMessage() {
    if (this.newMessage.trim() && this.selectedForum) {
      this.selectedForum.messages.push({ sender: 'You', text: this.newMessage, time: 'Now' });
      this.newMessage = '';
    }
  }

  sendMessagereply() {
    if (this.replynewMessage.trim() && this.selectedForum) {
      this.selectedForum.replynewMessage.push({ sender: 'You', text: this.newMessage, time: 'Now' });
      console.log(this.selectedForum.replynewMessage);
      
      this.replynewMessage = '';
    }
  }
  
  selectedFile: File | null = null;
  filePreview: string | null = null;
  onFileSelected(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFile = event.target.files[0];
  
      // Check if the selected file is an image
      if (this.selectedFile && this.selectedFile.type.startsWith('image/')) {
        console.log("Selected File:", this.selectedFile);
  
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.filePreview = e.target.result;
          console.log("File Preview (after reading):", this.filePreview); // Now it has the correct value
        };
        if (this.selectedFile) {
          reader.readAsDataURL(this.selectedFile);
        }
      } else {
        this.filePreview = null; // Reset preview for non-image files
      }
    }
    
  }

  
  
  replyBoxVisibility: { [messageId: number]: boolean } = {};

  toggleReplyBox(messageId: number) {
    this.replyBoxVisibility[messageId] = !this.replyBoxVisibility[messageId];
  }

  toggleEmojiPicker() {
    this.showEmojiPicker = !this.showEmojiPicker;
  }
  onFocus() {
    this.showEmojiPicker = false;
  }


  addEmoji(event: any) {
    console.log(this.newMessage)
    const { newMessage } = this;
    console.log(newMessage);
    console.log(`${event.emoji.native}`)
    const text = `${newMessage}${event.emoji.native}`;

    this.newMessage = text;

    // if (this.activeForumId) {
    //   this.forumMessages[this.activeForumId] =
    //     (this.forumMessages[this.activeForumId] || '') + event.emoji.native;
    // }



  }
}