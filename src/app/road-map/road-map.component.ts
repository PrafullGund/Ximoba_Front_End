import { Component } from '@angular/core';

@Component({
  selector: 'app-road-map',
  templateUrl: './road-map.component.html',
  styleUrls: ['./road-map.component.css']
})
export class RoadMapComponent {

  roadmapSteps = [
    {
      id: 1,
      title: "Discover & Assess",
      description: [
        "AI-powered career interest & skill assessment",
        "Personalized career recommendations",
        "Industry trends & job market insights"
      ],
    },
    {
      id: 2,
      title: "Learn & Upskill",
      description: [
        "Curated online courses",
        "Certifications & skill validation",
        "Mentorship & expert guidance"
      ],

    },
    {
      id: 3,
      title: "Gain Experience",
      description: [
        "Live projects & internships",
        "Hackathons & industry collaborations",
        "Freelance & gig work opportunities"
      ],
    },
    {
      id: 4,
      title: "Build Your Profile",
      description: [
        "Resume & LinkedIn optimization",
        "Portfolio development",
        "Mock interviews & career coaching"
      ],
    }
  ];
}
