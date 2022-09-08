import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WFinancialMgmComponent } from './wfinancial-mgm.component';

describe('WFinancialMgmComponent', () => {
  let component: WFinancialMgmComponent;
  let fixture: ComponentFixture<WFinancialMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WFinancialMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WFinancialMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
