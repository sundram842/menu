import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDetaisComponent } from './menu-detais.component';

describe('MenuDetaisComponent', () => {
  let component: MenuDetaisComponent;
  let fixture: ComponentFixture<MenuDetaisComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDetaisComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDetaisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
