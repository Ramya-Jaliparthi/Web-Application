import { TestBed, inject } from '@angular/core/testing';

import { FadService } from './fad.service';

describe('FadService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadService]
    });
  });

  it('should be created', inject([FadService], (service: FadService) => {
    expect(service).toBeTruthy();
  }));
});
