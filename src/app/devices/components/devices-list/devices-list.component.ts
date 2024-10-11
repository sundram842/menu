import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { RegisterDeviceComponent } from '../register-device/register-device.component';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { DevicesService } from '../../services/devices.service';
import { SubscriptionBase } from '../../../global/utils/subscription';
import { Devices } from '../../models/devices-models';
import { CommonService } from 'src/app/shared/commonService/common-service.service';

@Component({
  selector: 'app-devices-list',
  standalone: true,
  imports: [TranslateModule, SharedModule, CommonModule],
  templateUrl: './devices-list.component.html',
  styleUrl: './devices-list.component.scss',
})
export class DeviceListComponent extends SubscriptionBase {
  public dataSource!: MatTableDataSource<Devices>;

  public loader?: boolean;

  constructor(
    private readonly dialog: MatDialog,
    private readonly route: Router,
    private readonly deviceService: DevicesService,
    @Inject(CommonService) private commonService: CommonService,
  ) {
    super();
    this.setPageTitle();
  }

  public displayedColumns = ['displayName', 'model', 'status', 'date'];

  public data = [
    {
      displayName: 'Device A',
      model: 'Model X',
      status: 'Active',
      date: new Date('2023-09-01'),
    },
    {
      displayName: 'Device B',
      model: 'Model Y',
      status: 'Inactive',
      date: new Date('2023-08-15'),
    },
    {
      displayName: 'Device C',
      model: 'Model Z',
      status: 'Active',
      date: new Date('2023-07-20'),
    },
  ];

  ngOnInit(): void {
    this.getDevices();
  }

  public setPageTitle(): void {
    let title = 'Devices';
    this.commonService.updateHeader({ title: title });
  }

  public getDevices() {
    this.loader = true;
    this.dataSubs.push(
      this.deviceService.getDevicesList().subscribe({
        next: (res) => {
          if (res.success && res.deviceList) {
            this.dataSource = new MatTableDataSource(res.deviceList);
          } else {
            this.dataSource = new MatTableDataSource<Devices>([]);
          }
          this.loader = false;
        },
        error(e) {
          console.log(e);
        },
      }),
    );
  }

  public registerDevice() {
    const dialog = this.dialog.open(RegisterDeviceComponent, {
      disableClose: true,
      width: '500px',
      panelClass: ['custommodal', 'registerDevicePopup'],
    });

    this.dataSubs.push(
      dialog.afterClosed().subscribe((result) => {
        if (result) {
          this.getDevices();
        }
      }),
    );
  }

  public openDetailView(row: Devices) {
    this.route.navigate(['devices', row.id]);
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
