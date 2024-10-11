export enum FilterType {
  TextBox = 1,
  TextBoxWithAutoComplete = 2,
  SingleSelectDropDown = 3,
  SingleSelectDropDownWithSearch = 4,
  MultiSelectDropDown = 5,
  MultiSelectDropDownWithSearch = 6,
  Tag = 7,
  DatePicker = 8,
  TimePicker = 9,
  DateTimePicker = 10,
  IntegerRange = 11,
  SingleCheckBox = 12,
}

export class DropDownInput {
  Data!: any[];

  Key!: string;

  Text!: string;

  constructor(key: string = '', displayTextKey: string = '', data: any[] = []) {
    if (key) {
      this.Key = key;
    }
    if (displayTextKey) {
      this.Text = displayTextKey;
    }
    if (data) {
      this.Data = data;
    }
  }
}

export class Filter {
  Name!: string;

  TranslateKey!: string;

  Type!: FilterType;

  Disabled: boolean;

  DropDownInput!: DropDownInput;

  constructor(
    name: string = '',
    type: FilterType | undefined = undefined,
    translateKey: string = '',
    disabled: boolean = false,
  ) {
    if (translateKey) {
      this.TranslateKey = translateKey;
    } else if (name) {
      this.TranslateKey = name;
    }
    if (name) {
      this.Name = name;
    }
    if (type) {
      this.Type = type;
    }
    this.Disabled = disabled;
  }
}

export class FilterInput {
  FilterBy!: string;

  Value: any;

  constructor(
    hasMultiValues: boolean,
    filterBy: string = '',
    value: any = null,
  ) {
    if (hasMultiValues) {
      this.Value = [];
    }
    if (filterBy) {
      this.FilterBy = filterBy;
    }
    if (value) {
      this.Value = value;
    }
  }
}

export class FieldMap {
  Field!: string;

  Control!: string;

  constructor(field?: string, control?: string) {
    if (field) this.Field = field;

    if (control) this.Control = control;
  }
}

export class EntityDetails {
  Name: string;

  AttrFieldMap!: FieldMap[];

  constructor(
    name: string = '',
    attrFieldMap: { [x: string]: string } | undefined = undefined,
  ) {
    this.Name = name;
    if (attrFieldMap) {
      this.AttrFieldMap = Object.keys(attrFieldMap).map((key) => {
        const fieldMap = new FieldMap();
        fieldMap.Field = key;
        fieldMap.Control = attrFieldMap[key];
        return fieldMap;
      });
    }
  }
}
