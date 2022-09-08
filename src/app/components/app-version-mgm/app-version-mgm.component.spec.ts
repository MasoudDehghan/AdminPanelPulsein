import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AppVersionMgmComponent } from './app-version-mgm.component';

describe('AppVersionMgmComponent', () => {
  let component: AppVersionMgmComponent;
  let fixture: ComponentFixture<AppVersionMgmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AppVersionMgmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppVersionMgmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
