import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWait4PaymentComponent } from './request-wait-payment.component';

describe('RequestWaitToOfferComponent', () => {
  let component: RequestWait4PaymentComponent;
  let fixture: ComponentFixture<RequestWait4PaymentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWait4PaymentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWait4PaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
