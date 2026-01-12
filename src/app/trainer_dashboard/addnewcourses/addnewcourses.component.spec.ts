import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewcoursesComponent } from './addnewcourses.component';

describe('AddnewcoursesComponent', () => {
  let component: AddnewcoursesComponent;
  let fixture: ComponentFixture<AddnewcoursesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddnewcoursesComponent]
    });
    fixture = TestBed.createComponent(AddnewcoursesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
