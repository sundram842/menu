import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateMenuItemsComponent } from './create-menu-items.component';

describe('CreateMenuItemsComponent', () => {
  let component: CreateMenuItemsComponent;
  let fixture: ComponentFixture<CreateMenuItemsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateMenuItemsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreateMenuItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
