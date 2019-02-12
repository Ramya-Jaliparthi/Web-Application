import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadFacilityCompareComponent } from './fad-facility-compare.component';

describe('FadFacilityCompareComponent', () => {
  let component: FadFacilityCompareComponent;
  let fixture: ComponentFixture<FadFacilityCompareComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadFacilityCompareComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadFacilityCompareComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
