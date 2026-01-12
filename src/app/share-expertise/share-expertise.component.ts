import { Component } from '@angular/core';

@Component({
  selector: 'app-share-expertise',
  templateUrl: './share-expertise.component.html',
  styleUrls: ['./share-expertise.component.css']
})
export class ShareExpertiseComponent {
  topics: string[] = [
    "Educational insights and career path guidance",
    "Course recommendations and learning strategies",
    "Industry trends and professional development tips",
    "Case studies, best practices, and practical knowledge",
    "Interactive workshops and expert-led discussions"
  ];

  selectedTopic: number = 2; 

  selectTopic(index: number) {
    this.selectedTopic = index;
  }
  currentStep = 0;

  steps = [
    { title: 'Sign Up', description: 'Create your expert profile on Ximboa.', icon: 'rocket_launch' },
    { title: 'Submit Content', description: 'Share articles, video lessons, or structured courses.', icon: 'check_circle' },
    { title: 'Engage', description: 'Interact with learners, answer questions, and provide mentorship.', icon: 'groups' },
    { title: 'Grow Your Influence', description: 'Gain recognition and unlock new opportunities.', icon: 'trending_up' },
    { title: 'Join Ximboa', description: 'Join Ximboa today and make a lasting impact on global education!', icon: 'school' }
  ];


}