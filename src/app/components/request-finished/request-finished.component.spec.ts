import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RequestOnProgressComponent } from './request-on-progress.component';

describe('RequestWaitToOfferComponent', () => {
  let component: RequestOnProgressComponent;
  let fixture: ComponentFixture<RequestOnProgressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RequestOnProgressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RequestOnProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
