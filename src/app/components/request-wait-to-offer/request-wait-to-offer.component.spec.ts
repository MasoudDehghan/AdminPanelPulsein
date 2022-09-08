import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWaitToOfferComponent } from './request-wait-to-offer.component';

describe('RequestWaitToOfferComponent', () => {
  let component: RequestWaitToOfferComponent;
  let fixture: ComponentFixture<RequestWaitToOfferComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWaitToOfferComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWaitToOfferComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
