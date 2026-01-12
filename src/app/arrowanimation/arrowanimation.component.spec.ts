import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArrowanimationComponent } from './arrowanimation.component';

describe('ArrowanimationComponent', () => {
  let component: ArrowanimationComponent;
  let fixture: ComponentFixture<ArrowanimationComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ArrowanimationComponent]
    });
    fixture = TestBed.createComponent(ArrowanimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
