import { TestBed, inject } from '@angular/core/testing';

import { FadCostBreakdownService } from './fad-cost-breakdown.service';

describe('FadCostBreakdownService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadCostBreakdownService]
    });
  });

  it('should be created', inject([FadCostBreakdownService], (service: FadCostBreakdownService) => {
    expect(service).toBeTruthy();
  }));
});
