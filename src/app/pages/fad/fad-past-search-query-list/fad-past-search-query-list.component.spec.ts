import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadPastSearchQueryListComponent } from './fad-past-search-query-list.component';

describe('FadPastSearchQueryListComponent', () => {
  let component: FadPastSearchQueryListComponent;
  let fixture: ComponentFixture<FadPastSearchQueryListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadPastSearchQueryListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadPastSearchQueryListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
