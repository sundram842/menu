import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SessionServiceService {
  private bcIdSource = new Subject<string>();

  bcId = this.bcIdSource.asObservable();

  public getBusinessCenterId(id: string) {
    this.bcIdSource.next(id);
  }

  public setBusinessCenterLocation(business: string) {
    sessionStorage.setItem('bc-id', business);
  }

  public getBusinessCenterLocation(): string | null | undefined {
    return sessionStorage.getItem('bc-id');
  }
}
