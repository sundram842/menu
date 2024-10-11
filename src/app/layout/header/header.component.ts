import { Component } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import {
  BusinessCenterDetailResponse,
  LayoutService,
  LogoutResponse,
  UserDetailsResponse,
} from 'src/app/global/services/layout-service/layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import { BusinessCenter } from 'src/app/business-center/models/business-center';
import { Router } from '@angular/router';
import { HeaderConstant } from '../../../app/constants/layout-constant';
import { UserDetail } from '../../../app/global/models/header';
import { CommonService } from 'src/app/shared/commonService/common-service.service';
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [SharedModule, CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent extends SubscriptionBase {
  public partnerLogo = environment.partnerLogos.zeeko;

  public isprofileOpen: boolean = false;

  public loader: boolean = false;

  public businessCentersDetail?: BusinessCenter;

  public mail?: string;

  public mobileNumber?: string;

  public headerConstant = HeaderConstant;

  public userDetails?: UserDetail;

  public bcId?: string;

  public userId?: string;

  headerContent: any = { title: '' };

  constructor(
    private layoutService: LayoutService,
    private readonly snackBar: MatSnackBar,
    private translate: TranslateService,
    private router: Router,
    private commonService: CommonService,
  ) {
    super();
  }

  ngOnInit() {
    this.bcId = localStorage.getItem('businessCenterId') as string;// this.cookies.get('bcId');
    this.userId = localStorage.getItem('userId') as string;
    this.dataSubs.push(
      this.commonService.getHeader().subscribe((data) => {
        this.headerContent = data;
      }),
    );
    
    this.getUserDetailsById(this.userId);
    this.getBusinessCenterDetail(this.bcId);
  }

  public getUserDetailsById(userId: string) {
    this.dataSubs.push(
      this.layoutService.getUserDetailsById(userId).subscribe({
        next: (res: UserDetailsResponse) => {
          if (res.success) {
            this.userDetails = res?.userDetails;
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
        },
        error(err) {
          console.log(err);
        },
      }),
    );
  }

  public getBusinessCenterDetail(bcId: string) {
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
        },
        error(err) {
          console.log(err);
        },
      }),
    );
  }

  public toggleSidebar() {
    this.isprofileOpen = !this.isprofileOpen;
    const body = document.body;
    if (this.isprofileOpen) {
      body.classList.add('profile-open');
    } else {
      body.classList.remove('profile-open');
    }
  }

  public logout() {
    this.loader = true;
    localStorage.clear();
    this.dataSubs.push(
      this.layoutService.logout().subscribe({
        next: (res: LogoutResponse) => {
          if (res.success) {
            this.router.navigate(['/login']);
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

  public pauseBusinessCenter() {
    this.loader = true;
    if (this?.bcId) {
      this.dataSubs.push(
        this.layoutService.pauseBusinessCenter(this.bcId).subscribe({
          next: (res: BusinessCenterDetailResponse) => {
            if (res.success) {
              this.snackBarFunction(
                this.translate.instant('BUSINESS_CENTER.PAUSE_BUSINESS_CENTER'),
                this.translate.instant('GLOBAL.OK'),
              );
              if (this.bcId)
                this.getBusinessCenterDetail(this.bcId);
            } else {
              //TODO ERROR heading NEED TO DO
              this.snackBarFunction(
                this.translate.instant('GLOBAL.ERROR'),
                this.translate.instant('GLOBAL.OK'),
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
  }

  public playBusinessCenter() {
    this.loader = true;
    if (this.bcId) {
      this.dataSubs.push(
        this.layoutService.playBusinessCenter(this.bcId).subscribe({
          next: (res: BusinessCenterDetailResponse) => {
            if (res.success) {
              this.snackBarFunction(
                this.translate.instant('BUSINESS_CENTER.RESUME_BUSINESS_CENTER'),
                this.translate.instant('GLOBAL.OK'),
              );
              if (this.bcId)
                this.getBusinessCenterDetail(this.bcId);
            } else {
              //TODO ERROR heading NEED TO DO
              this.snackBarFunction(
                this.translate.instant('GLOBAL.ERROR'),
                this.translate.instant('GLOBAL.OK'),
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
  }

  private snackBarFunction(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 5000,
    });
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
