import { TestBed, inject } from '@angular/core/testing';

import { FadCompareTableService } from './fad-compare-table.service';

describe('FadCompareTableService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadCompareTableService]
    });
  });

  it('should be created', inject([FadCompareTableService], (service: FadCompareTableService) => {
    expect(service).toBeTruthy();
  }));
});
