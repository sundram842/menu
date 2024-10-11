import { CommonModule } from '@angular/common';
import { Component, Inject, ViewChild } from '@angular/core';
import { MenuListCommonComponent } from 'src/app/menu-item/components/menu-list-common/menu-list-common.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ScheduleMenuDetailsResponse, ScheduleMenuService } from '../../services/schedule-menu.service';
import { URL_CONSTANTS_TOKEN, urlConstants } from 'src/app/constants/urlConstants';
import { SubscriptionBase } from 'src/app/global/utils/subscription-base';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CreateMenuPopupComponent } from '../create-menu-popup/create-menu-popup.component';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { BasicMenuItem, MenuItem, MenuItemsResponse } from 'src/app/menu-item/models/menu-item.model';
import { UpdateMenuBody } from '../../models/schedule.constant';
import { TranslateService } from '@ngx-translate/core';
import { ScheduleDetailMenu } from 'src/app/scheduled-menus/models/schedule.model';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';

@Component({
  selector: 'app-update-menu',
  standalone: true,
  imports: [SharedModule, CommonModule, MenuListCommonComponent],
  templateUrl: './update-menu.component.html',
  styleUrl: './update-menu.component.scss',
  providers: [
    ScheduleMenuService,
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
})
export class UpdateMenuComponent extends SubscriptionBase {

  public scheduleForm: UntypedFormGroup = new UntypedFormGroup({});

  public menuItems?: BasicMenuItem[];

  public selectedMenuItems?:MenuItem[];

  public selectedItemsForSchedule?: MenuItem[];

  public selectedItems?:{ id: string; quantity: number }[];
  
  public loader?: boolean;

  @ViewChild('stepper', { static: false }) stepper?: MatStepper;

  public menuDetail?:ScheduleDetailMenu;

  displayedColumns = [
    'select',
    'name',
    'skuId',
  ];

  displayedColumnsTwo = [
    'select',
    'name',
    'skuId',
    'qty',
  ];


  public  selectedDates: Date[] = [];

  constructor(private scheduleService: ScheduleMenuService, 
    private snackbar: MatSnackBar,
    private readonly menuItemService: MenuItemService,
    private readonly matDialogRef: MatDialogRef<CreateMenuPopupComponent>,
    @Inject(MAT_DIALOG_DATA) private menuId:string,
    private translate: TranslateService,
  ) {
    super();
  }

  ngOnInit(): void {
    this.getScheduleMenuItemsById();
  }

  onStepChange(event: StepperSelectionEvent): void {
    if (event.selectedIndex === 1 && !this.menuItems?.length) {
      this.getMenuItems();
    }
  }

  private getMenuListById(id: string): void {
    this.loader = true;
    this.dataSubs.push(
      this.scheduleService
        .getScheduledMenuDetails(id)
        .subscribe((menuItems: MenuItemsResponse) => {
          if (menuItems?.success && menuItems?.data) {
            this.selectedMenuItems = menuItems?.data;
          } else {
            //TODO ERROR heading
            this.snackBarFunction('Oops something went wrong...!', 'ok');
          }
          this.loader = false;
        }),
    );
  }

  public getScheduleMenuItemsById() {
    this.loader = true;
    this.dataSubs.push(
      this.scheduleService.getScheduleMenuItemsById(this.menuId).subscribe({
        next: (res: ScheduleMenuDetailsResponse) => {
          if (res.success) {
            this.menuDetail = res?.data;
            this.prePareForm();
            if (this.menuDetail?.date)
              this.selectedDates.push(this.menuDetail?.date);
          } else {
            //TODO ERROR heading
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

  handle(event: MenuItem[]) {
    this.selectedItemsForSchedule = [...event];
  }

  prePareForm() {
    this.scheduleForm = new UntypedFormGroup({
      name: new UntypedFormControl(this.menuDetail?.name ? this.menuDetail?.name : '', [Validators.required]), 
      description: new UntypedFormControl('', [Validators.maxLength(500)]), 
      date: new UntypedFormControl(this.menuDetail?.date ? this.menuDetail?.date : '', [Validators.required]), 
    });
  }

  get formControl() {
    return this.scheduleForm.controls;
  }

  public getErrorMessage(control: AbstractControl, fieldLabel: string): string {
    if (control.errors?.required) {
      return `${fieldLabel} is required.`;
    }
    if (control.errors?.pattern) {
      return `Invalid format for ${fieldLabel}.`;
    }
    if (control.errors?.whitespace) {
      return `No leading or trailing whitespace allowed in ${fieldLabel}.`;
    }
    if (control.errors?.noNegativeNumbers) {
      return `${fieldLabel} cannot contain negative numbers.`;
    }
    if (control.errors?.maxlength) {
      return `${fieldLabel} cannot exceed ${control.errors.maxlength.requiredLength} characters.`;
    }
    return '';
  }
  
  addDate(date: Date): void {
    if (date && !this.selectedDates.includes(date)) {
      this.selectedDates[0] = date;
    }
  }

  private getMenuItems(): void {
    this.loader = true;
    this.dataSubs.push(
      this.menuItemService
        .getMenuItems()
        .subscribe((menuItems: MenuItemsResponse) => {
          if (menuItems?.success && menuItems?.data) {
            this.menuItems = menuItems.data;
            this.getMenuListById(this.menuId);
          } else {
            //TODO ERROR heading
            this.snackbar.open('Oops something went wrong...!', 'ok', {
              duration: 5000,
            });
          }
        }),
    );
  }

  public updateMenu() {
    this.loader = true;
    if (this.selectedItems) {
      const data = UpdateMenuBody.BindForm(this.scheduleForm.value, this.selectedItems);

      this.dataSubs.push(this.menuItemService.updateScheduleMenu(this.menuId, data).subscribe(response =>{
        if (response.success) {
          this.matDialogRef.close(true);
          this.snackbar.open('Menu update successfully', 'ok', {
            duration: 5000,
          });
        } else {
          //TODO ERROR heading
          this.matDialogRef.close(false);
          this.snackbar.open('Oops something went wrong...!', 'ok', {
            duration: 5000,
          });
        } 
        this.loader = false;
      }));
    }
  }

  private snackBarFunction(message: string, action: string) {
    this.snackbar.open(message, action, {
      duration: 5000,
    });
  }

  public removeDate(): void {
    this.formControl.availableDates.setValue(null);
    this.selectedDates = [];
    this.scheduleForm.updateValueAndValidity();
  }
}
