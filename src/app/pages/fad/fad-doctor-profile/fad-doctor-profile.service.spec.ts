import { TestBed, inject } from '@angular/core/testing';

import { FadDoctorProfileService } from './fad-doctor-profile.service';

describe('FadDoctorProfileService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadDoctorProfileService]
    });
  });

  it('should be created', inject([FadDoctorProfileService], (service: FadDoctorProfileService) => {
    expect(service).toBeTruthy();
  }));
});
