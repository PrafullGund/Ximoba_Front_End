import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-faq',
  templateUrl: './faq.component.html',
  styleUrls: ['./faq.component.css'],
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
        animate('3s ease-out', style({ transform: 'translateX(0)' }))
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
export class FAQComponent  {
 
}
