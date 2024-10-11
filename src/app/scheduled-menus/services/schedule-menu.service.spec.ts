import { TestBed } from '@angular/core/testing';

import { ScheduleMenuService } from './schedule-menu.service';

describe('ScheduleMenuService', () => {
  let service: ScheduleMenuService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScheduleMenuService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
