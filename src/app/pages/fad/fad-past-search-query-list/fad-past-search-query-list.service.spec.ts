import { TestBed, inject } from '@angular/core/testing';

import { FadPastSearchQueryListService } from './fad-past-search-query-list.service';

describe('FadPastSearchQueryListService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FadPastSearchQueryListService]
    });
  });

  it('should be created', inject([FadPastSearchQueryListService], (service: FadPastSearchQueryListService) => {
    expect(service).toBeTruthy();
  }));
});
