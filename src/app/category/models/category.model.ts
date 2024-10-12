import { Injectable } from '@angular/core';
import {
  BasicEmployeeDetail,
  RecordUpdateInfo,
} from 'src/app/employee/models/employee.model';
import { Adapter } from 'src/app/global/utils/adapter';

export class BasicCategoryDetail {
  id!: number | string;

  name!: string;
}

export class CategoryTree extends BasicCategoryDetail {
  level!: number;
  businessCenter?: string;
  isLoading?: boolean = false;
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
implements Adapter<CategoryTree> {
  adapt(data: any): CategoryTree {
    const basicCategoryDetail = new CategoryTree();
    try {
      basicCategoryDetail.id = data?.id;
      basicCategoryDetail.name = data?.name;
      basicCategoryDetail.level = data?.level;
    } catch (error) {
      console.log(error);
    }
    return basicCategoryDetail;
  }
}
