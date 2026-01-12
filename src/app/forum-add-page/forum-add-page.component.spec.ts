import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ForumAddPageComponent } from './forum-add-page.component';

describe('ForumAddPageComponent', () => {
  let component: ForumAddPageComponent;
  let fixture: ComponentFixture<ForumAddPageComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ForumAddPageComponent]
    });
    fixture = TestBed.createComponent(ForumAddPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
