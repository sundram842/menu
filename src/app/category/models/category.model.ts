import { Injectable } from '@angular/core';
import {
  BasicEmployeeDetail,
  RecordUpdateInfo,
} from 'src/app/employee/models/employee.model';
import { Adapter } from 'src/app/global/utils/adapter';

export class BasicCategoryDetail {
  id!: number;

  name!: string;
}

export class Category extends BasicCategoryDetail implements RecordUpdateInfo {
  subCategoryId?: number;

  subCategoryInfo?: Category;

  createdAt?: Date;

  createdBy?: BasicEmployeeDetail;

  lastUpdatedAt?: Date;

  lastUpdatedBy?: BasicEmployeeDetail;
}
@Injectable({
  providedIn: 'root',
})
export class BasicCategoryDetailAdapter
implements Adapter<BasicCategoryDetail> {
  adapt(data: any): BasicCategoryDetail {
    const basicCategoryDetail = new BasicCategoryDetail();
    try {
      basicCategoryDetail.id = data?.id;
      basicCategoryDetail.name = data?.name;
    } catch (error) {
      console.log(error);
    }
    return basicCategoryDetail;
  }
}
