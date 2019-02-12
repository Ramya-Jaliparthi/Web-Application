import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FadSearchListComponent } from './fad-search-list.component';

describe('FadSearchListComponent', () => {
  let component: FadSearchListComponent;
  let fixture: ComponentFixture<FadSearchListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FadSearchListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FadSearchListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
