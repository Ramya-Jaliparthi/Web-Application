import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadFacilityCardComponent } from './fad-facility-card.component';

describe('FadProfileCardComponent', () => {
  let component: FadFacilityCardComponent;
  let fixture: ComponentFixture<FadFacilityCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FadFacilityCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadFacilityCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
