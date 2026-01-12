import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseenrollComponent } from './courseenroll.component';

describe('CourseenrollComponent', () => {
  let component: CourseenrollComponent;
  let fixture: ComponentFixture<CourseenrollComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseenrollComponent]
    });
    fixture = TestBed.createComponent(CourseenrollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
