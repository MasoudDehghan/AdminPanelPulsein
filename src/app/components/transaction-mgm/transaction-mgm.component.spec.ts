import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionMgmComponent } from './transaction-mgm.component';

describe('WorkerTransactionMgmComponent', () => {
  let component: TransactionMgmComponent;
  let fixture: ComponentFixture<TransactionMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
