import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResponseResetPage } from './response-reset.page';

describe('ResponseResetPage', () => {
  let component: ResponseResetPage;
  let fixture: ComponentFixture<ResponseResetPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResponseResetPage ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResponseResetPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
