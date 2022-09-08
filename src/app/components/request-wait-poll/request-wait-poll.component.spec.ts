import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestWait4PollComponent } from './request-wait-poll.component';

describe('RequestWaitToOfferComponent', () => {
  let component: RequestWait4PollComponent;
  let fixture: ComponentFixture<RequestWait4PollComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestWait4PollComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestWait4PollComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
