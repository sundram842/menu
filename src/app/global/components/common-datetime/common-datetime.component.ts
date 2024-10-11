import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  SimpleChanges,
  OnChanges,
  ViewChild,
} from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  MAT_MOMENT_DATE_FORMATS,
  MomentDateAdapter,
} from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';
import { isNull } from 'util';
import { Filter, FilterType } from '../../models/filter';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';

@Component({
  selector: 'app-common-datetime',
  standalone: true,
  imports: [CommonModule, SharedModule],
  templateUrl: './common-datetime.component.html',
  styleUrls: ['./common-datetime.component.scss'],
  providers: [
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS },
  ],
})
export class CommonDateTimeComponent implements OnInit, OnChanges {
  translateEntityMap = {
    Employee: 'EMPLOYEE',
    Cabin: 'CABIN',
    Guest: 'GUEST',
    BodyTemperature: 'BODY_TEMPERATURE',
  };

  filterForm!: UntypedFormGroup;

  today: Date = new Date();

  yesterday: Date = new Date();

  @Input() entity!: string;

  @Input() controlInput!: Filter;

  @Output() finalSelection: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('endpicker') endpicker!: any;

  constructor(private fb: UntypedFormBuilder) {
    this.today.setDate(this.today.getDate());
    this.yesterday.setDate(this.today.getDate() - 1);
  }

  ngOnChanges(changes: SimpleChanges) {
    //debugger;
    if (!isNull(changes)) {
      if (changes.hasOwnProperty('controlInput')) {
        const currentValue = changes.controlInput.currentValue;
        const previousValue = changes.controlInput.previousValue;
        const firstChange = changes.controlInput.firstChange;

        if (currentValue !== previousValue || firstChange) {
          this.controlInput = currentValue;
        }
      }

      if (changes.hasOwnProperty('entity')) {
        const currentValue = changes.entity.currentValue;
        const previousValue = changes.entity.previousValue;
        const firstChange = changes.entity.firstChange;

        if (currentValue !== previousValue || firstChange) {
          this.entity = currentValue;
        }
      }
    }
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      //date: [],
      start_time: [],
      end_time: [],
    });

    this.filterForm.get('start_time')?.valueChanges.subscribe((value) => {
      if (value) {
        if (!this.endpicker) {
          setTimeout(() => {
            this.endpicker.open();
          }, 100);
        } else this.endpicker.open();

        setTimeout(() => {
          this.onSubmit(this.filterForm.value);
        }, 1000);
      }
    });

    this.filterForm.get('end_time')?.valueChanges.subscribe(() => {
      setTimeout(() => {
        this.onSubmit(this.filterForm.value);
      }, 1000);
    });
  }

  onSubmit(formData: any): void {
    var startTime = new Date(formData.start_time);
    var endTime = new Date(formData.end_time);

    var convertedStartTime = this.convertDateTimeToInt(startTime);
    var convertedEndTime = this.convertDateTimeToInt(endTime);

    var selectedTime = [];
    selectedTime.push(convertedStartTime);
    selectedTime.push(convertedEndTime);

    this.finalSelection.emit(selectedTime);
  }

  convertDateTimeToInt(date: Date): number {
    return Math.round(date.getTime() / 1000);
  }

  public get isDateTimePickerControl(): boolean {
    return this.controlInput.Type == FilterType.DateTimePicker;
  }

  public get isTimePickerControl(): boolean {
    return this.controlInput.Type == FilterType.TimePicker;
  }
}
