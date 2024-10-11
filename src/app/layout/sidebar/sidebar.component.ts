import { ChangeDetectorRef, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { RouterModule } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LocationComponent } from 'src/app/business-center/components/locations/locations.component';
import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import {
  BusinessCenterDetailResponse,
  LayoutService,
} from 'src/app/global/services/layout-service/layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BusinessCenter } from 'src/app/business-center/models/business-center';
@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [CommonModule, SharedModule, RouterModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent extends SubscriptionBase {
  public locationDisplayName!: string;

  public businessCentersDetail?: BusinessCenter;

  public loader: boolean = false;

  constructor(
    private dialog: MatDialog,
    private layoutService: LayoutService,
    private readonly snackBar: MatSnackBar,
    private translate: TranslateService,
    private readonly changeDetectionRef: ChangeDetectorRef,
  ) {
    super();
  }

  ngOnInit() {
    const bcId = localStorage.getItem('businessCenterId') as string; //this.cookies.get('bcId');
    this.getBusinessCenterDetail(bcId);
  }

  public getBusinessCenterDetail(bcId: string) {
    this.loader = true;
    this.dataSubs.push(
      this.layoutService.getBusinessCenterDetail(bcId).subscribe({
        next: (res: BusinessCenterDetailResponse) => {
          if (res.success) {
            this.businessCentersDetail = res?.businessCenterDetail;
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
          this.changeDetectionRef.detectChanges();
        },
        error(err) {
          console.log(err);
        },
      }),
    );
  }

  public getBusinessCenter() {
    this.dialog.open(LocationComponent, {
      width: '600px',
      panelClass: ['custommodal', 'changelocationPopup'],
      disableClose: true,
    });
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
