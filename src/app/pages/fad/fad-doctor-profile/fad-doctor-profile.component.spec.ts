import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadDoctorProfileComponent } from './fad-doctor-profile.component';

describe('FadDoctorProfileComponent', () => {
  let component: FadDoctorProfileComponent;
  let fixture: ComponentFixture<FadDoctorProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadDoctorProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadDoctorProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
