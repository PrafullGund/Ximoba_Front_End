import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShareExpertiseComponent } from './share-expertise.component';

describe('ShareExpertiseComponent', () => {
  let component: ShareExpertiseComponent;
  let fixture: ComponentFixture<ShareExpertiseComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ShareExpertiseComponent]
    });
    fixture = TestBed.createComponent(ShareExpertiseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
