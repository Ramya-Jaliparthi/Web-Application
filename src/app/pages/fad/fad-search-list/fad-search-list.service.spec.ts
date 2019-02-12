import { TestBed, inject } from '@angular/core/testing';

import { FadSearchListService } from './fad-search-list.service';

describe('FadSearchListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadSearchListService]
    });
  });

  it('should be created', inject([FadSearchListService], (service: FadSearchListService) => {
    expect(service).toBeTruthy();
  }));
});
