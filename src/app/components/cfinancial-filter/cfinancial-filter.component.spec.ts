import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CFinancialFilterComponent } from './cfinancial-filter.component';

describe('CFinancialFilterComponent', () => {
  let component: CFinancialFilterComponent;
  let fixture: ComponentFixture<CFinancialFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CFinancialFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CFinancialFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
