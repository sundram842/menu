import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import {
  BusinessCenter,
  BusinessCenterAdapter,
} from '../models/business-center';
import { Observable, of } from 'rxjs';
import { businessCenter } from 'src/mock-api/mock-data';
import { environment } from 'src/environments/environment';
import { BusinessCenterPostBody } from '../constant/business-constent';

export interface BusinessCenterResponse {
  success: boolean;
  businessCenter?: BusinessCenter[];
  message?: string;
}

export interface ChangeBusinessCenterResponse {
  success: boolean;
  message?: string;
  id?: string;
}
@Injectable({
  providedIn: 'root',
})
export class BusinessCenterService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly businessCenterAdapter: BusinessCenterAdapter,
  ) {}

  public getBusinessCenter(): Observable<BusinessCenterResponse> {
    const url = `${this.apiUrl}employee/business-centers`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            businessCenter: response?.body?.data?.map((location: any) =>
              this.businessCenterAdapter.adapt(location),
            ),
          };
        } else {
          return {
            success: false,
            businessCenter: [],
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (environment.useMockApi) {
          return of({
            success: true,
            businessCenter: businessCenter.data.item.map((location: any) =>
              this.businessCenterAdapter.adapt(location),
            ),
          });
        }
        return of({
          success: false,
          message: error?.error?.errors[0]?.code,
        });
      }),
    );
  }

  public changeBusinessCenter(
    id: BusinessCenterPostBody,
  ): Observable<ChangeBusinessCenterResponse> {
    const url = `${this.apiUrl}employee/change-businesscenter`;
    return this.http.patch(url, id, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            id: response?.body?.data?.bcId,
          };
        } else {
          return {
            success: false,
          };
        }
      }),
      catchError((error: HttpErrorResponse) => {
        if (environment.useMockApi) {
          return of({
            success: true,
          });
        }
        return of({
          success: false,
          message: error?.error?.errors[0]?.code,
        });
      }),
    );
  }
}
