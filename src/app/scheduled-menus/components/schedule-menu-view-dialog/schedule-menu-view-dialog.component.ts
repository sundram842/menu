import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.module';
import { MenuDetaisComponent } from '../menu-details/menu-detais.component';
import { MenuItem } from 'src/app/menu-item/models/menu-item.model';
import { MenuListCommonComponent } from '../../../menu-item/components/menu-list-common/menu-list-common.component';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { ScheduleDetailMenu } from '../../models/schedule.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { CustomQuantityComponent } from '../custom-quantity/custom-quantity.component';
import { MenuItemsResponse, ScheduleMenuService } from '../../services/schedule-menu.service';
import { URL_CONSTANTS_TOKEN, urlConstants } from 'src/app/constants/urlConstants';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { CommonService } from 'src/app/shared/commonService/common-service.service';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import { UpdateMenuBody } from '../../models/schedule.constant';

@Component({
  selector: 'app-schedule-menu-view-dialog',
  standalone: true,
  imports: [CommonModule, SharedModule, MenuDetaisComponent, MenuListCommonComponent],
  providers: [
    ScheduleMenuService,
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './schedule-menu-view-dialog.component.html',
  styleUrl: './schedule-menu-view-dialog.component.scss',
})
export class ScheduleMenuViewDialogComponent extends SubscriptionBase {

  public scheduleDetails!: ScheduleDetailMenu;

  public menuItems?: MenuItem[];

  public scheduleItemId?: string;

  public selectionTabChange = 0;

  public loader?: boolean;

  public selectedItems?:{ id: string; quantity: number }[];

  displayedColumns = [
    'select',
    'skuId',
    'name',
    'count',
  ];

  constructor(private route: Router,
    private dialog: MatDialog,
    private readonly activatedRoute: ActivatedRoute,
    private readonly snackbar: MatSnackBar,
    private readonly scheduleService: ScheduleMenuService,
    private commonService: CommonService,
    private readonly menuItemService: MenuItemService,
  ) {
    super();
    this.setPageTitle();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe((params)=>{
      this.scheduleItemId = params.id;
    });
  }

  public customInventoryStock() {
    const dialog = this.dialog.open(CustomQuantityComponent, {
      width: '500px',
      panelClass: ['custommodal', 'customInventoryStockPopup'],
      disableClose: true,
    });
    this.dataSubs.push(dialog.afterClosed().subscribe(response => {
      if (response) {
        
      }
    }));
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (this.scheduleItemId && event.index === 1 && !this.menuItems?.length) {
      this.getMenuItems(this.scheduleItemId);
    }
  }

  public menuUpdate(event:boolean) {
    if (event) this.menuItems = [];
  }

  public setPageTitle(): void {
    let title = 'Schedule Menu';
    this.commonService.updateHeader({ title: title });
  }

  private getMenuItems(id: string): void {
    this.loader = true;
    this.dataSubs.push(
      this.scheduleService
        .getScheduledMenuDetails(id)
        .subscribe((menuItems: MenuItemsResponse) => {
          if (menuItems?.success && menuItems?.data) {
            this.menuItems = menuItems.data;
          } else {
            //TODO ERROR heading
            this.snackBarFunction('Oops something went wrong...!', 'ok');
          }
          this.loader = false;
        }),
    );
  }

  public updateMenu() {
    this.loader = true;
    if (this.selectedItems) {
      const updateData = {
        name : this.scheduleDetails?.name,
        date: this.scheduleDetails?.date,
      };
      const data = UpdateMenuBody.BindForm(updateData, this.selectedItems);
      this.dataSubs.push(this.menuItemService.updateScheduleMenu(this.scheduleDetails?.id, data).subscribe(response =>{
        if (response.success) {
          this.getMenuItems(this.scheduleDetails?.id);
          this.snackbar.open('Items(s) unassigned successfully', 'ok', {
            duration: 5000,
          });
        } else {
          //TODO ERROR heading
          this.snackbar.open('Oops something went wrong...!', 'ok', {
            duration: 5000,
          });
          this.loader = false;
        } 
      }));
    }
  }

  public handelItems(event : any) {
    this.selectedItems = [...event];
  }
 
  private snackBarFunction(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
    });
  }

  public redirectTermList(): void {
    this.route.navigate(['schedule-menus']);
  } 

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
