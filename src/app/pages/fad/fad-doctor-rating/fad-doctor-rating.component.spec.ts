import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadDoctorRatingComponent } from './fad-doctor-rating.component';

describe('FadDoctorRatingComponent', () => {
  let component: FadDoctorRatingComponent;
  let fixture: ComponentFixture<FadDoctorRatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadDoctorRatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadDoctorRatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
