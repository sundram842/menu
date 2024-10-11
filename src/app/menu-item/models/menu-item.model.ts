import { Injectable } from '@angular/core';
import { Adapter } from '../../global/utils/adapter';
import {
  RecordUpdateInfo,
  BasicEmployeeDetail,
  BasicEmployeeDetailAdapter,
} from '../../employee/models/employee.model';
import {
  BasicCategoryDetail,
  BasicCategoryDetailAdapter,
} from '../../category/models/category.model';

export interface MenuItemsResponse {
  success: boolean;
  data?: MenuItem[];
  message?: string;
}

export interface MenuItemByIdResponse {
  success: boolean;
  data?: MenuItem;
  message?: string;
}
export class BasicMenuItem {
  id!: string;

  displayName!: string;

  name!: string;

  status!: string;

  createdAt?: Date;
}

export class BasicMenuItemsAdapter implements Adapter<BasicMenuItem> {
  adapt(data: any): BasicMenuItem {
    const items = new BasicMenuItem();
    try {
      items.id = data?.id;
      items.displayName = data?.displayName;
      items.name = data?.name;
      items.status = data?.status;
      items.createdAt = new Date(data?.createdAt);
    } catch (e) {
      console.log(e);
    }
    return items;
  }
}
export class MenuItem extends BasicMenuItem implements RecordUpdateInfo {
  sku!: string;

  primaryIngredient!: string;

  primaryIngredientInfo?: PrimaryIngredient;

  primaryCategoryId?: number;

  secondaryCategoryId?: number;

  primaryCategoryInfo?: BasicCategoryDetail;

  secondaryCategoryInfo?: BasicCategoryDetail;

  createdBy?: BasicEmployeeDetail;

  lastUpdatedAt?: Date;

  lastUpdatedBy?: BasicEmployeeDetail;

  canBeModifier?: boolean;

  unitOfMeasurement?: string;

  description?: string;

  sellingPrice?: number;

  basePrice?: number;

  code?: string;

  categoryId?: string;

  subCategoryId?: string;

  barCode?: string;

  quantity?: number;

  static BindForm(createMenuItem: any): MenuItem {
    const menuItem = new MenuItem();
    menuItem.sku = createMenuItem?.sku;
    menuItem.code = createMenuItem?.code;
    menuItem.categoryId = createMenuItem?.category;

    menuItem.subCategoryId = createMenuItem?.subCategory;

    menuItem.name = createMenuItem?.name;
    menuItem.displayName = createMenuItem?.displayName;
    menuItem.canBeModifier = createMenuItem?.canBeModifier;
    menuItem.unitOfMeasurement = createMenuItem?.unitOfMeasurement;
    menuItem.basePrice = createMenuItem?.basePrice;
    menuItem.sellingPrice = createMenuItem?.sellingPrice;
    menuItem.description = createMenuItem?.description;
    menuItem.primaryIngredient = createMenuItem?.primaryIngredient;
    menuItem.barCode = createMenuItem?.barCode;
    return menuItem;
  }
}

export class PrimaryIngredient {
  id!: string;

  title!: string;

  displayName!: string;

  status!: string;
}

@Injectable({
  providedIn: 'root',
})
export class PrimaryIngredientAdapter implements Adapter<PrimaryIngredient> {
  adapt(item: any): PrimaryIngredient {
    const primaryIngredient: PrimaryIngredient = new PrimaryIngredient();
    try {
      primaryIngredient.id = item?.id;
      primaryIngredient.title = item?.title ?? '-';
      primaryIngredient.displayName = item?.displayName ?? '-';
      primaryIngredient.status = item?.status ?? '-';
    } catch (e: any) {
      console.log(e);
    }
    return primaryIngredient;
  }
}
@Injectable({
  providedIn: 'root',
})
export class MenuItemAdapter implements Adapter<MenuItem> {
  adapt(item: any): MenuItem {
    const obj: MenuItem = new MenuItem();
    const basicEmployeeDetailAdapter = new BasicEmployeeDetailAdapter();
    const basicCategoryDetailAdapter = new BasicCategoryDetailAdapter();
    const primaryIngredient = new PrimaryIngredientAdapter();
    try {
      obj.id = item?.id;
      obj.sku = item?.sku;
      obj.code = item?.code;
      obj.displayName = item?.displayName ?? '-';
      obj.name = item?.name ?? '-';
      obj.primaryIngredient = item?.primaryIngredient
        ? primaryIngredient.adapt(item?.primaryIngredient)?.id
        : '-';

      obj.primaryCategoryId = item?.primaryCategoryId;
      obj.secondaryCategoryId = item?.secondaryCategoryId;
      obj.createdAt = item?.createdAt;
      obj.lastUpdatedAt = item?.lastUpdatedAt;
      obj.createdBy = item?.createdBy
        ? basicEmployeeDetailAdapter.adapt(item?.createdBy)
        : undefined;
      obj.lastUpdatedBy = item?.lastUpdatedBy
        ? basicEmployeeDetailAdapter.adapt(item?.lastUpdatedBy)
        : undefined;
      obj.status = item?.status ?? '-';
      obj.primaryCategoryInfo = item?.category
        ? basicCategoryDetailAdapter?.adapt(item?.category)
        : undefined;

      obj.secondaryCategoryInfo = item?.subCategory
        ? basicCategoryDetailAdapter?.adapt(item?.subCategory)
        : undefined;
      obj.barCode = item?.barcode;

      obj.primaryIngredientInfo = item?.primaryIngredient
        ? primaryIngredient.adapt(item?.primaryIngredient)
        : undefined;
      obj.quantity = item?.quantity;
      obj.unitOfMeasurement = item?.unitOfMeasurement;
      obj.description = item?.description;
    } catch (e) {
      console.log(e);
    }
    return obj;
  }
}
