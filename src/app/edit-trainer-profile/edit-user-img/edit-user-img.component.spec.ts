import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditUserImgComponent } from './edit-user-img.component';

describe('EditUserImgComponent', () => {
  let component: EditUserImgComponent;
  let fixture: ComponentFixture<EditUserImgComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditUserImgComponent]
    });
    fixture = TestBed.createComponent(EditUserImgComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
