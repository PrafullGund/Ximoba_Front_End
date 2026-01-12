import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTrainerForumComponent } from './add-trainer-forum.component';

describe('AddTrainerForumComponent', () => {
  let component: AddTrainerForumComponent;
  let fixture: ComponentFixture<AddTrainerForumComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AddTrainerForumComponent]
    });
    fixture = TestBed.createComponent(AddTrainerForumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
