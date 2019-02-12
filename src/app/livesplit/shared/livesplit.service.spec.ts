import { TestBed } from '@angular/core/testing';

import { LivesplitService } from './livesplit.service';

describe('LivesplitService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LivesplitService = TestBed.get(LivesplitService);
    expect(service).toBeTruthy();
  });
});
