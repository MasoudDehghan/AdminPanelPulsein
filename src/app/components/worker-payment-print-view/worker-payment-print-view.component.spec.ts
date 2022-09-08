import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkerPaymentPrintViewComponent } from './worker-payment-print-view.component';

describe('WorkerPaymentPrintViewComponent', () => {
  let component: WorkerPaymentPrintViewComponent;
  let fixture: ComponentFixture<WorkerPaymentPrintViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkerPaymentPrintViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkerPaymentPrintViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
