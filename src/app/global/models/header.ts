import { Injectable } from '@angular/core';
import { UserAddress, UserAddressAdapter } from './user-address';
import { Adapter } from '../utils/adapter';

export class UserDetail {
  id!: string;

  firstName!: string;

  lastName!: string;

  doj?: Date; // Date of joining

  dob!: Date; // Date of birth

  gender!: string;

  email!: string;

  nationality!: string;

  emergencyContact!: string;

  phoneNumber!: string;

  status!: string;

  createdAt!: string;

  createdBy!: string;

  updatedAt?: string;

  updatedBy?: string;

  bcId!: string;

  partnerId!: string;

  address!: UserAddress;
}

@Injectable({
  providedIn: 'root',
})
export class UserDetailAdapter implements Adapter<UserDetail> {
  adapt(data: any): UserDetail {
    const userDetail = new UserDetail();
    try {
      userDetail.id = data?.id;
      userDetail.firstName = data?.firstName;
      userDetail.lastName = data?.lastName;
      userDetail.doj = data?.doj;
      userDetail.dob = data?.dob;
      userDetail.gender = data?.gender;
      userDetail.email = data?.email;
      userDetail.nationality = data?.nationality;
      userDetail.emergencyContact = data?.emergencyContact;
      userDetail.phoneNumber = data?.phoneNumber;
      userDetail.status = data?.status;
      userDetail.createdAt = data?.createdAt;
      userDetail.createdBy = data?.createdBy;
      userDetail.updatedAt = data?.updatedAt;
      userDetail.updatedBy = data?.updatedBy;
      userDetail.phoneNumber = data?.phoneNumber;
      userDetail.status = data?.status;
      userDetail.address = data?.address
        ? new UserAddressAdapter().adapt(data.address)
        : new UserAddress();
    } catch (error) {
      console.log(error);
    }
    return userDetail;
  }
}