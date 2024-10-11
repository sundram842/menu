import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { CookieService } from 'ngx-cookie-service';
import { AuthenticationService } from 'src/app/login/data-providers/authentication.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private apiUrl: string = environment.apiUrl;

  constructor(
    private cookieService: CookieService,
    private readonly authService: AuthenticationService,
    private readonly router: Router,
  ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    //TODO: Need to add access token to http req based on user login
    const headers: any = {};
    //Verifying BcId present in both cookies and local storage
    const bcId = localStorage.getItem('businessCenterId')
      ? this.authService.getCookie('businessCenterId')
      : false;
    //Verifying partnerId present in both cookies and local storage

    const partnerId = localStorage.getItem('partnerId')
      ? this.authService.getCookie('partnerId')
      : false;

    //Verifying userId present in both cookies and local storage
    const userId = localStorage.getItem('userId')
      ? this.authService.getCookie('partnerId')
      : false;

    //skip verifying partnerId,userId,businessCenterId for login api
    const loginUrl = `${this.apiUrl}auth/login`;
    const logoutUrl = `${this.apiUrl}auth/logout`;

    // if (
    //   logoutUrl === request.url ||
    //   (loginUrl !== request.url && (!bcId || !partnerId || !userId))
    // ) {
    //   this.cookieService.deleteAll();
    //   localStorage.clear();
    //   this.router.navigate(['/login']);
    // }
    if (bcId) headers['bc-id'] = bcId;
    if (partnerId) headers['partner-id'] = partnerId;
    if (userId) headers['user-id'] = userId;


    request = request.clone({
      withCredentials: true,
      setHeaders: headers,
    });
    return next.handle(request);
  }
}
