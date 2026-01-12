import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarEditTrainerComponent } from './sidebar-edit-trainer.component';

describe('SidebarEditTrainerComponent', () => {
  let component: SidebarEditTrainerComponent;
  let fixture: ComponentFixture<SidebarEditTrainerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarEditTrainerComponent]
    });
    fixture = TestBed.createComponent(SidebarEditTrainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
