import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LinkedinAuthCallbackComponent } from './linkedin-auth-callback.component';

describe('LinkedinAuthCallbackComponent', () => {
  let component: LinkedinAuthCallbackComponent;
  let fixture: ComponentFixture<LinkedinAuthCallbackComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LinkedinAuthCallbackComponent]
    });
    fixture = TestBed.createComponent(LinkedinAuthCallbackComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
