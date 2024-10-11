import { Injectable } from '@angular/core';
import { Address, AddressAdapter } from './address';
import { Adapter } from 'src/app/global/utils/adapter';

export class BusinessCenter {
  id!: string;

  title!: string;

  description!: string;

  logo!: string;

  status!: string;

  mobile!: string;

  email!: string;

  createdAt!: string;

  createdBy!: string;

  updatedAt!: string;

  updatedBy!: string;

  address!: Address;
}

@Injectable({
  providedIn: 'root',
})
export class BusinessCenterAdapter implements Adapter<BusinessCenter> {
  adapt(data: any): BusinessCenter {
    const businessCenter = new BusinessCenter();
    try {
      businessCenter.id = data?.id;
      businessCenter.title = data?.title;
      businessCenter.description = data?.description;
      businessCenter.logo = data?.logo;
      businessCenter.status = data?.status;
      businessCenter.mobile = data?.mobile;
      businessCenter.email = data?.email;
      businessCenter.createdAt = data?.createdAt;
      businessCenter.createdBy = data?.createdBy;
      businessCenter.updatedAt = data?.updatedAt;
      businessCenter.updatedBy = data?.updatedBy;
      businessCenter.address = data?.address
        ? new AddressAdapter().adapt(data.address)
        : new Address();
    } catch (error) {
      console.log(error);
    }
    return businessCenter;
  }
}
