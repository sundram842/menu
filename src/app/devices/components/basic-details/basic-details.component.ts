import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { DevicesService } from '../../services/devices.service';
import { Devices } from '../../models/devices-models';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { RegisterDeviceComponent } from '../register-device/register-device.component';

@Component({
  selector: 'app-basic-details',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './basic-details.component.html',
  styleUrl: './basic-details.component.scss',
})
export class BasicDetailsComponent extends SubscriptionBase {
  public loading?: boolean;

  public deviceDetails?: Devices;

  @Input({ required: true }) public deviceId!: string;

  @Output() public Details = new EventEmitter<Devices>();

  constructor(
    private readonly deviceService: DevicesService,
    private readonly snackBar: MatSnackBar,
    private readonly translate: TranslateService,
    private readonly dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.deviceId) {
      this.getDetailsById(this.deviceId);
    }
    this.deviceService.dialogClose.subscribe(() => {
      if (this.deviceId) {
        this.getDetailsById(this.deviceId);
      }
    });
  }

  public getDetailsById(id: string) {
    this.loading = true;
    this.dataSubs.push(
      this.deviceService.getDevicesListById(id).subscribe((response) => {
        if (response.success && response.deviceList) {
          this.deviceDetails = response?.deviceList;
          this.Details.emit(this.deviceDetails);
        } else {
          this.showSnackbarMessage();
        }
        this.loading = false;
      }),
    );
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

  public upadateDevice(id: string) {
    const dialog = this.dialog.open(RegisterDeviceComponent, {
      disableClose: true,
      width: '500px',
      panelClass: ['custommodal', 'registerDevicePopup'],
      data: id,
    });

    this.dataSubs.push(
      dialog.afterClosed().subscribe((result) => {
        if (result && this.deviceId) {
          this.getDetailsById(this.deviceId);
        }
      }),
    );
  }
}
