import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DiscountCodeMgmComponent } from './discount-code-mgm.component';

describe('DiscountCodeMgmComponent', () => {
  let component: DiscountCodeMgmComponent;
  let fixture: ComponentFixture<DiscountCodeMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DiscountCodeMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountCodeMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
