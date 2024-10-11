import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/global/utils/adapter';

export class Address {
  locationId!: number;

  slug!: string;

  displayName!: string;

  suite!: string;

  street!: string;

  city!: string;

  stateCode!: string;

  postalCode!: string;

  countryCode!: string;

  latitude!: string;

  longitude!: string;

  landmark!: string;

  locationFullName!: string;
}

@Injectable({
  providedIn: 'root',
})
export class AddressAdapter implements Adapter<Address> {
  adapt(data: any): Address {
    const address = new Address();
    try {
      address.locationId = data?.locationId;
      address.slug = data?.slug;
      address.displayName = data?.displayName;
      address.suite = data?.suite;
      address.street = data?.street;
      address.city = data?.city;
      address.stateCode = data?.stateCode;
      address.postalCode = data?.postalCode;
      address.countryCode = data?.countryCode;
      address.latitude = data?.latitude;
      address.longitude = data?.longitude;
      address.landmark = data?.landmark;
    } catch (error) {
      console.log(error);
    }
    return address;
  }
}
