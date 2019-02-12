import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadCompareTableComponent } from './fad-compare-table.component';

describe('FadCompareTableComponent', () => {
  let component: FadCompareTableComponent;
  let fixture: ComponentFixture<FadCompareTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadCompareTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadCompareTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
