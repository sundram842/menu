import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevicesViewDialogComponent } from './devices-view-dialog.component';

describe('DevicesViewDialogComponent', () => {
  let component: DevicesViewDialogComponent;
  let fixture: ComponentFixture<DevicesViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DevicesViewDialogComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(DevicesViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
