import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadProfileCardComponent } from './fad-profile-card.component';

describe('FadProfileCardComponent', () => {
  let component: FadProfileCardComponent;
  let fixture: ComponentFixture<FadProfileCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FadProfileCardComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadProfileCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
