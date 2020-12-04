import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RequisicaoProdutoComponent } from './requisicao-produto.component';

describe('RequisicaoProdutoComponent', () => {
  let component: RequisicaoProdutoComponent;
  let fixture: ComponentFixture<RequisicaoProdutoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RequisicaoProdutoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RequisicaoProdutoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
