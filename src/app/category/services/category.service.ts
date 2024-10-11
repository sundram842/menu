import {
  BasicCategoryDetail,
  BasicCategoryDetailAdapter,
} from './../models/category.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {
  URL_CONSTANTS_TOKEN,
  UrlConstants,
} from 'src/app/constants/urlConstants';
import { environment } from 'src/environments/environment';
export interface CategoryResponse {
  success: boolean;
  data?: BasicCategoryDetail[];
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl!: string;

  constructor(
    @Inject(URL_CONSTANTS_TOKEN) private readonly urlConstants: UrlConstants,
    private readonly http: HttpClient,
    private readonly basicCategoryDetailAdapter: BasicCategoryDetailAdapter,
  ) {
    if (!environment.apiUrl) {
      console.error('apiUrl is missing in environment');
    }
    this.apiUrl = environment.apiUrl;
  }

  getCategories(): Observable<CategoryResponse> {
    const url = `${this.apiUrl}${this.urlConstants.getCategory}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: (response.body?.data as any[])?.map((item) =>
              this.basicCategoryDetailAdapter.adapt(item),
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

  getSubCategories(subCategoryId: Number): Observable<CategoryResponse> {
    const url = `${this.apiUrl}${this.urlConstants.getCategory}/${subCategoryId}/${this.urlConstants.subCategory}`;
    return this.http.get(url, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          return {
            success: true,
            data: (response.body?.data as any[])?.map((item) =>
              this.basicCategoryDetailAdapter.adapt(item),
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
}
