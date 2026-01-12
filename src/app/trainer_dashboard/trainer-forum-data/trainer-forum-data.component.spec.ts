import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerForumDataComponent } from './trainer-forum-data.component';

describe('TrainerForumDataComponent', () => {
  let component: TrainerForumDataComponent;
  let fixture: ComponentFixture<TrainerForumDataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerForumDataComponent]
    });
    fixture = TestBed.createComponent(TrainerForumDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
