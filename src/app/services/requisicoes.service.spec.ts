import { TestBed } from '@angular/core/testing';

import { RequisicoesService } from './requisicoes.service';

describe('RequisicoesService', () => {
  let service: RequisicoesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RequisicoesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
