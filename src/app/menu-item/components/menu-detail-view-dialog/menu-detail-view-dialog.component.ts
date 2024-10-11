import { Component } from '@angular/core';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuViewComponent } from '../menu-view/menu-view.component';
import { MenuItem } from '../../models/menu-item.model';
import { MenuStatus } from '../../models/menu-constant';

@Component({
  selector: 'app-menu-detail-view-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MenuViewComponent],
  templateUrl: './menu-detail-view-dialog.component.html',
  styleUrl: './menu-detail-view-dialog.component.scss',
})
export class MenuDetailViewDialogComponent extends SubscriptionBase {
  public menuDetails?: MenuItem;

  public menuId?: string;

  public loader?:true;

  public menuStatus = MenuStatus;

  constructor(
    private readonly activateRoute: ActivatedRoute,
    private readonly route: Router,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataSubs.push(this.activateRoute.params.subscribe((params)=>{
      this.menuId = params.id;
    }));
  }

  public redirectTermList(): void {
    this.route.navigate(['menu-items']);
  }
}
