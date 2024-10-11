import {
  EntityDetails,
  Filter,
  FilterInput,
  FilterType,
} from '../../models/filter';
import {
  Component,
  Inject,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  SimpleChanges,
  OnChanges,
  ChangeDetectorRef,
} from '@angular/core';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subscription, of } from 'rxjs';
import { Attribute } from '../../models/Attribute';
// import { setTimeout } from 'timers';
import { tap, debounceTime, switchMap } from 'rxjs/operators';
import { isNull, isNullOrUndefined, isUndefined } from 'util';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-common-filters',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './common-filters.component.html',
  styleUrls: ['./common-filters.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CommonFiltersComponent implements OnChanges {
  @ViewChild('content')
    content!: ElementRef;

  // contentHeight: number;
  filterForm!: UntypedFormGroup;

  fieldRules!: Attribute[];

  formAttributes: string[] = [];

  detailObj: any = {};

  errorMsg = false;

  shortUrl = '';

  masterJson: any = [];

  hide = true;

  pageState = 'read';

  orgState!: string;

  moreicon = false;

  fetchingRecords = true;

  getPermissionsSubscribe!: Subscription;

  dialogRefSubscriber!: Subscription;

  employeeListSubscriber!: Subscription;

  getMasterJsonsubscribe!: Subscription;

  getEmployeeDetailsByIdSubscriber!: Subscription;

  postEmployeeDetailsSubscriber!: Subscription;

  getRolessubscribe!: Subscription;

  configurationServiceSubscription!: Subscription;

  show = false;

  attrFieldMap: any = {};

  filterFieldMap: any = {};

  translateEntityMap = {
    Employee: 'EMPLOYEE',
    Cabin: 'CABIN',
    Guest: 'GUEST',
    BodyTemperature: 'BODY_TEMPERATURE',
    OrganisationBusinessCenter: 'BC',
    MenuItem: 'MENUITEM',
    Printer: 'PRINTER',
    Fidelio: 'FIDELIO',
    // user_type:"USER_TYPE"
  };

  // filterControls: Filter[];// = ["user_id", "first_name", "last_name", "email", "status", "groups"];
  // assignedFilterControls = ["user_id", "first_name", "last_name", "email", "role", "groups"];
  // unassignedFilterControls = ["user_id", "first_name", "last_name", "email", "groups"];
  formPrepared = false;

  getRolesSubscribe!: Subscription;

  fetchingRoles = true;

  filters: FilterInput[] = [];

  // Tag AutoComplete needs
  // tagFieldTitle: string = this.translate.instant("EMPLOYEE.groups");
  // tagResourceObject: TagResource;
  includeCategories: string[] = [];

  // [TagCategoryKeyEntity.BusinessCenterType, TagCategoryKeyEntity.Master];
  excludeCategories: string[] = []; // [TagCategoryKeyEntity.BusinessCenterType, TagCategoryKeyEntity.Master];

  entity!: string;

  @Input() permissions: any;

  @Input() activeFilters: FilterInput[] = [];

  @Input() filterControls: Filter[] = [];

  @Input() entityDetails!: EntityDetails;

  @Input() hasMoreIcon!: boolean;

  // @Input('state') state: string;

  @Output() finalFilters: EventEmitter<FilterInput[]> = new EventEmitter<
  FilterInput[]
  >();

  constructor(
    public translate: TranslateService,
    public dialogRef: MatDialogRef<CommonFiltersComponent>,
    private fb: UntypedFormBuilder,
    // private changePassHelper: ChangePasswordAdapter,
    private changeDetectorRef: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    if (data) {
      if (data.filters) {
        this.filters = data.filters;
        this.filters.forEach((element) => {
          if (element.Value) {
            this.detailObj[element.FilterBy] = element.Value;
          } else {
          }
        });
      }
      if (data.permissions) {
        this.permissions = data.permissions;
      }
    }
  }

  // ngDoCheck(): void {
  //   if (this.filterControls.length === 0) {
  //     this.changeDetectorRef.detectChanges();
  //     this.changeDetectorRef.markForCheck();
  //   }
  // }

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    if (!isNull(changes)) {
      if (changes.hasOwnProperty('entityDetails')) {
        const currentValue: EntityDetails = changes.entityDetails.currentValue;
        const previousValue: EntityDetails =
          changes.entityDetails.previousValue;
        const firstChange: boolean = changes.entityDetails.firstChange;

        if (firstChange || currentValue !== previousValue) {
          this.entity = currentValue.Name ? currentValue.Name : '';
          if (currentValue.AttrFieldMap) {
            currentValue.AttrFieldMap.forEach((element) => {
              this.attrFieldMap[element.Field] = element.Control;
              this.filterFieldMap[element.Control] = element.Field;
            });
          }
        }
      }

      if (changes.hasOwnProperty('filterControls')) {
        const currentValue: Filter[] = changes.filterControls.currentValue;

        this.filterControls = currentValue;
      }

      if (changes.hasOwnProperty('permissions')) {
        const currentValue = changes.permissions.currentValue;

        this.permissions = currentValue;
        this.getMasterJson();
      }

      if (changes.hasOwnProperty('activeFilters')) {
        const currentValue: FilterInput[] = changes.activeFilters.currentValue;
        const previousValue: FilterInput[] =
          changes.activeFilters.previousValue;
        const firstChange: boolean = changes.activeFilters.firstChange;
        if (!isUndefined(currentValue) && !isNull(currentValue)) {
          if (
            (!isUndefined(previousValue) && !isNull(previousValue)) ||
            firstChange
          ) {
            if (
              JSON.stringify(previousValue) !== JSON.stringify(currentValue) ||
              firstChange
            ) {
              this.filters = [...currentValue];
              this.detailObj = {};
              this.filters.forEach((element) => {
                if (element.Value) {
                  this.detailObj[element.FilterBy] = element.Value;
                }
              });
              // if (this.fieldRules) {
              this.prepareForm();
              // } else {
              //   this.getAttrRules(this.entity);
              // }
            } else {
            }
          } else {
          }
        }
      }
    }
  }

  // getAttrRules(moduleName = 'Employee') {
  //   this.commonService.getAttrRules(moduleName).subscribe(
  //     (data: any) => {
  //       this.fieldRules = data;
  //       this.prepareForm();
  //     },
  //     () => {
  //       // console.log("err: ", err);
  //     },
  //   );
  // }

  getMasterJson() {
    // this.getMasterJsonsubscribe = this.commonService
    //   .getMasterJson()
    //   .subscribe((data: any) => {
    this.masterJson = {
      status: [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
      ],
    };
    //   if (this.masterJson.status) {
    //     this.masterJson.status = this.masterJson.status.filter(
    //       (item: any) => item.key <= 2,
    //     );
    //   }
    // });
  }

  // getRoles() {
  //   this.getRolessubscribe = this.httpRoles.getRoles().subscribe((data: any) => {
  //     this.rolesData = data;

  //     // // load the initial bank list
  //     // this.filteredRolesMulti.next(this.rolesData.slice());
  //     // // listen for search field value changes
  //     // this.roleMultiFilterCtrl.valueChanges
  //     //     .pipe(takeUntil(this._onDestroy))
  //     //     .subscribe(() => {
  //     //         this.filterRolesMulti();
  //     //     });
  //   });
  // }

  prepareForm() {
    const formObj: any = {};
    for (const fieldRule of this.fieldRules) {
      formObj[this.attrFieldMap[fieldRule.attribute]] = new UntypedFormControl(
        null,
        [],
      );
    }

    this.filterForm = this.fb.group(formObj);
    // this.setControlValueChangeSubscriptions();
    if (this.entity === 'Employee') {
      this.employeeFilterPreFillings();
    }

    if (this.entity === 'Guest') {
      this.guestFilterPreFillings();
    }

    if (this.entity === 'OrganisationBusinessCenter') {
      this.locationFilterPreFillings();
    }

    if (this.entity === 'Printer') {
      this.printerFilterPreFillings();
    }

    this.filterControls.map((control) => {
      const formControl = this.filterForm.get(control.Name);
      if (
        this.isMultiValueFilterType(control.Type) &&
        formControl &&
        formControl.value &&
        !Array.isArray(formControl.value)
      ) {
        formControl.setValue([formControl.value]);
      }
    });

    this.formPrepared = true;
    this.changeDetectorRef.detectChanges();

    if (this.formPrepared) {
      // setTimeout(() => {
      //     this.contentHeight = this.content.nativeElement.scrollHeight;
      //     if (this.contentHeight > 75) {
      //         this.moreicon = true;
      //     }
      //     else {
      //         this.moreicon = false;
      //     }
      // }, 1000);
    }
    // })
  }

  printerFilterPreFillings(): void {
    if (
      this.permissions.read &&
      this.permissions.read.indexOf('assignedBusinesscenter') > -1
    ) {
      this.formAttributes.push('unassigned');
      // this.filterControls.push(
      //   new Filter('unassigned', FilterType.SingleCheckBox)
      // );
      this.filterForm.addControl(
        'unassigned',
        new UntypedFormControl(
          'unassigned' in this.detailObj ? this.detailObj.unassigned : false,
        ),
      );
    }

    if (
      this.permissions.read &&
      this.permissions.read.indexOf('assignedPrinterGroup') > -1
    ) {
      this.formAttributes.push('printerGroupUnassigned');
      this.filterForm.addControl(
        'printerGroupUnassigned',
        new UntypedFormControl(
          'printerGroupUnassigned' in this.detailObj
            ? this.detailObj.printerGroupUnassigned
            : false,
        ),
      );
    }

    if (
      this.filterForm.get('status') &&
      (!this.filterForm.get('status')?.value ||
        !(this.filterForm.get('status')?.value instanceof Array))
    ) {
      if (this.detailObj.Status) {
        this.filterForm.get('status')?.setValue(this.detailObj.Status);
      } else {
        this.filterForm.get('status')?.setValue('');
      }
    }
  }

  setControlValueChangeSubscriptions() {
    this.filterControls.forEach((element) => {
      if (!this.isTagControl(element)) {
        this.filterForm
          .get(element.Name)
          ?.valueChanges.pipe(
            debounceTime(300),
            tap(() => {
              // this.isAutoCompleteLoading = true;
            }),
            switchMap((value) => {
              if (value && value !== '') {
                // let getFilter = this.filters.filter(item => item.param == element);
                // if (getFilter.length > 0) {
                //     getFilter[0].value = value;
                // }
                // else {
                //     let obj = new EmployeeFilterInput();
                //     obj.param = element;
                //     obj.values = null;
                //     obj.value = value
                //     this.filters.push(obj)
                // }
                return of(null);
              } else {
                // this.isAutoCompleteLoading = false;
                return of(null);
              }
            }),
          )
          .subscribe(
            () => {
              setTimeout(() => {
                this.onSubmit(this.filterForm.value);
              }, 1000);
              // this.array_move(this.filterControls, this.filterControls.indexOf(element), 0);
              // this.finalFilters.emit(this.filters);
            },
            (error) => {
              console.log('error: ', error);
            },
          );
      }
    });
  }

  employeeFilterPreFillings(): void {
    this.filterForm.get('groups')?.setValue([]);

    if (
      this.filterForm.get('status') &&
      (!this.filterForm.get('status')?.value ||
        !(this.filterForm.get('status')?.value instanceof Array))
    ) {
      if (this.detailObj.Status) {
        this.filterForm.get('status')?.setValue(this.detailObj.Status);
      } else {
        this.filterForm.get('status')?.setValue('');
      }
    }

    if (
      this.filterForm.get('role') &&
      (!this.filterForm.get('role')?.value ||
        !(this.filterForm.get('role')?.value instanceof Array))
    ) {
      if (this.detailObj.Role) {
        this.filterForm.get('role')?.setValue(this.detailObj.Role);
      } else {
        this.filterForm.get('role')?.setValue('');
      }
    }
    this.updateTagProperties();
  }

  locationFilterPreFillings(): void {
    // this.filterForm.get('is_temporary').setValue([]);

    if (
      this.filterForm.get('status') &&
      (!this.filterForm.get('status')?.value ||
        !(this.filterForm.get('status')?.value instanceof Array))
    ) {
      if (this.detailObj.Status) {
        this.filterForm.get('status')?.setValue(this.detailObj.Status);
      } else {
        this.filterForm.get('status')?.setValue('');
      }
    }

    if (
      this.filterForm.get('is_temporary') &&
      (!this.filterForm.get('is_temporary')?.value ||
        !(this.filterForm.get('is_temporary')?.value instanceof Array))
    ) {
      if (this.detailObj.IsTemporary) {
        this.filterForm
          .get('is_temporary')
          ?.setValue(this.detailObj.IsTemporary);
      } else {
        this.filterForm.get('is_temporary')?.setValue('');
      }
    }
  }

  guestFilterPreFillings(): void {
    // this.filterForm.get('groups').setValue([]);

    if (
      this.filterForm.get('status') &&
      (!this.filterForm.get('status')?.value ||
        !(this.filterForm.get('status')?.value instanceof Array))
    ) {
      if (this.detailObj.Status) {
        this.filterForm.get('status')?.setValue(this.detailObj.Status);
      } else {
        this.filterForm.get('status')?.setValue('');
      }
    }

    // if (this.filterForm.get('role') && (!this.filterForm.get('role').value || !(this.filterForm.get('role').value instanceof Array))) {
    //     if (this.detailObj.Role)
    //         this.filterForm.get('role').setValue(this.detailObj.Role);
    //     else
    //         this.filterForm.get('role').setValue('');
    // }
    // this.updateTagProperties();
  }

  updateTagProperties(): void {
    // if (this.tagResourceObject) {
    //     this.tagResourceObject = null;
    // }

    // this.tagResourceObject = new TagResource();

    // this.tagResourceObject.type = TagResourceEntity.Employee;
    // if(!isNull(this.employeeID) && this.employeeID){
    //   this.tagResourceObject.item_id = Number(this.employeeID);
    // }

    this.filterForm.get('groups')?.setValue(this.detailObj.Groups);
  }

  onSubmit(input: any): void {
    const tagFieldsData = this.filters.filter((item) =>
      this.isTagInputFilter(item.FilterBy),
    );
    this.filters = [];
    Object.keys(input).forEach((key: string) => {
      if (
        input[key] &&
        !this.isTagInputFilter(this.filterFieldMap[key] as string)
      ) {
        let value: any = [];
        const isMultiInputFilter = this.isMultiInputFilter(key, input);

        if (isMultiInputFilter && !(input[key] instanceof Array)) {
          value.push(input[key]);
        } else if (
          isMultiInputFilter &&
          input[key] instanceof Array &&
          input[key].length === 0
        ) {
          value = null;
        } else {
          value = input[key];
        }

        if (value != null && value !== undefined) {
          const obj = new FilterInput(isMultiInputFilter);
          obj.FilterBy = this.filterFieldMap[key];
          obj.Value = value;
          // obj.text = key == 'status' ? this.masterJson.status.filter(item => item.key == key)[0].value : input[key];
          this.filters.push(obj);
        }
      }
    });

    // if (groupsData && groupsData.length > 0) {
    //   this.filters.push(groupsData[0]);
    // }

    this.filters =
      tagFieldsData && tagFieldsData.length && tagFieldsData[0].Value.length
        ? this.filters.concat(tagFieldsData)
        : this.filters;
    this.finalFilters.emit(this.filters);
  }

  isTagInputFilter(key: string): boolean {
    const filteredKeyInput = this.filterControls.filter(
      (item) => item.Name === this.attrFieldMap[key],
    );
    if (filteredKeyInput instanceof Array && filteredKeyInput.length > 0) {
      return this.isTagControl(filteredKeyInput[0]);
    }
    return false;
  }

  isMultiInputFilter(key: string, input: any): boolean {
    const filteredKeyInput = this.filterControls.filter(
      (item) => item.Name === key,
    );
    if (filteredKeyInput instanceof Array && filteredKeyInput.length > 0) {
      const filterType = filteredKeyInput[0].Type;
      return this.isMultiValueFilterType(filterType);
    } else {
      if (input[key] instanceof Array) {
        return true;
      } else {
        return false;
      }
    }
  }

  isMultiValueFilterType(filterType: FilterType): boolean {
    if (
      filterType === FilterType.DateTimePicker ||
      filterType === FilterType.MultiSelectDropDown ||
      filterType === FilterType.MultiSelectDropDownWithSearch
      // || filterType == FilterType.Tag
    ) {
      return true;
    } else {
      return false;
    }
  }

  public get allFiltersEmpty(): boolean {
    // if (this.filters.length == 0) {
    let formStatus = true;
    let tagFiltersStatus = true;
    // Object.keys(this.filterForm.value).forEach((key, index) => {

    // for (let i = 0; i < Object.keys(this.filterForm.value).length; i++) {
    for (const key in this.filterForm.value) {
      // const key = Object.keys(this.filterForm.value)[i];
      if (this.filterForm.value[key]) {
        if (
          this.filterForm.value[key] instanceof Array &&
          this.filterForm.value[key].length > 0
        ) {
          formStatus = false;
          break;
        } else if (!(this.filterForm.value[key] instanceof Array)) {
          formStatus = false;
          break;
        }
      }
    }

    const tagFilters = this.filters.filter((item) => {
      const filterControl = this.filterControls.find(
        (control) => control.Name === this.attrFieldMap[item.FilterBy],
      );
      return filterControl && this.isTagControl(filterControl);
    });
    if (
      tagFilters.length > 0 &&
      tagFilters.every(
        (item) => item.Value instanceof Array && item.Value.length > 0,
      )
    ) {
      tagFiltersStatus = false;
    }
    // )
    return formStatus && tagFiltersStatus;
    // }
  }

  public get hasFilterControls(): boolean {
    return (
      this.filterControls instanceof Array && this.filterControls.length > 0
    );
  }

  hasTagControl(): boolean {
    return (
      this.filterControls.filter((item) => item.Type === FilterType.Tag)
        .length > 0
    );
  }

  clearFilters(): void {
    // this.filterControls.forEach(element => {
    //     if (element.Type == FilterType.Tag) {
    //         if (this.filterForm.get(element.Name) instanceof FormControl) {

    //         }
    //     }
    // });
    // For not clearing the disabled filters
    this.filterControls.map((control) => {
      if (!control.Disabled) {
        if (this.filterForm.get(control.Name)) {
          this.filterForm.get(control.Name)?.reset();
        }
        this.filters.splice(
          this.filters.findIndex(
            (filterInput) => filterInput.FilterBy === control.Name,
          ),
          1,
        );
      }
    });
    this.finalFilters.emit(this.filters);
    // TODO: if any error in clear filters uncomment this
    // else this.onSubmit(this.filterForm.value);
  }

  isTextBoxControl(control: Filter): boolean {
    return control.Type === FilterType.TextBox;
  }

  isCheckBoxControl(control: Filter): boolean {
    return control.Type === FilterType.SingleCheckBox;
  }

  isTimeIntervalControl(control: Filter): boolean {
    return (
      control.Type === FilterType.TimePicker ||
      control.Type === FilterType.DateTimePicker ||
      control.Type === FilterType.DatePicker
    );
  }

  isTagControl(control: Filter): boolean {
    return control.Type === FilterType.Tag;
  }

  isDropDownControl(control: Filter): boolean {
    return (
      control.Type === FilterType.SingleSelectDropDown ||
      control.Type === FilterType.SingleSelectDropDownWithSearch ||
      control.Type === FilterType.MultiSelectDropDown ||
      control.Type === FilterType.MultiSelectDropDownWithSearch
    );
  }

  isValidDropDown(control: Filter): boolean {
    return (
      !isNullOrUndefined(control.Name) &&
      !isNullOrUndefined(control.DropDownInput) &&
      !isNullOrUndefined(control.DropDownInput.Data) &&
      !isNullOrUndefined(control.DropDownInput.Key) &&
      !isNullOrUndefined(control.DropDownInput.Text)
    );
  }

  array_move(arr: any[], oldIndex: number, newIndex: number): any[] {
    if (newIndex >= arr.length) {
      let k = newIndex - arr.length + 1;
      while (k--) {
        arr.push(undefined);
      }
    }
    arr.splice(newIndex, 0, arr.splice(oldIndex, 1)[0]);
    return arr; // for testing
  }

  // // control for the MatSelect filter keyword
  // public roleMultiFilterCtrl: FormControl = new FormControl();

  // // list of banks filtered by search keyword
  // public filteredRolesMulti: ReplaySubject<Role[]> = new ReplaySubject<Role[]>(1);

  // // Subject that emits when the component has been destroyed.
  // private _onDestroy = new Subject<void>();

  // private filterRolesMulti() {
  //     if (!this.rolesData) {
  //         return;
  //     }
  //     // get the search keyword
  //     let search = this.roleMultiFilterCtrl.value;
  //     if (!search) {
  //         this.filteredRolesMulti.next(this.rolesData.slice());
  //         return;
  //     } else {
  //         search = search.toLowerCase();
  //     }
  //     // filter the banks
  //     this.filteredRolesMulti.next(
  //         this.rolesData.filter(role => role.Name.toLowerCase().indexOf(search) > -1)
  //     );
  // }

  // public get placeholderLabel() {
  //     return this.translate.instant('GLOBAL.search');
  // }

  // public get noEntriesFoundLabel() {
  //     return this.translate.instant('GLOBAL.no_search_results');
  // }

  setSelectedValue(value: any, control: Filter) {
    const formControl = this.filterForm.get(control.Name) as UntypedFormControl;
    if (!isNullOrUndefined(formControl)) {
      const finalValue = [];
      const isMultiInputFilter = this.isMultiValueFilterType(control.Type);
      if (isMultiInputFilter && !(value instanceof Array)) {
        finalValue.push(value);
        formControl.setValue(finalValue);
      } else {
        formControl.setValue(value);
      }
    }
  }
}
