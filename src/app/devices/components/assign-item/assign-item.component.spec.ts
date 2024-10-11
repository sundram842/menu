import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignItemComponent } from './assign-item.component';

describe('AssignItemComponent', () => {
  let component: AssignItemComponent;
  let fixture: ComponentFixture<AssignItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AssignItemComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AssignItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
