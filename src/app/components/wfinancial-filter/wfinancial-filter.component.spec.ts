import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WFinancialFilterComponent } from './wfinancial-filter.component';

describe('RequestFilterComponent', () => {
  let component: WFinancialFilterComponent;
  let fixture: ComponentFixture<WFinancialFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WFinancialFilterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WFinancialFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
