import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/global/utils/adapter';

export class ScheduleMenuItem {
  id!: string;

  name!: string;

  lastUsedDate!: Date;

  nextUsedDate!: Date;

  groupId!: string;

  totalItems!: number;

  scheduledDate!: Date;

  status!: string;
}
@Injectable({ providedIn: 'root' })
export class ScheduleMenuItemAdapter implements Adapter<ScheduleMenuItem> {
  adapt(data: any): ScheduleMenuItem {
    const obj = new ScheduleMenuItem();
    try {
      obj.id = data?.id;
      obj.groupId = data?.groupId ?? '-';
      obj.lastUsedDate = new Date(data?.lastUsedDate);
      obj.nextUsedDate = new Date(data?.nextUsedDate);
      obj.totalItems = data?.totalItems ?? '-';
      obj.name = data?.name ?? '-';
      obj.scheduledDate = new Date(data?.scheduledDate);
      obj.status = data?.status;
    } catch (error) {
      console.log(error);
    }

    return obj;
  }
}
