import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CustomQuantityComponent } from './custom-quantity.component';

describe('CustomQuantityComponent', () => {
  let component: CustomQuantityComponent;
  let fixture: ComponentFixture<CustomQuantityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomQuantityComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CustomQuantityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
