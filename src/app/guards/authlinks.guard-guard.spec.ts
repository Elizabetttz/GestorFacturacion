import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { authlinksGuardGuard } from './authlinks.guard-guard';

describe('authlinksGuardGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => authlinksGuardGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
