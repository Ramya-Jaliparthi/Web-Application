import { TestBed, inject } from '@angular/core/testing';

import { FadFacilityCompareService } from './fad-facility-compare.service';

describe('FadFacilityCompareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadFacilityCompareService]
    });
  });

  it('should be created', inject([FadFacilityCompareService], (service: FadFacilityCompareService) => {
    expect(service).toBeTruthy();
  }));
});
