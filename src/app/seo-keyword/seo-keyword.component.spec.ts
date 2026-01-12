import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SEOKeywordComponent } from './seo-keyword.component';

describe('SEOKeywordComponent', () => {
  let component: SEOKeywordComponent;
  let fixture: ComponentFixture<SEOKeywordComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SEOKeywordComponent]
    });
    fixture = TestBed.createComponent(SEOKeywordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
