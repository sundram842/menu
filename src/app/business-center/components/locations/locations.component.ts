import { ChangeDetectorRef, Component, Inject } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import {
  BusinessCenterResponse,
  BusinessCenterService,
  ChangeBusinessCenterResponse,
} from '../../data-providers/business-center.service';
import { BusinessCenter } from '../../models/business-center';
import { CommonModule } from '@angular/common';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionBase } from '../../../global//utils/subscription-base';
import {
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
} from '@angular/forms';
import { SessionServiceService } from 'src/app/global/services/session-service/session-service.service';
import { Router } from '@angular/router';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { BasicMenuItem } from 'src/app/menu-item/models/menu-item.model';
import { BusinessCenterPostBody } from '../../constant/business-constent';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import { DevicesService } from 'src/app/devices/services/devices.service';
import {
  URL_CONSTANTS_TOKEN,
  urlConstants,
} from 'src/app/constants/urlConstants';
import { CookieService } from 'ngx-cookie-service';

export interface BusinessCenterFormValue {
  location: string;
}

@Component({
  selector: 'app-locations',
  standalone: true,
  imports: [SharedModule, CommonModule],
  providers: [
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './locations.component.html',
  styleUrl: './locations.component.scss',
})
export class LocationComponent extends SubscriptionBase {
  public businessCenters?: BusinessCenter[];

  public businessCentersForm!: UntypedFormGroup;

  private defaultLocation?: string;

  public chooseLocation: boolean = false;

  public menuItems?: BasicMenuItem[];

  public availableMenuItems?: BasicMenuItem[];

  public loader?: boolean;

  constructor(
    private readonly businessCenterService: BusinessCenterService,
    private readonly snackBar: MatSnackBar,
    private translate: TranslateService,
    private readonly router: Router,
    public dialogRef: MatDialogRef<LocationComponent>,
    private readonly sessionServiceService: SessionServiceService,
    private fb: UntypedFormBuilder,
    @Inject(MAT_DIALOG_DATA) public deviceId: string,
    private readonly itemService: MenuItemService,
    private readonly deviceService: DevicesService,
    private readonly changeDetectionRef: ChangeDetectorRef,
    private readonly cookieService:CookieService,

    @Inject(MAT_DIALOG_DATA) public id: string,
  ) {
    super();
  }

  ngOnInit() {
    this.preppedForm();
    this.businessCentersForm.valueChanges.subscribe(
      (value: BusinessCenterFormValue) => {
        this.chooseLocation = value?.location !== this.defaultLocation;
      },
    );
    if (this.deviceId) {
      this.getMenuItems(this.deviceId);
    } else {
      this.getBusinessCenter();
    }
  }

  public getBusinessCenter() {
    this.loader = true;
    this.dataSubs.push(
      this.businessCenterService.getBusinessCenter().subscribe({
        next: (res: BusinessCenterResponse) => {
          if (res.success) {
            this.businessCenters = res?.businessCenter;
            this.getDefaultLocation();
          } else {
            //TODO ERROR heading
            this.snackBarFunction(
              this.translate.instant('GLOBAL.ERROR'),
              this.translate.instant('GLOBAL.OK'),
            );
          }
          this.loader = false;
          this.changeDetectionRef.detectChanges();
        },
        error(err) {
          console.log(err);
        },
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
            this.getAvailableMenuItems();
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

  public getAvailableMenuItems() {
    this.dataSubs.push(
      this.itemService.getMenuItems().subscribe({
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
            this.snackBar.open(
              this.translate.instant('GLOBAL.ERROR'),
              this.translate.instant('GLOBAL.OK'),
              {
                duration: 5000,
              },
            );
          }
        },
        error(e) {
          console.log(e);
        },
      }),
    );
  }

  private getDefaultLocation(): void {
    this.defaultLocation = localStorage.getItem('businessCenterId') as string;
    this.formControl.location?.patchValue(this.defaultLocation);
  }

  private preppedForm(): void {
    if (this.deviceId) {
      this.businessCentersForm = this.fb.group({
        items: this.fb.array([]),
      });
    } else {
      this.businessCentersForm = this.fb.group({
        location: new UntypedFormControl(),
      });
    }
  }

  public changeLocation(): void {
    this.loader = true;
    const postBody = BusinessCenterPostBody.BindForm(
      this.businessCentersForm.value,
    );
    this.dataSubs.push(
      this.businessCenterService.changeBusinessCenter(postBody).subscribe({
        next: (res: ChangeBusinessCenterResponse) => {
          if (res?.success && res?.id) {
            localStorage.setItem('businessCenterId', res?.id);
            this.cookieService.set('businessCenterId', res?.id);
            const targetUrl = '/devices';
            this.snackBar.open(
              this.translate.instant('BUSINESS_CENTER.CHANGE_BUSINESS_CENTER'),
              this.translate.instant('GLOBAL.OK'),
              {
                duration: 5000,
              },
            );
            this.router
              .navigateByUrl('/', { skipLocationChange: true })
              .then(() => {
                this.router.navigate([targetUrl], { skipLocationChange: true });
              });
            this.dialogRef.close();
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
          this.loader = false;
        },
        error(err) {
          console.log(err);
        },
      }),
    );
  }

  public assignItems() {
    this.loader = true;
    if (this.deviceId && this.businessCentersForm.value) {
      this.dataSubs.push(
        this.itemService
          .unassignItems(this.businessCentersForm.value, this.deviceId)
          .subscribe((response) => {
            if (response.success) {
              this.snackBar.open(
                this.translate.instant('DEVICE.DEVICE_UNASSIGNE'),
                this.translate.instant('GLOBAL.ok'),
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

  public showSnackbarMessage() {
    this.snackBar.open(
      this.translate.instant('GLOBAL.ERROR'),
      this.translate.instant('GLOBAL.OK'),
      {
        duration: 1000,
      },
    );
  }

  private snackBarFunction(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  get formControl() {
    return this.businessCentersForm?.controls;
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
