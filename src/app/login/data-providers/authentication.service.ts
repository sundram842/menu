import {
  HttpClient,
  HttpErrorResponse,
  HttpResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { LoginPostBody } from '../constant/login-constant';
import { LoginAdapter } from '../models/logindetails';
import { CookieService } from 'ngx-cookie-service';
export interface AuthenticationResponse {
  success: boolean;
  message?: string;
}
@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private readonly http: HttpClient,
    private readonly cookieService: CookieService,
  ) {}

  public authentication(
    postBody: LoginPostBody,
  ): Observable<AuthenticationResponse> {
    const url = `${this.apiUrl}auth/login`;

    return this.http.post(url, postBody, { observe: 'response' }).pipe(
      map((response: HttpResponse<any>) => {
        if (response.status === HttpStatusCode.Ok) {
          const data = new LoginAdapter().adapt(response?.body?.data);
          this.setCookies(data);
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

  //Function to set the cookies from login response
  setCookies(login: any) {
    const loginCookies: string[] = Object.keys(login);
    loginCookies.forEach((cookieKey) => {
      const cookieValue = login[cookieKey]; // Get the value for the current key
      this.cookieService.set(cookieKey, cookieValue); // Set the key-value pair in the cookie service
      localStorage.setItem(cookieKey, cookieValue); // Set the key-value pair in the cookie service
    });
  }

  getCookie(cookieName: string) {
    return this.cookieService.get(cookieName);
  }
}
