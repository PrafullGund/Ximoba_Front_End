import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UsersideProductComponent } from './userside-product.component';

describe('UsersideProductComponent', () => {
  let component: UsersideProductComponent;
  let fixture: ComponentFixture<UsersideProductComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UsersideProductComponent]
    });
    fixture = TestBed.createComponent(UsersideProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
