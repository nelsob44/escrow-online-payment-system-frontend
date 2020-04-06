import { TestBed, async, inject } from '@angular/core/testing';

import { VerifiedGuard } from './verified.guard';

describe('VerifiedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [VerifiedGuard]
    });
  });

  it('should ...', inject([VerifiedGuard], (guard: VerifiedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
