import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AFinancialMgmComponent } from './afinancial-mgm.component';

describe('WFinancialMgmComponent', () => {
  let component: AFinancialMgmComponent;
  let fixture: ComponentFixture<AFinancialMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AFinancialMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AFinancialMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
