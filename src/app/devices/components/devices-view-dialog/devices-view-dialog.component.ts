import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { BasicDetailsComponent } from '../basic-details/basic-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { MenuListCommonComponent } from '../../../menu-item/components/menu-list-common/menu-list-common.component';
import { Devices } from '../../models/devices-models';
import { DevicesService } from '../../services/devices.service';
import { BasicMenuItem } from 'src/app/menu-item/models/menu-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DeactivateDevice, DeviceStatus } from '../../models/device-constant';
import { MatDialog } from '@angular/material/dialog';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { AssignItemComponent } from '../assign-item/assign-item.component';
import { CommonService } from 'src/app/shared/commonService/common-service.service';
@Component({
  selector: 'app-devices-view-dialog',
  standalone: true,
  imports: [
    SharedModule,
    CommonModule,
    TranslateModule,
    BasicDetailsComponent,
    MenuListCommonComponent,
  ],
  providers: [
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './devices-view-dialog.component.html',
  styleUrl: './devices-view-dialog.component.scss',
})
export class DeviceViewDialogComponent extends SubscriptionBase {
  public deviceId?: string;

  public loader?: boolean;

  public deviceDetails?: Devices;

  public menuItems?: BasicMenuItem[];

  public seletedItems?: string[];

  displayedColumns: string[] = ['select', 'name', 'displayName', 'status'];

  public deviceStatus = DeviceStatus;

  public selectionTabChange = 0;

  constructor(
    private readonly activatedRoute: ActivatedRoute,
    private route: Router,
    private readonly deviceService: DevicesService,
    private readonly snackbar: MatSnackBar,
    private readonly translate: TranslateService,
    private dialog: MatDialog,
    private readonly menuService: MenuItemService,
    @Inject(CommonService) private commonService: CommonService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.dataSubs.push(
      this.activatedRoute.params.subscribe((params) => {
        const value = params;
        this.deviceId = value.id;
      }),
    );
  }

  onTabChange(event: MatTabChangeEvent): void {
    if (this.deviceId && event.index === 1 && !this.menuItems?.length) {
      this.getMenuItems(this.deviceId);
    }
  }

  public setPageTitle(): void {
    let title = 'Devices';
    this.commonService.updateHeader({ title: title });
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
          this.loader = false;
        },
        error(e) {
          console.log(e);
        },
      }),
    );
  }

  public getSelection(event : string[]) {
    this.seletedItems = event;
  }

  public unassignItems() {
    this.loader = true;
    if (this.deviceId && this.seletedItems) {
      this.dataSubs.push(
        this.menuService
          .unassignItems(this.seletedItems, this.deviceId)
          .subscribe((response) => {
            if (response.success) {
              if (this.deviceId)
                this.getMenuItems(this.deviceId);
              this.snackbar.open(
                // this.translate.instant('DEVICE.DEVICE_UNASSIGNE'),
                'Device unassigned successfully',
                'ok',
                // this.translate.instant('GLOBAL.ok'),
                { duration: 5000 },
              );
            } else {
              this.showSnackbarMessage();
            }
            this.loader = false;
          }),
      );
    }
  }

  public activateDevice() {
    this.loader = true;
    if (this.deviceId) {
      this.dataSubs.push(
        this.deviceService
          .activateDevice(this.deviceId)
          .subscribe((response) => {
            if (response.success) {
              this.deviceService.triggerDialogClosed();
              this.snackbar.open(
                // this.translate.instant('DEVICE.DEVICE_ACTIVATED'),
                'Device activated successfully',
                'ok',
                // this.translate.instant('GLOBAL.OK'),
                { duration: 5000 },
              );
            } else {
              this.showSnackbarMessage();
            }
            this.loader = false;
          }),
      );
    }
  }

  public deactivateDevice() {
    this.loader = true;
    if (
      this.deviceDetails?.ipAddress &&
      this.deviceDetails?.macAddress &&
      this.deviceDetails?.name &&
      this.deviceId
    ) {
      const data = DeactivateDevice.BindForm(
        this.deviceDetails?.ipAddress,
        this.deviceDetails?.macAddress,
        this.deviceDetails?.name,
      );
      this.dataSubs.push(
        this.deviceService
          .deactivateDevice(data, this.deviceId)
          .subscribe((response) => {
            if (response.success) {
              this.deviceService.triggerDialogClosed();
              this.snackbar.open(
                // this.translate.instant('DEVICE.DEVICE_DEACTIVATED'),
                'Device deactivated successfully',
                'ok',
                // this.translate.instant('GLOBAL.OK'),
                { duration: 5000 },
              );
            } else {
              this.showSnackbarMessage();
            }
            this.loader = false;
          }),
      );
    }
  }

  public assignItem() {
    this.dialog.open(AssignItemComponent, {
      width: '850px',
      panelClass: ['custommodal', 'assignItemPop'],
      disableClose: true,
      data: this.deviceId,
    }).afterClosed().subscribe(response => {
      if (response && this.deviceId) {
        this.getMenuItems(this.deviceId);
      }
    });
  }

  public showSnackbarMessage() {
    this.snackbar.open(
      this.translate.instant('GLOBAL.ERROR'),
      this.translate.instant('GLOBAL.OK'),
      {
        duration: 1000,
      },
    );
  }

  public redirectTermList(): void {
    this.route.navigate(['devices']);
  }
}
