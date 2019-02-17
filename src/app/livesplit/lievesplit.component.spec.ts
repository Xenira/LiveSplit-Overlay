import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LivesplitComponent } from './livesplit.component';

describe('OverlayComponent', () => {
  let component: LivesplitComponent;
  let fixture: ComponentFixture<LivesplitComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LivesplitComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LivesplitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
