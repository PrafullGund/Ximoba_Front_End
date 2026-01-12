import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewPublicProfileComponent } from './view-public-profile.component';

describe('ViewPublicProfileComponent', () => {
  let component: ViewPublicProfileComponent;
  let fixture: ComponentFixture<ViewPublicProfileComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ViewPublicProfileComponent]
    });
    fixture = TestBed.createComponent(ViewPublicProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
