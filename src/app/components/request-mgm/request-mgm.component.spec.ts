import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestMgmComponent } from './request-mgm.component';

describe('RequestMgmComponent', () => {
  let component: RequestMgmComponent;
  let fixture: ComponentFixture<RequestMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
