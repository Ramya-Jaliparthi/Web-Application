import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdatePcpComponent } from './update-pcp.component';

describe('UpdatePcpComponent', () => {
  let component: UpdatePcpComponent;
  let fixture: ComponentFixture<UpdatePcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdatePcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdatePcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
