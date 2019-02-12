import { TestBed } from '@angular/core/testing';

import { OverwolfService } from './overwolf.service';

describe('OverwolfService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: OverwolfService = TestBed.get(OverwolfService);
    expect(service).toBeTruthy();
  });
});
