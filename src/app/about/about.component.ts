import { Component, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css'],
  animations: [
    trigger('slideInLeft', [
      transition(':enter', [
        style({ transform: 'translateX(-100%)' }),
        animate('2s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideInRight', [
      transition(':enter', [
        style({ transform: 'translateX(100%)' }),
        animate('5s ease-out', style({ transform: 'translateX(0)' }))
      ])
    ]),
    trigger('slideUp', [
      transition(':enter', [
        style({ transform: 'translateY(100%)' }),
        animate('5s ease-out', style({ transform: 'translateY(0)' }))
      ])
    ])
  ]
})
export class AboutComponent implements OnInit {
  counterValue: number = 0;

  ngOnInit(): void {
    this.startCounter();
  }

  startCounter() {
    const targetValue = 180;
    const duration = 3000;
    const increment = targetValue / (duration / 100);

    const interval = setInterval(() => {
      this.counterValue += increment;
      if (this.counterValue >= targetValue) {
        this.counterValue = targetValue;
        clearInterval(interval);
      }
    }, 100);
  }
}