import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterDeviceComponent } from './register-device.component';

describe('RegisterDeviceComponent', () => {
  let component: RegisterDeviceComponent;
  let fixture: ComponentFixture<RegisterDeviceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterDeviceComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterDeviceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
