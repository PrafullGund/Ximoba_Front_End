import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditProfilePictureComponent } from './edit-profile-picture.component';

describe('EditProfilePictureComponent', () => {
  let component: EditProfilePictureComponent;
  let fixture: ComponentFixture<EditProfilePictureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditProfilePictureComponent]
    });
    fixture = TestBed.createComponent(EditProfilePictureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
