import { TestBed } from '@angular/core/testing';

import { EquipmentService } from './equipment/equipment.service';

describe('EquipmentService', () => {
  let service: EquipmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EquipmentService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
