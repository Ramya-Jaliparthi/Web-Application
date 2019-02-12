import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadFacilityListComponent } from './fad-facility-list.component';

describe('FadFacilityListComponent', () => {
  let component: FadFacilityListComponent;
  let fixture: ComponentFixture<FadFacilityListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadFacilityListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadFacilityListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
