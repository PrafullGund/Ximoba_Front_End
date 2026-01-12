import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeeallcategoriesComponent } from './seeallcategories.component';

describe('SeeallcategoriesComponent', () => {
  let component: SeeallcategoriesComponent;
  let fixture: ComponentFixture<SeeallcategoriesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SeeallcategoriesComponent]
    });
    fixture = TestBed.createComponent(SeeallcategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
