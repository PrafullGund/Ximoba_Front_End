
import { Component, AfterViewInit } from '@angular/core';
import { gsap } from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(MotionPathPlugin);

@Component({
  selector: 'app-arrowanimation',
  templateUrl: './arrowanimation.component.html',
  styleUrls: ['./arrowanimation.component.css']
})
export class ArrowanimationComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    gsap.registerPlugin(MotionPathPlugin);

    gsap.set("#arrow-group", { transformOrigin: "50% 50%" });

    const timeline = gsap.timeline({ repeat: -1, repeatDelay: 1 });

    timeline.to("#line", {
      duration: 4,
      strokeDashoffset: 0,
      ease: "none"
    });

    timeline.to("#arrow-group", {
      duration: 4,
      motionPath: {
        path: "#line",
        align: "#line",
        autoRotate: true,
        alignOrigin: [0.5, 0.5]
      },
      ease: "none"
    }, 0);
  }
}
