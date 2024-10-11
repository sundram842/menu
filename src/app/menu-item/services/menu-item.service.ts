import {
  MenuItem,
  MenuItemByIdResponse,
  PrimaryIngredient,
  PrimaryIngredientAdapter,
} from './../models/menu-item.model';
import { Inject, Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { environment } from '../../../environments/environment';

import { MenuItemAdapter, BasicMenuItem } from '../models/menu-item.model';

import { catchError, map } from 'rxjs/operators';
import { Observable, of } from 'rxjs';
import { MenuItemsResponse } from '../models/menu-item.model';
import { TranslateService } from '@ngx-translate/core';
import { menuItemsMockResponse } from 'src/mock-api/devices';
import {
  URL_CONSTANTS_TOKEN,
  UrlConstants,
} from 'src/app/constants/urlConstants';

export interface AssignMenuItemsResponse {
  success: boolean;
  responseData?: BasicMenuItem[];
}

export interface UnassignedDeviceResponse {
  success: boolean;
}

export interface UpdateMenuResponse {
  success: boolean;
  message?: string;
}

export interface PrimaryIngredientResponse {
  success: boolean;
  data?: PrimaryIngredient[];
  message?: string;
}

export interface CreateMenuItemResponse {
  success: boolean;
  message?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MenuItemService {
  private apiUrl!: string;

  constructor(
    private readonly http: HttpClient,
    private readonly menuItemAdapter: MenuItemAdapter,
    private translateService: TranslateService,
    @Inject(URL_CONSTANTS_TOKEN) private readonly urlConstants: UrlConstants,
    private readonly primaryIngredientAdapter: PrimaryIngredientAdapter,
  ) {
    if (!environment.apiUrl) {
      console.error('apiUrl is missing in environment');
    }
    this.apiUrl = environment.apiUrl;
  }

  public getMenuItems(): Observable<MenuItemsResponse> {
    return this.http
      .get(`${this.apiUrl}${this.urlConstants.getMenuItems}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === HttpStatusCode.Ok) {
            return {
              success: true,
              data: (response.body?.data as any[])?.map((item) =>
                this.menuItemAdapter.adapt(item),
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
                this.menuItemAdapter.adapt(details),
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

  public getMenuItemsById(id: string): Observable<MenuItemByIdResponse> {
    return this.http
      .get(`${this.apiUrl}${this.urlConstants.getMenuItems}/${id}`, {
        observe: 'response',
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === HttpStatusCode.Ok) {
            return {
              success: true,
              data: this.menuItemAdapter.adapt(response?.body?.data),
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


  public getMenuItemsBykeyWard(
    keyWord?: string,
  ): Observable<MenuItemsResponse> {
    let params;
    if (keyWord) params = new HttpParams().append('keyword', keyWord);
    return this.http
      .get(`${this.apiUrl}${this.urlConstants.getMenuItemsByKeyWord}`, {
        observe: 'response',
        params,
      })
      .pipe(
        map((response: HttpResponse<any>) => {
          if (response.status === HttpStatusCode.Ok) {
            return {
              success: true,
              data: (response.body?.data as any[])?.map((item) =>
                this.menuItemAdapter.adapt(item),
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
                this.menuItemAdapter.adapt(details),
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

  public assignItems(
    menuIds: string[],
    id: string,
  ): Observable<UnassignedDeviceResponse> {
    const url = `${this.apiUrl}device/${id}/menu-item/assign`;
    return this.http
      .post(url, { menuItems: menuIds }, { observe: 'response' })
      .pipe(
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
        catchError(() => {
          return of({
            success: false,
            message: this.translateService.instant('GLOBAL.ERROR'),
          });
        }),
      );
  }

  public unassignItems(
    menuIds: string[],
    id: string,
  ): Observable<UnassignedDeviceResponse> {
    const url = `${this.apiUrl}device/${id}/menu-item/unassign`;
    return this.http
      .post(url, { menuItems: menuIds }, { observe: 'response' })
      .pipe(
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

  public getPrimaryIngredients(): Observable<PrimaryIngredientResponse> {
    const url = `${this.apiUrl}${this.urlConstants.getMenuItems}/${this.urlConstants.getPrimaryIngredients}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: (response.body?.data as any[])?.map((item) =>
              this.primaryIngredientAdapter.adapt(item),
            ),
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

  createMenuItem(menuItem: MenuItem):Observable<CreateMenuItemResponse> {
    const url = `${this.apiUrl}${this.urlConstants.getMenuItems}`;
    return this.http.post(url, menuItem, { observe: 'response' }).pipe(
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

  updateMenuItem(menuItem: MenuItem, id: string):Observable<CreateMenuItemResponse> {
    const url = `${this.apiUrl}${this.urlConstants.getMenuItems}/${id}`;
    return this.http.put(url, menuItem, { observe: 'response' }).pipe(
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


  public updateScheduleMenu(id:string, body:any): Observable<UpdateMenuResponse> {
    const url = `${this.apiUrl}${this.urlConstants.updateScheduleMenu}/${id}`;
    return this.http.put(url, body, { observe: 'response' }).pipe(
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
