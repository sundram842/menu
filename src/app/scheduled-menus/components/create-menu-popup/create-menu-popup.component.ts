import { Component, ViewChild } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { CommonModule } from '@angular/common';
import { BasicMenuItem, MenuItem, MenuItemsResponse } from '../../../menu-item/models/menu-item.model';
import { MenuListCommonComponent } from 'src/app/menu-item/components/menu-list-common/menu-list-common.component';
import { AbstractControl, UntypedFormControl, UntypedFormGroup, Validators } from '@angular/forms';
import { SubscriptionBase } from 'src/app/global/utils/subscription';
import { ScheduleMenuService } from '../../services/schedule-menu.service';
import { URL_CONSTANTS_TOKEN, urlConstants } from 'src/app/constants/urlConstants';
import { CreateSchedule } from '../../models/schedule.constant';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MenuItemService } from 'src/app/menu-item/services/menu-item.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatStepper } from '@angular/material/stepper';
import { StepperSelectionEvent } from '@angular/cdk/stepper';
import { ScheduleErrorConstants } from 'src/app/shared/models/error-constant';
@Component({
  selector: 'app-create-menu-popup',
  standalone: true,
  imports: [SharedModule, CommonModule, MenuListCommonComponent],
  providers:[
    ScheduleMenuService,
    MenuItemService,
    { provide: URL_CONSTANTS_TOKEN, useValue: urlConstants },
  ],
  templateUrl: './create-menu-popup.component.html',
  styleUrl: './create-menu-popup.component.scss',
})
export class CreateMenuPopupComponent extends SubscriptionBase {

  public scheduleForm: UntypedFormGroup = new UntypedFormGroup({});

  public menuItems?: BasicMenuItem[];

  public selectedItemsForSchedule?: MenuItem[];

  public selectedItems?:{ id: string; quantity: number }[];

  @ViewChild('stepper') stepper?: MatStepper;

  public loader?: boolean;

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
  ) {
    super();
  }

  ngOnInit(): void {
    this.prePareForm();
  }

  public handleSelectItems(event: MenuItem[]) {
    this.selectedItemsForSchedule = [...event];
  }

  public handleSelectQuantites(event: any[]) {
    this.selectedItems = [...event];
  }

  prePareForm() {
    this.scheduleForm = new UntypedFormGroup({
      menuName: new UntypedFormControl('', [Validators.required]), 
      description: new UntypedFormControl('', [Validators.maxLength(500)]), 
      availableDates: new UntypedFormControl([], [Validators.required]), 
    });
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
    if (!this.selectedDates.includes(date)) {
      this.selectedDates.push(date);
      this.scheduleForm.controls.availableDates.patchValue(date);
    }
  }

  public matNextButton(event:  StepperSelectionEvent) {
    if (event.selectedIndex === 1 && !this.menuItems?.length) {
      this.getMenuItems();
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
          } else {
            //TODO ERROR heading
            this.menuItems = [];
            // this.snackbar.open('Oops something went wrong...!', 'ok', {
            //   duration: 5000,
            // });
          }
          this.loader = false;
        }),
    );
  }

  public createSchedule() {
    this.loader = true;
    if (this.selectedItems) {
      const data = CreateSchedule.BindForm(this.scheduleForm.value, this.selectedItems, this.selectedDates);

      this.dataSubs.push(this.scheduleService.createDevice(data).subscribe(response =>{
        if (response.success) {
          this.matDialogRef.close(true);
          this.snackbar.open('Menu schedule is created successfully', 'ok', {
            duration: 5000,
          });
        } else {
          //TODO ERROR heading
          this.matDialogRef.close(false);
          let errorMessage = '';
          switch (response.message) {
            case ScheduleErrorConstants.CONST_ERROR_MENU_ITEM_DETAILS_NOT_FOUND:
              errorMessage = 'Menu item details not found';
              break;
            case ScheduleErrorConstants.CONST_ERROR_INVALID_UPDATE_SCHEDULE_DATE:
              errorMessage = 'Invalid schedule update date';
              break;
            case ScheduleErrorConstants.CONST_ERROR_MENU_DETAILS_EXISTS:
              errorMessage = 'Menu details already exist';
              break;
            case ScheduleErrorConstants.CONST_ERROR_SCHEDULE_MENU_ALREADY_ACTIVE:
              errorMessage = 'The schedule menu is already active';
              break;
            case ScheduleErrorConstants.CONST_ERROR_SCHEDULE_MENU_COMPLETED:
              errorMessage = 'The schedule menu is already completed';
              break;
            case ScheduleErrorConstants.CONST_ERROR_SCHEDULE_MENU_ALREADY_DRAFT:
              errorMessage = 'The schedule menu is already in draft';
              break;
            case ScheduleErrorConstants.CONST_ERROR_SCHEDULE_MENU_ALREADY_INACTIVE:
              errorMessage = 'The schedule menu is already inactive';
              break;
            default :
              errorMessage = 'Oops something went wrong...!';
              break;
               

          }
          this.showSnackbarMessage(errorMessage);
        } 
        this.loader = false;
      }));
    }
  }

  public showSnackbarMessage(message: string) {
    this.snackbar.open(
      message,
      'ok',
      {
        duration: 1000,
      },
    );
  }

  public onInputKeyDown(event: KeyboardEvent): void {
    if (
      !event.ctrlKey &&
      !event.metaKey &&
      !event.altKey &&
      !event.shiftKey &&
      ![37, 38, 39, 40, 9].includes(event.keyCode) // Arrow keys and Tab key
    ) {
      event.preventDefault();
    }
  }

  public removeDate(index: number): void {
    this.selectedDates.splice(index, 1);
    // this.scheduleForm.controls.availableDates?.value?.splice(index, 1);
    this.scheduleForm.controls.availableDates.patchValue(this.selectedDates[this.selectedDates.length - 1]);
    if (!this.selectedDates?.length) {
      this.scheduleForm.controls.availableDates.setValue('');
    }
  }

  ngOnDestroy(): void {
    this.clearDataSubs();
  }
}
