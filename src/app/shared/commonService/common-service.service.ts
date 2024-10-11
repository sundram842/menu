import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  subject = new Subject<any>();

  updateHeader(message: any) {
    this.subject.next(message);
  }

  getHeader(): Observable<any> {
    return this.subject.asObservable();
  }
}
