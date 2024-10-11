import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DeviceAdapter, Devices } from '../models/devices-models';
import { Observable, of, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { deviceById, devices } from 'src/mock-api/devices';
import { DeactivateDevice } from '../models/device-constant';

export interface DevicesListResponse {
  success: boolean;
  deviceList?: Devices[];
  message?: string;
}

export interface DevicesListByIdResponse {
  success: boolean;
  deviceList?: Devices;
  message?: string;
}

export interface CreateDeviceResponse {
  success: boolean;
  message?: string;
}

export interface DeactivatedDeviceResponse {
  success: boolean;
}

export interface MenuItemsResponse {
  success: boolean;
  menuItems?: Devices;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class DevicesService {
  public apiUrl = environment.apiUrl;

  private dialogClosedSub = new Subject<void>();

  public dialogClose = this.dialogClosedSub.asObservable();

  constructor(
    private http: HttpClient,
    private deviceAdapter: DeviceAdapter,
    private translateService: TranslateService,
  ) {}

  
  public triggerDialogClosed() {
    this.dialogClosedSub.next();
  }

  public getDevicesList(): Observable<DevicesListResponse> {
    const url = `${this.apiUrl}device`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          const data = response?.body?.data;
          return {
            success: true,
            deviceList: data?.map((details: any) =>
              this.deviceAdapter.adapt(details),
            ),
          };
        } else {
          return {
            success: true,
            deviceList: [],
          };
        }
      }),
      catchError(() => {
        if (environment.useMockApi) {
          return of({
            success: true,
            deviceList: devices?.map((details: any) =>
              this.deviceAdapter.adapt(details),
            ),
          });
        } else {
          return of({
            success: false,
            message: this.translateService.instant('GLOBAL.ERROR'),
          });
        }
      }),
    );
  }

  public getDevicesListById(id: string): Observable<DevicesListByIdResponse> {
    const url = `${this.apiUrl}device/${id}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          const data = response?.body?.data;
          return {
            success: true,
            deviceList: this.deviceAdapter.adapt(data),
          };
        } else {
          return {
            success: true,
          };
        }
      }),
      catchError(() => {
        if (environment.useMockApi) {
          return of({
            success: true,
            deviceList: this.deviceAdapter.adapt(deviceById),
          });
        } else {
          return of({
            success: false,
            message: this.translateService.instant('GLOBAL.ERROR'),
          });
        }
      }),
    );
  }

  public createDevice(data: Devices): Observable<CreateDeviceResponse> {
    const url = `${this.apiUrl}device`;
    return this.http.post(url, data, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Created) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of({
          success: false,
          message: errorResponse?.error?.errors[0]?.code,
        });
      }),
    );
  }

  public updateDevice(
    data: Devices,
    id: string,
  ): Observable<CreateDeviceResponse> {
    const URL = `${this.apiUrl}device/${id}`;
    return this.http.put(URL, data, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((errorResponse: HttpErrorResponse) => {
        return of({
          success: false,
          message: errorResponse?.error?.errors[0]?.code,
        });
      }),
    );
  }

  public getAssignedMenuItems(id: string): Observable<MenuItemsResponse> {
    const url = `${this.apiUrl}device/${id}/menu-items`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          const data = response?.body?.data;
          return {
            success: true,
            menuItems: this.deviceAdapter.adapt(data),
          };
        } else {
          return {
            success: true,
          };
        }
      }),
      catchError(() => {
        if (environment.useMockApi) {
          return of({
            success: true,
            menuItems: this.deviceAdapter.adapt(deviceById),
          });
        } else {
          return of({
            success: false,
            message: this.translateService.instant('GLOBAL.ERROR'),
          });
        }
      }),
    );
  }

  public activateDevice(id: string): Observable<DeactivatedDeviceResponse> {
    const url = `${this.apiUrl}device/${id}/enable`;
    return this.http.patch(url, '', { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError(() => {
        return of({
          success: false,
          message: this.translateService.instant('GLOBAL.ERROR'),
        });
      }),
    );
  }

  public deactivateDevice(
    deviceData: DeactivateDevice,
    id: string,
  ): Observable<DeactivatedDeviceResponse> {
    const url = `${this.apiUrl}device/${id}/disable`;
    return this.http.patch(url, deviceData, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError(() => {
        return of({
          success: false,
          message: this.translateService.instant('GLOBAL.ERROR'),
        });
      }),
    );
  }
}
