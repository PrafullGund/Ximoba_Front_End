import { Component, OnInit } from '@angular/core';
import { AuthServiceService } from 'src/app/common_service/auth-service.service';
import { TrainerService } from 'src/app/common_service/trainer.service';
import Swal from 'sweetalert2';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {

  ShowQuestion: any[] = [];
  unreadQuestions: any[] = [];
  ShowQuestionreplies: any[] = [];
  isUnread: boolean = false;

  p: number = 1;
  totalItems = 0;
  currentPage = 1;
  itemsPerPage = 5;
  loginUserId: any
  loginuserName: string = '';
  selectedQuestionId: string | null = null;
  allSelected = false;
  constructor(
    private trainerService: TrainerService,
    private authService: AuthServiceService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.loginuserName = this.authService.username() ?? '';
    this.loginUserId = this.authService.getUserId();
    this.loadAllQuestion(this.currentPage, this.itemsPerPage);
    this.addEventListeners();
    this.cdr.detectChanges();
  }

  loadAllQuestion(page: number, limit: number) {
    this.isUnread = false;
    this.trainerService.getQuestion(page, limit).subscribe(data => {
      this.ShowQuestion = data.data;
      this.totalItems = data.pagination.totalItems;
      this.p = page;
    })
  }
  ngAfterViewInit() {
    this.ShowQuestion.forEach(question => {
      if (!question.isSeen) {
        this.markSeenById(question.id);
      }
    });
  }

  toggleAllSelection() {
    this.allSelected = !this.allSelected;
    this.ShowQuestion.forEach(question => question.isSelected = this.allSelected);
  }

  toggleDetails(question: any) {
    question.showDetails = !question.showDetails;
    this.selectedQuestionId = this.selectedQuestionId === question._id ? null : question._id;
  }

  toggleReply(question: any) {
    question.showReplyBox = !question.showReplyBox;
  }
  onDelete(id: string): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to delete this Question? This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!', cancelButtonText: 'No, keep it'
    }).then((result) => {
      if (result.isConfirmed) {
        this.trainerService.deleteQuestion(id).subscribe(
          response => {
            Swal.fire('Deleted!', 'The Question has been deleted successfully.', 'success');
            this.loadAllQuestion(this.currentPage, this.itemsPerPage);
          },
          error => {
            Swal.fire('Error!', 'An error occurred while deleting the Question.', 'error');
          }
        );
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire('Cancelled', 'The Question is safe :)', 'info');
      }
    });
  }

  fetchAllUnreadquestions(page: number, limit: number) {
    this.trainerService.getallunreadquestions(page, limit).subscribe(result => {
      if (result.notifications.length > 0) {
        this.ShowQuestion = result.notifications;
        this.totalItems = result.pagination.totalItems;
        this.p = page;
      }
    });
  }

  getQuestionsCount(): number {
    return this.ShowQuestion.filter(question =>
      question._id && question._id !== undefined && question._id !== null && question._id !== ''
    ).length;
  }

  getUnseenCount(): number {
    return this.ShowQuestion.filter(question =>
      (question._id !== null && question._id !== 0 && question._id !== undefined) && !question.isSeen
    ).length;
  }

  showUnreadquestions() {
    this.isUnread = true;
    this.currentPage = 1;
    this.fetchAllUnreadquestions(this.currentPage, this.itemsPerPage);
  }

  onPageChange(page: number): void {
    this.currentPage = page;
    if (this.isUnread) {
      this.fetchAllUnreadquestions(this.currentPage, this.itemsPerPage);
    } else {
      this.loadAllQuestion(this.currentPage, this.itemsPerPage);
    }
  }

  addEventListeners(): void {
    document.getElementById('allBtn')?.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
        (item as HTMLElement).style.display = 'block';
      });
    });

    document.getElementById('unreadBtn')?.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
        if (item.getAttribute('data-status') === 'unread') {
          (item as HTMLElement).style.display = 'block';
        } else {
          (item as HTMLElement).style.display = 'none';
        }
      });
    });

    document.getElementById('markCompletedBtn')?.addEventListener('click', () => {
      const items = document.querySelectorAll('.item');
      items.forEach(item => {
        item.setAttribute('data-status', 'completed');
        (item as HTMLElement).style.textDecoration = 'line-through';
      });
    });
  }


  sendReply(question: any): void {
    if (!question.replyText.trim()) return;
    const replyData = {
      userid: question.user_id,
      trainerid: this.loginUserId,
      reply: question.replyText
    };
    const payload = {
      questionId: question._id,
      replyData: replyData
    };

    this.trainerService.replyquestions(payload)
      .subscribe(
        response => {
          question.replies = question.replies || [];
          question.showReplyBox = false;
          question.replyText = '';
          this.loadAllQuestion(this.currentPage, this.itemsPerPage);
        },
        error => {
        }
      );
  }

  markAllAsSeen() {
    this.trainerService.markallread().subscribe(
      (response) => {
        this.ShowQuestion.forEach((q: any) => q.isSeen = true);
      },
      (error) => {
        console.error('Error marking all as seen:', error);
      });
  }

  markSeenById(question: any) {
    const questiondata = this.ShowQuestion.find(n => n._id === question._id);
    if (questiondata) {
      this.trainerService.markreadbyId(question._id).subscribe(() => {
        question.isSeen = true;
        if (this.isUnread) {
          this.fetchAllUnreadquestions(this.currentPage, this.itemsPerPage);
        }
      });
    }
  }
}