import { TestBed } from '@angular/core/testing';

import { ColorsService } from './colors.service';

describe('ColorsService', () => {
  let service: ColorsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColorsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set color alpha correctly', () => {
    expect(service.setAlpha('#999999', 0.5)).toEqual('#99999980');
  });
});
