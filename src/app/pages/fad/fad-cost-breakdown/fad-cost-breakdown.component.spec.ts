import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadCostBreakdownComponent } from './fad-cost-breakdown.component';

describe('FadCostBreakdownComponent', () => {
  let component: FadCostBreakdownComponent;
  let fixture: ComponentFixture<FadCostBreakdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadCostBreakdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadCostBreakdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
