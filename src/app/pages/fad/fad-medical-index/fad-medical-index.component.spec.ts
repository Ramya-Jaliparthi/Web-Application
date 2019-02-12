import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadMedicalIndexComponent } from './fad-medical-index.component';

describe('FadMedicalIndexComponent', () => {
  let component: FadMedicalIndexComponent;
  let fixture: ComponentFixture<FadMedicalIndexComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadMedicalIndexComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadMedicalIndexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
