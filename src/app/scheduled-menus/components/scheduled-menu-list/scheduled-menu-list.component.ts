import {
  ScheduleMenuResponse,
  ScheduleMenuService,
} from './../../services/schedule-menu.service';
import { Component, OnInit } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { CreateMenuPopupComponent } from '../create-menu-popup/create-menu-popup.component';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';

import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import { TranslateService } from '@ngx-translate/core';

import { MatTableDataSource } from '@angular/material/table';
import { ScheduleMenuItem } from '../../models/schedule-menu-item.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/commonService/common-service.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ScheduleStatus } from '../../models/schedule.constant';
export interface ScheduledMenus {
  menuName: string;
  lastUsedDate: string;
  nextDateOfUse: string;
  numberOfItems: number;
}

// const ELEMENT_DATA: ScheduledMenus[] = [
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
//   {
//     menuName: 'MDR Day 1',
//     lastUsedDate: '2024-07-25',
//     nextDateOfUse: '2024-08-20',
//     numberOfItems: 21,
//   },
//   {
//     menuName: 'MDR Day 2',
//     lastUsedDate: '2024-07-26',
//     nextDateOfUse: '2024-08-21',
//     numberOfItems: 18,
//   },
//   {
//     menuName: 'MDR Day 3',
//     lastUsedDate: '2024-07-27',
//     nextDateOfUse: '2024-08-22',
//     numberOfItems: 20,
//   },
// ];

@Component({
  selector: 'app-scheduled-menu-list',
  standalone: true,
  imports: [SharedModule, CommonModule, CreateMenuPopupComponent],
  templateUrl: './scheduled-menu-list.component.html',
  styleUrl: './scheduled-menu-list.component.scss',
  providers: [
    ScheduleMenuService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
})
export class ScheduledMenuListComponent
  extends SubscriptionBase
  implements OnInit {
  public loader?: boolean;

  public dataSource!: MatTableDataSource<ScheduleMenuItem>;

  public scheduleStatus = ScheduleStatus;

  constructor(
    private dialog: MatDialog,
    private readonly scheduleMenuService: ScheduleMenuService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService,
    private readonly route: Router,
    private commonService: CommonService,
  ) {
    super();
    this.setPageTitle();
  }

  ngOnInit(): void {
    this.getScheduleMenuItems();
  }

  displayedColumns: string[] = [
    'menuName',
    'scheduledDate',
    'lastUsedDate',
    'nextDateOfUse',
    'numberOfItems',
    'status',
  ];

  public createMenu() {
    this.dialog
      .open(CreateMenuPopupComponent, {
        width: '700px',
        panelClass: ['fullscreenpopup', 'createMenuPopup'],
      })
      .afterClosed()
      .subscribe((result) => {
        if (result) {
          this.getScheduleMenuItems();
        }
      });
  }

  public setPageTitle(): void {
    let title = 'Schedule Menu';
    this.commonService.updateHeader({ title: title });
  }

  public getScheduleMenuItems() {
    this.loader = true;
    this.scheduleMenuService
      .getScheduleMenuItems()
      .subscribe((scheduleMenu: ScheduleMenuResponse) => {
        if (scheduleMenu?.success && scheduleMenu?.data) {
          this.dataSource = new MatTableDataSource(scheduleMenu?.data);
        } else {
          this.dataSource = new MatTableDataSource<ScheduleMenuItem>([]);
        }
        this.loader = false;
      });
  }

  public toogleAction(event : MatSlideToggleChange, id: string) {
    if (event.checked) {
      this.activateItem(id);
    } else {
      this.deavtivateItem(id);
    }
   
  }

  public activateItem(id: string) {
    this.loader = true;
    this.dataSubs.push(this.scheduleMenuService.activateDevice(id).subscribe((response)=>{
      if (response.success) {
        this.getScheduleMenuItems();
        this.showSnackbarMessage(this.translate.instant('SCHEDULE.SCHEDULE_ACTIVATED'));
      } else {
        this.showSnackbarMessage(this.translate.instant('GLOBAL.ERROR'));
      }
      if (!response.success)
        this.loader = false;
    }));
  }

  public deavtivateItem(id: string) {
    this.loader = true;
    this.dataSubs.push(this.scheduleMenuService.DeactivateDevice(id).subscribe((response)=>{
      if (response.success) {
        this.getScheduleMenuItems();
        this.showSnackbarMessage(this.translate.instant('SCHEDULE.SCHEDULE_DEACTIVATED'));
      } else {
        this.showSnackbarMessage(this.translate.instant('GLOBAL.ERROR'));
      }
      if (!response.success)
        this.loader = false;
    }));
  }

  public navigateToScheduleDetails(id: string) {
    this.route.navigate(['schedule-menus', id]);
  }

  public showSnackbarMessage(message : string) {
    this.snackBar.open(message, 'Ok', {
      duration: 1000,
    });
  }
}
