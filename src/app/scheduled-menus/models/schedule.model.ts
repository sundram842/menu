import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/global/utils/adapter';

export class ScheduleItem {
  id!: string;

  menuItemId!: string;

  quantity!: number;
}

export class ScheduleDetailMenu {
  id!: string;

  name!: string;

  createdAt!: Date;

  lastModifiedAt?: Date;

  createdBy?: string;

  lastModifiedBy?: string;

  groupId?: string;

  bcId!: string;

  date!: Date;

  totalItems?: number;

  status?: string;

  scheduleMenuItems!: ScheduleItem[];
}
  
@Injectable({ providedIn: 'root' })
export class ScheduleMenuDetailsAdapter implements Adapter<ScheduleDetailMenu> {
  adapt(data: any): ScheduleDetailMenu {
    const items = new ScheduleDetailMenu();
    try {
      items.id = data?.id;
      items.name = data?.name ?? '-';
      items.createdAt = new Date(data?.created_at);
      items.lastModifiedAt =  new Date(data?.last_modified_at);
      items.createdBy = data?.created_by ?? '-';
      items.lastModifiedBy = data?.last_modified_by ?? '-';
      items.groupId = data?.groupId ?? null;
      items.bcId = data?.bcId ?? '-';
      items.date = new Date(data?.date);
      items.status = data?.status;
      items.totalItems = data?.scheduleMenuItem?.length ?? 0;
      items.scheduleMenuItems = data?.scheduleMenuItem?.map((item: any) => ({
        id: item?.id ?? '-',
        menuItemId: item?.menuItemId ?? '-',
        quantity: item?.quantity ?? 0,
      })) ?? [];
    } catch (error) {
      console.log(error);
    }
  
    return items;
  }
}
  