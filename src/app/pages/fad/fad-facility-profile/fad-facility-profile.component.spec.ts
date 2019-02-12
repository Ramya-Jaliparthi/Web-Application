import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadFacilityProfileComponent } from './fad-facility-profile.component';

describe('FadFacilityProfileComponent', () => {
  let component: FadFacilityProfileComponent;
  let fixture: ComponentFixture<FadFacilityProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadFacilityProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadFacilityProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
