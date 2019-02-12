import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyDoctorsComponent } from './mydoctors.component';

describe('MyDoctorsComponent', () => {
  let component: MyDoctorsComponent;
  let fixture: ComponentFixture<MyDoctorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyDoctorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyDoctorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
