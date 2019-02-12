import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcpResultComponent } from './pcp-result.component';

describe('PcpResultComponent', () => {
  let component: PcpResultComponent;
  let fixture: ComponentFixture<PcpResultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcpResultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcpResultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
