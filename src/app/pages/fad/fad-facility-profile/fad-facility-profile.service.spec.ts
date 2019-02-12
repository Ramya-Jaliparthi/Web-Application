import { TestBed, inject } from '@angular/core/testing';

import { FadFacilityProfileService } from './fad-facility-profile.service';

describe('FadFacilityProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadFacilityProfileService]
    });
  });

  it('should be created', inject([FadFacilityProfileService], (service: FadFacilityProfileService) => {
    expect(service).toBeTruthy();
  }));
});
