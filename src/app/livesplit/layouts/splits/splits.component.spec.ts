import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SplitsComponent } from './splits.component';

describe('SplitsComponent', () => {
  let component: SplitsComponent;
  let fixture: ComponentFixture<SplitsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SplitsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SplitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
