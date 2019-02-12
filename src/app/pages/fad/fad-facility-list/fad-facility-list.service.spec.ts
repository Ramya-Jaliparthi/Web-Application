import { TestBed, inject } from '@angular/core/testing';

import { FadFacilityListService } from './fad-facility-list.service';

describe('FadSearchListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadFacilityListService]
    });
  });

  it('should be created', inject([FadFacilityListService], (service: FadFacilityListService) => {
    expect(service).toBeTruthy();
  }));
});
