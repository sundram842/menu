import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMenuPopupComponent } from './create-menu-popup.component';

describe('CreateMenuPopupComponent', () => {
  let component: CreateMenuPopupComponent;
  let fixture: ComponentFixture<CreateMenuPopupComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMenuPopupComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CreateMenuPopupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
