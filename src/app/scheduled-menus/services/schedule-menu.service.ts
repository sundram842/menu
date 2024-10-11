import { HttpClient, HttpErrorResponse, HttpResponse, HttpStatusCode } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  URL_CONSTANTS_TOKEN,
  UrlConstants,
} from 'src/app/constants/urlConstants';
import { environment } from 'src/environments/environment';
import { menuItemsMockResponse } from 'src/mock-api/devices';
import {
  ScheduleMenuItem,
  ScheduleMenuItemAdapter,
} from '../models/schedule-menu-item.model';
import { CreateSchedule } from '../models/schedule.constant';
import { ScheduleDetailMenu, ScheduleMenuDetailsAdapter } from '../models/schedule.model';
import { MenuItem, MenuItemAdapter } from 'src/app/menu-item/models/menu-item.model';
export interface ScheduleMenuResponse {
  success: boolean;
  data?: ScheduleMenuItem[];
  message?: string;
}

export interface ScheduleMenuDetailsResponse {
  success: boolean;
  data?: ScheduleDetailMenu;
  message?: string;
}

export interface CreateScheduleMenuResponse {
  success: boolean;
  message?: string
}

export interface DeactivatedResponse {
  success: boolean;
}

export interface ActivatedResponse {
  success: boolean;
}

export interface MenuItemsResponse {
  success: boolean;
  data?: MenuItem[];
  message?: string;
}


@Injectable({
  providedIn: 'root',
})
export class ScheduleMenuService {
  private apiUrl!: string;

  constructor(
    private readonly http: HttpClient,
    private readonly scheduleMenuItemAdapter: ScheduleMenuItemAdapter,
    private readonly scheduleMenuDetailsAdapter: ScheduleMenuDetailsAdapter,
    @Inject(URL_CONSTANTS_TOKEN) private readonly urlConstants: UrlConstants,
    private readonly scheduleMenuItems: MenuItemAdapter,
  ) {
    if (!environment.apiUrl) {
      console.error('apiUrl is missing in environment');
    }
    this.apiUrl = environment.apiUrl;
  }

  getScheduleMenuItems(): Observable<ScheduleMenuResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: (response.body?.data as any[])?.map((item) =>
              this.scheduleMenuItemAdapter.adapt(item),
            ),
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (environment?.useMockApi) {
          return of({
            success: true,
            data: menuItemsMockResponse?.map((details: any) =>
              this.scheduleMenuItemAdapter.adapt(details),
            ),
          });
        }
        return of({
          success: false,
          message: error.error.errors[0].code,
        });
      }),
    );
  }

  getScheduleMenuItemsById(id: string): Observable<ScheduleMenuDetailsResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}/${id}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: this.scheduleMenuDetailsAdapter.adapt(response?.body?.data),
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return of({
          success: false,
          message: error.error.errors[0].code,
        });
      }),
    );
  }

  public createDevice(data: CreateSchedule): Observable<CreateScheduleMenuResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}`;
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

  public activateDevice(id: string): Observable<ActivatedResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}/${id}/activate`;
    return this.http.put(url, '', { observe: 'response' }).pipe(
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
      catchError((error: HttpErrorResponse) => {
        return of({
          success: false,
          message: error.error.errors[0].code,
        });
      }),
    );
  }

  public DeactivateDevice(id: string): Observable<DeactivatedResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}/${id}/deactivate`;
    return this.http.put(url, '', { observe: 'response' }).pipe(
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
      catchError((error: HttpErrorResponse) => {
        return of({
          success: false,
          message: error.error.errors[0].code,
        });
      }),
    );
  }

  getScheduledMenuDetails(id: string): Observable<MenuItemsResponse> {
    const url = `${this.apiUrl}${this.urlConstants.scheduleMenu}/${id}/${this.urlConstants.getMenuItems}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: response?.body?.data ?  response?.body?.data.map((values: any) => this.scheduleMenuItems.adapt(values)) : [],
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        return of({
          success: false,
          message: error.error.errors[0].code,
        });
      }),
    );
  }
}
