import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PcpErrorComponent } from './pcp-error.component';

describe('PcpErrorComponent', () => {
  let component: PcpErrorComponent;
  let fixture: ComponentFixture<PcpErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PcpErrorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PcpErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
