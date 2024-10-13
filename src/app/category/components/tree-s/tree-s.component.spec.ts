import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TreeSComponent } from './tree-s.component';

describe('TreeSComponent', () => {
  let component: TreeSComponent;
  let fixture: ComponentFixture<TreeSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TreeSComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TreeSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
