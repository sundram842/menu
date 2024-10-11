export enum DeviceStatus {
  ACTIVATE = 'active',
  INACTTIVE = 'inactive',
}

export enum ItemContext {
  ITEMCONTEXT = 'Items',
}

export class DeactivateDevice {
  deviceName?: string;

  ipAddress?: string;

  macAddress?: string;

  static BindForm(
    ipAddress: string,
    macAddress: string,
    displayName: string,
  ): DeactivateDevice {
    const setDisable = new DeactivateDevice();
    setDisable.deviceName = ipAddress;
    setDisable.ipAddress = macAddress;
    setDisable.macAddress = displayName;
    return setDisable;
  }
}
