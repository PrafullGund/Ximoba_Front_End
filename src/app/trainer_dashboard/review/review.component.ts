import { Component, OnInit } from '@angular/core';
import { DashboardService } from 'src/app/common_service/dashboard.service';
import { TrainerService } from 'src/app/common_service/trainer.service';

@Component({
  selector: 'app-review',
  templateUrl: './review.component.html',
  styleUrls: ['./review.component.css']
})
export class ReviewComponent implements OnInit {

  starsArray = Array(5).fill(0);
  id: any;
  p: number = 1;
  showReview:any;

  constructor(private trainerService:TrainerService){}

  convertToMonthsAndDays(days: number): string {
    if (!days) return "N/A";
    const months = Math.floor(days / 30);
    const remainingDays = days % 30;
    return remainingDays > 0 ? `${months} months, ${remainingDays} days` : `${months} months`;
  }

  ngOnInit(): void {
    this.trainerService.getReviewByTrainerId().subscribe(data => {
      this.showReview = data?.reviews;
    });
  }
  markallread(){
   this.trainerService.markallseen().subscribe(data=>{
   })
  }

  markreadid(){
    this.trainerService.markseenid().subscribe(data=>{
    })
   }
}
