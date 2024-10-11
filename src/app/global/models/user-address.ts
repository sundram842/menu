import { Injectable } from '@angular/core';
import { Adapter } from '../utils/adapter';

export class UserAddress {
  address1!: string;

  address2?: string;

  city!: string;

  zipCode!: string;

  stateProvince!: string;
}

@Injectable({
  providedIn: 'root',
})
export class UserAddressAdapter implements Adapter<UserAddress> {
  adapt(data: any): UserAddress {
    const userDetail = new UserAddress();
    try {
      userDetail.address1 = data?.address1;
      userDetail.address2 = data?.address2;
      userDetail.city = data?.city;
      userDetail.zipCode = data?.zipCode;
      userDetail.stateProvince = data?.stateProvince;
    } catch (error) {
      console.log(error);
    }
    return userDetail;
  }
}
