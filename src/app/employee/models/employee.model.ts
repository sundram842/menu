import { Injectable } from '@angular/core';
import { Adapter } from '../../global/utils/adapter';

export class BasicEmployeeDetail {
  id!: number;

  firstName!: string;

  lastName!: string;

  displayName!: string;
}

export interface RecordUpdateInfo {
  createdAt?: Date;
  createdBy?: BasicEmployeeDetail;
  lastUpdatedAt?: Date;
  lastUpdatedBy?: BasicEmployeeDetail;
}

export class Employee extends BasicEmployeeDetail implements RecordUpdateInfo {
  createdAt?: Date;

  createdBy?: BasicEmployeeDetail;

  lastUpdatedAt?: Date;

  lastUpdatedBy?: BasicEmployeeDetail;
}

@Injectable({
  providedIn: 'root',
})
export class BasicEmployeeDetailAdapter
implements Adapter<BasicEmployeeDetail> {
  adapt(item: any): BasicEmployeeDetail {
    const obj: BasicEmployeeDetail = new BasicEmployeeDetail();
    obj.id = item.id;
    obj.firstName = item.firstName;
    obj.lastName = item.lastName;
    obj.displayName = item.displayName;
    return obj;
  }
}
