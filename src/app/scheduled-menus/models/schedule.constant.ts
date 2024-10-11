import { MenuItem } from 'src/app/menu-item/models/menu-item.model';

export enum MenuItemsApiErrors {
  CONST_ERROR_MENU_ITEM_DETAILS_NOT_FOUND = 'error_menu_item_details_not_found',
}

export enum ScheduleStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export class MenuItemQuantity {
  menuItemId!: string;

  quantity!: number;
}
  
export class CreateSchedule {
  name!: string;

  date!: Date[];

  menu_items?: MenuItemQuantity[];
  
  static BindForm(data: any, menuItemIds:{ id: string; quantity: number }[], selectedDates: Date[]): CreateSchedule {
    const createSchedule = new CreateSchedule();
    createSchedule.name = data?.menuName;
    createSchedule.date = selectedDates;
    createSchedule.menu_items = menuItemIds.map((menuItemId) => ({
      menuItemId: menuItemId.id,
      quantity: menuItemId.quantity,
    }));
  
    return createSchedule;
  }
}

export class UpdateMenuBody {
  name!:string;

  date!:string;

  menu_items!:MenuItemQuantity[];

  static BindForm(data: any, menuItemIds:{ id: string; quantity: number }[] | MenuItem[]) {
    const updateMenuBody = new UpdateMenuBody();
    updateMenuBody.name = data?.name;
    updateMenuBody.date = data?.date;
    updateMenuBody.menu_items = menuItemIds.map((menuItemId:any) => ({
      menuItemId: menuItemId.id,
      quantity: menuItemId.quantity,
    }));
    return updateMenuBody;
  }
}
  