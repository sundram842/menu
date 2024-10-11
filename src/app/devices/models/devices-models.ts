import { Injectable } from '@angular/core';
import { Adapter } from 'src/app/global/utils/adapter';
import {
  BasicMenuItem,
  BasicMenuItemsAdapter,
} from 'src/app/menu-item/models/menu-item.model';

export class BusinessCentre {
  id?: string;

  name?: string;

  location?: string;
}

export class PosClient {
  id?: string;

  name?: string;

  title?: string;
}

export class Devices {
  id!: string;

  status!: string;

  name!: string;

  make!: string;

  model!: string;

  type?: string;

  serialNumber!: string;

  deviceSerialNumber?: string;

  firmwareVersion?: string;

  connectionType?: string;

  ipAddress?: string;

  macAddress?: string;

  osCompatibility?: string;

  dateOfInstallation?: Date;

  businessCenter?: BusinessCentre;

  posClient?: PosClient;

  menuItems?: BasicMenuItem[];
}

export class BusinessCentreAdapter implements Adapter<BusinessCentre> {
  adapt(data: any): BusinessCentre {
    const centerDetails = new BusinessCentre();
    try {
      centerDetails.id = data?.id;
      centerDetails.location = data?.location;
      centerDetails.name = data?.name;
    } catch (e) {
      console.log(e);
    }

    return centerDetails;
  }
}

export class PosClientAdapter implements Adapter<PosClient> {
  adapt(data: any): PosClient {
    const clientDetails = new PosClient();
    try {
      clientDetails.id = data?.id;
      clientDetails.name = data?.name;
      clientDetails.title = data?.title;
    } catch (e) {
      console.log(e);
    }
    return clientDetails;
  }
}

export class MenuItemsAdapter implements Adapter<BasicMenuItem> {
  adapt(data: any): BasicMenuItem {
    const items = new BasicMenuItem();
    try {
      items.id = data?.id;
      items.displayName = data?.displayName;
      items.name = data?.name;
      items.status = data?.status;
    } catch (e) {
      console.log(e);
    }
    return items;
  }
}

@Injectable({
  providedIn: 'root',
})
export class DeviceAdapter implements Adapter<Devices> {
  adapt(data: any): Devices {
    const deviceDetails = new Devices();
    try {
      deviceDetails.id = data?.id;
      deviceDetails.status = data?.status;
      deviceDetails.name = data?.name;
      deviceDetails.make = data?.make;
      deviceDetails.model = data?.model;
      deviceDetails.serialNumber = data?.serialNumber;
      deviceDetails.deviceSerialNumber = data?.deviceSerialNumber;
      deviceDetails.firmwareVersion = data?.firmwareVersion;
      deviceDetails.connectionType = data?.connectionType;
      deviceDetails.ipAddress = data?.ipAddress;
      deviceDetails.macAddress = data?.macAddress;
      deviceDetails.osCompatibility = data?.osCompatibility;
      deviceDetails.dateOfInstallation = new Date(data?.dateOfInstallation);
      deviceDetails.businessCenter = new BusinessCentreAdapter().adapt(
        data?.businessCenter,
      );
      deviceDetails.posClient = new PosClientAdapter().adapt(data?.posClient);
      deviceDetails.menuItems = data?.menuItems
        ? data?.menuItems.map((value: BasicMenuItem) =>
          new BasicMenuItemsAdapter().adapt(value),
        )
        : [];
    } catch (e) {
      console.log(e);
    }

    return deviceDetails;
  }
}
