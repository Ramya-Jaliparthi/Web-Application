import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPcpComponent } from './add-pcp.component';

describe('AddPcpComponent', () => {
  let component: AddPcpComponent;
  let fixture: ComponentFixture<AddPcpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPcpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPcpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
