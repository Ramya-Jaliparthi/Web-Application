import { TestBed, inject } from '@angular/core/testing';

import { FadMedicalIndexService } from './fad-medical-index.service';

describe('FadMedicalIndexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadMedicalIndexService]
    });
  });

  it('should be created', inject([FadMedicalIndexService], (service: FadMedicalIndexService) => {
    expect(service).toBeTruthy();
  }));
});
