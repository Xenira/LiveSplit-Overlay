import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ControllsComponent } from './controlls.component';

describe('ControllsComponent', () => {
  let component: ControllsComponent;
  let fixture: ComponentFixture<ControllsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ControllsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
