import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { MatDialog } from '@angular/material/dialog';
import { UpdateMenuComponent } from 'src/app/scheduled-menus/components/update-menu/update-menu.component';
import { ScheduleMenuDetailsResponse, ScheduleMenuService } from '../../services/schedule-menu.service';
import { URL_CONSTANTS_TOKEN, urlConstants } from 'src/app/constants/urlConstants';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { ScheduleDetailMenu } from '../../models/schedule.model';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-menu-detais',
  standalone: true,
  imports: [CommonModule, SharedModule],
  providers:[
    ScheduleMenuService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './menu-detais.component.html',
  styleUrl: './menu-detais.component.scss',
})
export class MenuDetaisComponent extends SubscriptionBase {

  public loader?: boolean;

  public scheduleDetails?: ScheduleDetailMenu;

  @Output() emitScheduleDetails = new EventEmitter();

  @Input({ required : true }) public scheduleItemId!: string;

  @Output() menuGetUpdate = new EventEmitter<boolean>();

  constructor( private readonly scheduleService: ScheduleMenuService,
    private readonly snackbar: MatSnackBar,
    private dialog: MatDialog,
  ) {
    super();
  }

  ngOnInit(): void {
    if (this.scheduleItemId) {
      this.getScheduleMenuItemsById(this.scheduleItemId);
    }
  }

  public getScheduleMenuItemsById(id: string) {
    this.loader = true;
    this.dataSubs.push(
      this.scheduleService.getScheduleMenuItemsById(id).subscribe({
        next: (res: ScheduleMenuDetailsResponse) => {
          if (res.success && res?.data) {
            this.scheduleDetails = res?.data;
            this.emitScheduleDetails.emit(this.scheduleDetails);
          } else {
            //TODO ERROR heading
            this.snackBarFunction(
              'Oops somthing went wrong....!',
              'ok',
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

  
  public toogleAction(event : MatSlideToggleChange) {
    if (this.scheduleDetails?.id) {
      if (event.checked) {
        this.activateItem(this.scheduleDetails?.id);
      } else {
        this.deavtivateItem(this.scheduleDetails?.id);
      }
    }
   
  }

  public activateItem(id: string) {
    this.loader = true;
    this.dataSubs.push(this.scheduleService.activateDevice(id).subscribe((response)=>{
      if (response.success) {
        this.getScheduleMenuItemsById(id);
        this.snackBarFunction('Item activated successfully', 'ok');
      } else {
        this.snackBarFunction('Oops something went wrong...!', 'ok');
      }
      if (!response.success)
        this.loader = false;
    }));
  }

  public deavtivateItem(id: string) {
    this.loader = true;
    this.dataSubs.push(this.scheduleService.DeactivateDevice(id).subscribe((response)=>{
      if (response.success) {
        this.getScheduleMenuItemsById(id);
        this.snackBarFunction('Item deactivated successfully', 'ok');
      } else {
        this.snackBarFunction('Oops something went wrong...!', 'ok');
      }
      if (!response.success)
        this.loader = false;
    }));
  }

  private snackBarFunction(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
    });
  }

  public openUpdateDialog() {
    this.dialog.open(UpdateMenuComponent, {
      width: '700px',
      panelClass: ['fullscreenpopup', 'createMenuPopup'],
      data:this.scheduleItemId,
    }).afterClosed().subscribe((result:boolean)=>{
      if (result) {
        this.getScheduleMenuItemsById(this.scheduleItemId);
        this.menuGetUpdate.emit(result);
      }

    });
  }
}
