import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import {
  BusinessCenter,
  BusinessCenterAdapter,
} from 'src/app/business-center/models/business-center';
import { environment } from 'src/environments/environment';
import { BusinessCenterDetail } from 'src/mock-api/mock-data';
import { UserDetail, UserDetailAdapter } from '../../models/header';
export interface BusinessCenterDetailResponse {
  success: boolean;
  businessCenterDetail?: BusinessCenter;
  message?: string;
}

export interface LogoutResponse {
  success: boolean;
  message?: string;
}

export interface ToggleBusinessCenterResponse {
  success: boolean;
  message?: string;
}
export interface UserDetailsResponse {
  success: boolean;
  userDetails?: UserDetail;
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly businessCenterAdapter: BusinessCenterAdapter,
    private readonly userDetailAdapter: UserDetailAdapter,
  ) {}

  public getBusinessCenterDetail(
    id: string,
  ): Observable<BusinessCenterDetailResponse> {
    const url = `${this.apiUrl}business-center/${id}`;
    const headers = new HttpHeaders({ id: id });
    return this.http.get(url, { observe: 'response', headers: headers }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            businessCenterDetail: this.businessCenterAdapter.adapt(
              response?.body?.data,
            ),
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
            businessCenterDetail: this.businessCenterAdapter.adapt(
              BusinessCenterDetail.data,
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

  public pauseBusinessCenter(
    id: string,
  ): Observable<ToggleBusinessCenterResponse> {
    const url = `${this.apiUrl}business-center/${id}/pause`;
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

  public playBusinessCenter(
    id: string,
  ): Observable<ToggleBusinessCenterResponse> {
    const url = `${this.apiUrl}business-center/${id}/enable`;
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

  public logout(): Observable<LogoutResponse> {
    const url = `${this.apiUrl}auth/logout`;
    return this.http.post(url, {}, { observe: 'response' }).pipe(
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

  public getUserDetailsById(
    id: string,
  ): Observable<UserDetailsResponse> {
    const url = `${this.apiUrl}employee/${id}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            userDetails: this.userDetailAdapter.adapt(
              response?.body?.data,
            ),
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
            UserDetails: this.userDetailAdapter.adapt(
              BusinessCenterDetail.data,
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
}
