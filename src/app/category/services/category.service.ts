import {
  BasicCategoryDetail,
  BasicCategoryDetailAdapter,
  CategoryTree,
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
  urlConstants,
  UrlConstants,
} from 'src/app/constants/urlConstants';
import { environment } from 'src/environments/environment';
import { cn, pn } from '../components/category-tree/category-tree.component';
export interface CategoryResponse {
  success: boolean;
  data?: CategoryTree[];
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  private apiUrl!: string;

  constructor(
    // @Inject(URL_CONSTANTS_TOKEN) private readonly urlConstants: UrlConstants,
    private readonly http: HttpClient,
    private readonly basicCategoryDetailAdapter: BasicCategoryDetailAdapter,
  ) {
    if (!environment.apiUrl) {
      console.error('apiUrl is missing in environment');
    }
    this.apiUrl = environment.apiUrl;
  }

  getCategories(): Observable<CategoryResponse> {
    const url = `${this.apiUrl}${urlConstants.getCategory}`;
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
        if(environment.useMockApi){
          return of({
            success: true,
            data: pn.map((item) =>
              this.basicCategoryDetailAdapter.adapt(item),
            ),
          })
        }
        return of({
          success: false,
          message: errorResponse?.error?.errors[0]?.code,
        });
      }),
    );
  }

  getSubCategories(subCategoryId:any): Observable<CategoryResponse> {
    const url = `${this.apiUrl}${urlConstants.getCategory}/${subCategoryId}/${urlConstants.subCategory}`;
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
        if(environment.useMockApi){
          return of({
            success: true,
            data: cn.map((item) =>
              this.basicCategoryDetailAdapter.adapt(item),
            ),
          })
        }
        return of({ 
          success: false,
          message: errorResponse?.error?.errors[0]?.code,
        });
      }),
    );
  }
}
