import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WrPaymentReportComponent } from './wr-payment-report.component';

describe('WrPaymentReportComponent', () => {
  let component: WrPaymentReportComponent;
  let fixture: ComponentFixture<WrPaymentReportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WrPaymentReportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WrPaymentReportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
