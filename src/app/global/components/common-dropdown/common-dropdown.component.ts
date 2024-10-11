import {
  Component,
  Inject,
  ViewChild,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  OnDestroy,
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
import { UntypedFormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ReplaySubject, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { isNull } from 'util';
import { Filter, FilterType } from '../../models/filter';
import { MatSelectSearchComponent } from '../mat-select-search/mat-select-search.component';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-common-dropdown',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './common-dropdown.component.html',
  styleUrls: ['./common-dropdown.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CommonDropDownComponent implements OnChanges, OnDestroy {
  constructor(
    public translate: TranslateService,

    // private changePassHelper: ChangePasswordAdapter,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {
    // console.log('popup data', this.data)
  }

  public get selectedLength(): number {
    return this.selectCtrl.value.length;
  }

  public get getFirstSelectedText(): string {
    if (this.hasMultiSelection() && !this.selectCtrl.value.length) return '';
    return this.dropdownInput.DropDownInput.Data.filter(
      (item) =>
        item[this.dropdownInput.DropDownInput.Key] ==
        (this.hasMultiSelection()
          ? this.selectCtrl.value[0]
          : this.selectCtrl.value),
    )[0][this.dropdownInput.DropDownInput.Text];
  }

  public get placeholderLabel() {
    return this.translate.instant('GLOBAL.search');
  }

  public get noEntriesFoundLabel() {
    return this.translate.instant('GLOBAL.no_search_results');
  }

  public get clearSelectedItemsLabel() {
    return this.translate.instant('GLOBAL.clear_selected_items');
  }

  translateEntityMap = {
    Employee: 'EMPLOYEE',
    Cabin: 'CABIN',
    Guest: 'GUEST',
    BodyTemperature: 'BODY_TEMPERATURE',
    OrganisationBusinessCenter: 'BC',
    AssignTaxRule: 'ASSIGN_TAXRULE',
    AssignGratuity: 'ASSIGN_GRATUITY',
    MenuItem: 'MENUITEM',
    DayClosure: 'DAY_CLOSURE',
    Printer: 'PRINTER',
    Fidelio: 'FIDELIO',
  };

  @Input() dropdownInput!: Filter;

  @Input() entity!: string;

  @Input() defaultValue: any;

  @Input() selectCtrl: UntypedFormControl = new UntypedFormControl();

  @Output() finalSelection: EventEmitter<any> = new EventEmitter<any>();

  // clearPreviousSelection = false;

  // control for the MatSelect
  // public selectCtrl: FormControl = new FormControl();

  // control for the MatSelect filter keyword
  public searchCtrl: UntypedFormControl = new UntypedFormControl();

  // list of banks filtered by search keyword
  public filteredData: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);

  // Subject that emits when the component has been destroyed.
  private _onDestroy = new Subject<void>();

  @ViewChild('selectSearch') selectSearch!: MatSelectSearchComponent;

  ngOnChanges(changes: SimpleChanges) {
    // debugger;
    if (!isNull(changes)) {
      if (changes.hasOwnProperty('dropdownInput')) {
        const currentValue = changes.dropdownInput.currentValue;
        const previousValue = changes.dropdownInput.previousValue;
        const firstChange = changes.dropdownInput.firstChange;

        if (currentValue !== previousValue || firstChange) {
          this.dropdownInput = currentValue;

          // load the initial bank list
          this.filteredData.next(this.dropdownInput.DropDownInput.Data.slice());

          if (this.hasSearchControl()) {
            // listen for search field value changes
            this.searchCtrl.valueChanges
              .pipe(takeUntil(this._onDestroy))
              .subscribe(() => {
                this.filterDataMulti();
              });
          }
        }
      }

      if (changes.hasOwnProperty('defaultValue')) {
        const currentValue = changes.defaultValue.currentValue;
        const previousValue = changes.defaultValue.previousValue;
        const firstChange = changes.defaultValue.firstChange;

        if (currentValue !== previousValue || firstChange) {
          this.defaultValue = currentValue;
          // if ((this.dropdownInput.Type == FilterType.MultiSelectDropDownWithSearch ||
          //     this.dropdownInput.Type == FilterType.MultiSelectDropDown) &&
          //     this.defaultValue &&
          //     !(this.defaultValue instanceof Array)) {
          //     this.defaultValue = [];
          //     this.defaultValue.push(currentValue);
          // }
          if (
            !Array.isArray(this.defaultValue) &&
            this.defaultValue &&
            this.defaultValue.length > 0
          ) {
            this.defaultValue = parseInt(this.defaultValue);
            this.selectCtrl.setValue([this.defaultValue]);
          } else {
            this.selectCtrl.setValue(this.defaultValue);
            if (!this.defaultValue && !firstChange) {
              //   this.clearPreviousSelection = true;
              this.clearPreviousSelection();
            }
          }
        }
      }
    }
  }

  // setControlValueChangeSubscriptions() {
  //     this.filterControls.forEach(element => {
  //         if (element != 'groups') {
  //             this.filterForm.get(element).valueChanges
  //                 .pipe(
  //                     debounceTime(300),
  //                     tap(() => {
  //                         //this.isAutoCompleteLoading = true;
  //                     }),
  //                     switchMap((value) => {
  //                         if (value && value !== '') {
  //                             // let getFilter = this.filters.filter(item => item.param == element);
  //                             // if (getFilter.length > 0) {
  //                             //     getFilter[0].value = value;
  //                             // }
  //                             // else {
  //                             //     let obj = new GraphQLFilterInput();
  //                             //     obj.param = element;
  //                             //     obj.values = null;
  //                             //     obj.value = value
  //                             //     this.filters.push(obj)
  //                             // }
  //                             return of(null);
  //                         } else {
  //                             //this.isAutoCompleteLoading = false;
  //                             return of(null);
  //                         }
  //                     })
  //                 )
  //                 .subscribe(data => {
  //                     //console.log("subscribeFilters: ", this.filters);
  //                     setTimeout(() => {
  //                         //this.onSubmit(this.filterForm.value);
  //                     }, 1000);
  //                     // this.array_move(this.filterControls, this.filterControls.indexOf(element), 0);
  //                     // this.finalFilters.emit(this.filters);
  //                 },
  //                     (error) => {
  //                         console.log("error: ", error);
  //                     }
  //                 );
  //         }
  //     });
  // }

  emitValue() {
    // console.log("selectionChangeInCommonDropdown: ", event.value);
    this.finalSelection.emit(this.selectCtrl.value);
  }

  clearSelection() {
    this.selectCtrl.setValue([]);
    // this.clearPreviousSelection = true;
    this.clearPreviousSelection();
    this.finalSelection.emit(this.selectCtrl.value);
  }

  clearPreviousSelection(): void {
    if (this.selectSearch) {
      this.selectSearch.clearPreviousSelected();
    }
  }

  previousValue() {
    // this.clearPreviousSelection = event;
  }

  hasValue(): boolean {
    return (
      this.selectCtrl.value &&
      ((this.hasMultiSelection() && this.selectCtrl.value.length > 0) ||
        !this.hasMultiSelection())
    );
  }

  hasSearchControl(): boolean {
    return (
      this.dropdownInput.Type == FilterType.MultiSelectDropDownWithSearch ||
      this.dropdownInput.Type == FilterType.SingleSelectDropDownWithSearch
    );
  }

  hasMultiSelection(): boolean {
    return (
      this.dropdownInput.Type == FilterType.MultiSelectDropDown ||
      this.dropdownInput.Type == FilterType.MultiSelectDropDownWithSearch
    );
  }

  ngOnDestroy() {
    this._onDestroy.next();
    this._onDestroy.complete();
  }

  private filterDataMulti() {
    if (!this.dropdownInput.DropDownInput.Data) {
      return;
    }
    // get the search keyword
    let search = this.searchCtrl.value;
    if (!search) {
      this.filteredData.next(this.dropdownInput.DropDownInput.Data.slice());
      return;
    } else {
      search = search.trim().toLowerCase();
    }
    // filter the banks
    this.filteredData.next(
      this.dropdownInput.DropDownInput.Data.filter(
        (item) =>
          item[this.dropdownInput.DropDownInput.Text]
            .toLowerCase()
            .indexOf(search) > -1,
      ),
    );
  }
}
