import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CFinancialMgmComponent } from './cfinancial-mgm.component';

describe('CFinancialMgmComponent', () => {
  let component: CFinancialMgmComponent;
  let fixture: ComponentFixture<CFinancialMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CFinancialMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CFinancialMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
