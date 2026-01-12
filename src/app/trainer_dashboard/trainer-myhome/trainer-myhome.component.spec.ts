import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainerMyhomeComponent } from './trainer-myhome.component';

describe('TrainerMyhomeComponent', () => {
  let component: TrainerMyhomeComponent;
  let fixture: ComponentFixture<TrainerMyhomeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TrainerMyhomeComponent]
    });
    fixture = TestBed.createComponent(TrainerMyhomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
