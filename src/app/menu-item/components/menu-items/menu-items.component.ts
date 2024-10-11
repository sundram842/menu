import { CommonModule } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuListCommonComponent } from '../menu-list-common/menu-list-common.component';
import { MenuItemService } from '../../services/menu-item.service';
import {
  BasicMenuItemsAdapter,
  MenuItem,
  MenuItemsResponse,
} from '../../models/menu-item.model';
import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import { TranslateService } from '@ngx-translate/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { CommonService } from 'src/app/shared/commonService/common-service.service';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [CommonModule, SharedModule, MenuListCommonComponent],
  providers: [
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
    BasicMenuItemsAdapter,
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss',
})
export class MenuItemsComponent extends SubscriptionBase implements OnInit {
  public loader?: boolean;

  constructor(
    private readonly menuItemService: MenuItemService,
    private translate: TranslateService,
    private readonly snackBar: MatSnackBar,
    @Inject(CommonService) private commonService: CommonService,
  ) {
    super();
    this.setPageTitle();
  }

  public menuItems?: MenuItem[];

  ngOnInit(): void {
    this.getMenuItems();
  }

  public setPageTitle(): void {
    let title = 'Menu Items';
    this.commonService.updateHeader({ title: title });
  }


  private getMenuItems(): void {
    this.loader = true;
    this.dataSubs.push(
      this.menuItemService
        .getMenuItems()
        .subscribe((menuItems: MenuItemsResponse) => {
          if (menuItems?.success && menuItems?.data) {
            this.menuItems = menuItems.data;
          } else {
            //TODO ERROR heading
            // if (menuItems.message === 'error_menu_items_not_found') {
            this.menuItems = [];
            // } else {
            //   this.snackBar.open(
            //     this.translate.instant('GLOBAL.ERROR'),
            //     this.translate.instant('GLOBAL.OK'),
            //     {
            //       duration: 5000,
            //     },
            //   );
            // }
          }
          this.loader = false;
        }),
    );
  }

  public menuDetails(event: boolean) {
    if (event) this.getMenuItems();
  }
}
