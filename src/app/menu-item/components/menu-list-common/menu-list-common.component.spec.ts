import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuListCommonComponent } from './menu-list-common.component';

describe('MenuListCommonComponent', () => {
  let component: MenuListCommonComponent;
  let fixture: ComponentFixture<MenuListCommonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuListCommonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MenuListCommonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
