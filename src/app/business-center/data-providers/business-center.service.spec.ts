import { TestBed } from '@angular/core/testing';

import { BusinessCenterService } from './business-center.service';

describe('BusinessCenterService', () => {
  let service: BusinessCenterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BusinessCenterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
