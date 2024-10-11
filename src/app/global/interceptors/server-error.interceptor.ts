import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse,
  HttpStatusCode,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

@Injectable()
export class ServerErrorInterceptor implements HttpInterceptor {
  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler,
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(0),
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Unauthorized) {
          //  TODO: Need to add logic for unauthorized error (eg: Redirect to LOGIN)
          return throwError(error);
        } else if (error.status === HttpStatusCode.Forbidden) {
          //  TODO: Need to add logic for forbidden error (eg: Redirect to NOT FOUND page)
          return throwError(error);
        } else {
          //  TODO: Need to add logic for generic error
          return throwError(error);
        }
      }),
    );
  }
}
