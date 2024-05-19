import { TestBed } from '@angular/core/testing';

import { MsjService } from './msj.service';

describe('MsjService', () => {
  let service: MsjService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MsjService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
