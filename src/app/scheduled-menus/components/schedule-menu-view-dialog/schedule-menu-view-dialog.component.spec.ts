import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleMenuViewDialogComponent } from './schedule-menu-view-dialog.component';

describe('ScheduleMenuViewDialogComponent', () => {
  let component: ScheduleMenuViewDialogComponent;
  let fixture: ComponentFixture<ScheduleMenuViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ScheduleMenuViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ScheduleMenuViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
