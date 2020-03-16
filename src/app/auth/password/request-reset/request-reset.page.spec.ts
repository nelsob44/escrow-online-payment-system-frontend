import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestResetPage } from './request-reset.page';

describe('RequestResetPage', () => {
  let component: RequestResetPage;
  let fixture: ComponentFixture<RequestResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestResetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
