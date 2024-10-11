import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { BasicMenuItem, MenuItem, MenuItemsResponse } from 'src/app/menu-item/models/menu-item.model';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import { SharedModule } from 'src/app/shared/shared.module';
import { DevicesService } from '../../services/devices.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuListCommonComponent } from 'src/app/menu-item/components/menu-list-common/menu-list-common.component';

@Component({
  selector: 'app-assign-item',
  standalone: true,
  imports: [
    CommonModule,
    TranslateModule,
    SharedModule,
    MenuListCommonComponent,
  ],
  providers: [
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './assign-item.component.html',
  styleUrl: './assign-item.component.scss',
})
export class AssignItemComponent extends SubscriptionBase {
  displayedColumns: string[] = ['select', 'name', 'displayName', 'status'];

  public menuItems?: BasicMenuItem[];

  public availableMenuItems?: BasicMenuItem[];

  public filterValue?: string;

  public loader?: boolean;

  private debounceTimer: any;

  public seletedItems?: string[];

  public allMenuItems?: MenuItem[];

  constructor(
    @Inject(MAT_DIALOG_DATA) public deviceId: string,
    private readonly deviceService: DevicesService,
    private readonly menuService: MenuItemService,
    private readonly snackBar: MatSnackBar,
    private translate: TranslateService,
    private mataDialog_Ref: MatDialogRef<AssignItemComponent>,
    private readonly menuItemService: MenuItemService,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.deviceId) {
      this.getMenuItems(this.deviceId);
    }
  }

  public applyFilter(event: Event) {
    this.filterValue = (event.target as HTMLInputElement).value.trim();
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      if (this.filterValue) {
        this.getMenuItems(this.deviceId);
      } else {
        this.getAllMenuItems();
      }
    }, 700);
  }

  private getAllMenuItems(): void {
    this.loader = true;
    this.dataSubs.push(
      this.menuItemService
        .getMenuItems()
        .subscribe((menuItems: MenuItemsResponse) => {
          if (menuItems?.success && menuItems?.data) {
            this.allMenuItems =  menuItems.data?.filter(
              (value) =>
                !this.menuItems?.some(
                  (filterValue) => filterValue.id === value.id,
                ),
            );
            if (this.filterValue)
              this.getAvailableMenuItems(this.filterValue);
          } else {
            //TODO ERROR heading
            this.snackBar.open(
              this.translate.instant('GLOBAL.ERROR'),
              this.translate.instant('GLOBAL.OK'),
              {
                duration: 5000,
              },
            );
          } 
          if (!this.filterValue)
            this.loader = false;
        }),
    );
  }

  public getMenuItems(id: string) {
    this.loader = true;

    this.dataSubs.push(
      this.deviceService.getAssignedMenuItems(id).subscribe({
        next: (res) => {
          if (res.success && res.menuItems?.menuItems) {
            this.menuItems = res.menuItems.menuItems;
          } else {
            //Error handling
            this.showSnackbarMessage();
          }
          this.getAllMenuItems();
        },
        error(e) {
          console.log(e);
        },
      }),
    );
  }

  public getAvailableMenuItems(keyword?: string) {
    this.dataSubs.push(
      this.menuService.getMenuItemsBykeyWard(keyword).subscribe({
        next: (res) => {
          if (res.success) {
            this.availableMenuItems = res.data?.filter(
              (value) =>
                !this.menuItems?.some(
                  (filterValue) => filterValue.id === value.id,
                ),
            );
          } else {
            //Error handling
            if (res.message === 'error_menu_items_not_found') {
              this.availableMenuItems = [];
            } else {
              this.snackBar.open(
                this.translate.instant('GLOBAL.ERROR'),
                this.translate.instant('GLOBAL.OK'),
                {
                  duration: 5000,
                },
              );
            }
          } 
          this.loader = false;
        },
        error(e) {
          console.log(e);
        },
      }),
    );
  }

  public assignItems() {
    this.loader = true;
    if (this.deviceId && this.seletedItems) {
      this.dataSubs.push(
        this.menuService
          .assignItems(this.seletedItems, this.deviceId)
          .subscribe((response) => {
            if (response.success) {
              this.mataDialog_Ref.close(true);
              this.snackBar.open(
                // this.translate.instant('DEVICE.DEVICE_UNASSIGNE'),
                'Device(s) assigned sucessfully',
                // this.translate.instant('GLOBAL.ok'),
                'Ok',
                { duration: 5000 },
              );
            } else {
              this.mataDialog_Ref.close(false);
              this.showSnackbarMessage();
            }
            this.loader = false;
          }),
      );
    }
  }

  public showSnackbarMessage() {
    this.snackBar.open(
      this.translate.instant('GLOBAL.ERROR'),
      this.translate.instant('GLOBAL.OK'),
      {
        duration: 1000,
      },
    );
  }
}
