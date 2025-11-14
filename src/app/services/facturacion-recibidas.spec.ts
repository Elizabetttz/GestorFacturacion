import { TestBed } from '@angular/core/testing';

import { FacturacionRecibidas } from './facturacion-recibidas';

describe('FacturacionRecibidas', () => {
  let service: FacturacionRecibidas;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FacturacionRecibidas);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
