import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MenuDetailViewDialogComponent } from './menu-detail-view-dialog.component';

describe('MenuDetailViewDialogComponent', () => {
  let component: MenuDetailViewDialogComponent;
  let fixture: ComponentFixture<MenuDetailViewDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MenuDetailViewDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MenuDetailViewDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
