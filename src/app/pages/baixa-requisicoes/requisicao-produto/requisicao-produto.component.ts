import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, NavigationStart, Router } from '@angular/router';
import { from, Observable, of } from 'rxjs';
import { concatMap, filter, groupBy, map, mergeMap, reduce, tap } from 'rxjs/operators';

import ptMessages from 'devextreme/localization/messages/pt.json';
import { locale, loadMessages } from 'devextreme/localization';
import { IndexDetails, NgxIndexedDBService } from 'ngx-indexed-db';

import { ProdutoService } from './../../../services/produto.service';
import { DxiItemComponent } from 'devextreme-angular/ui/nested';
import notify from 'devextreme/ui/notify';

@Component({
  selector: 'ngx-requisicao-produto',
  templateUrl: './requisicao-produto.component.html',
  styleUrls: ['./requisicao-produto.component.scss'],
})
export class RequisicaoProdutoComponent implements OnInit {
  produto = {
    BuscaProduto: null,
    cod_det_req: null,
    planilha: null,
    codigo: null,
    coduniadicional: null,
    codcompladicional: null,
    num_requisicao: null,
    quantidade: null,
  };
  rotulo: string;
  planilhas: any[];
  descricoes: any[];
  descricaoAdicionais: any[];
  complementoAdicionais: any[];
  private state$: Observable<object>;
  loadingVisible = false;
  productSearch = false;

  complAdicional: any;
  uniAdicional: any;
  codigo: any;

  // @ViewChild('planilha', { static: false }) itemPlanilha: DxiItemComponent;
  // @ViewChild('codigo', { static: false }) itemCodigo: DxiItemComponent;
  // @ViewChild('coduniadicional', { static: false }) itemCoduniAdicional: DxiItemComponent;
  // @ViewChild('codcompladicional', { static: false }) itemComplAdicional: DxiItemComponent;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private produtoService: ProdutoService,
    private dbService: NgxIndexedDBService,
  ) {

    loadMessages(ptMessages);
    locale(navigator.language);

    this.produto = JSON.parse(this.router.getCurrentNavigation().extras.state.data);
    if (this.produto.planilha) {
      this.rotulo = 'Alterar produto requisição';
      this.dadosIniciais();
    } else {
      this.rotulo = 'Adcionar novo produto a requisição';
    }

   }

   ngOnInit(): void {
    this.dbService.getAll('planilha').subscribe((planilhas) => this.planilhas = planilhas);
  }

  async dadosIniciais() {
    this.planilhas = await this.dbService
    .getAll('planilha')
    .toPromise();

    this.descricoes = await this.dbService
    .getAllByIndex('descricao', 'planilha', IDBKeyRange.only(this.produto.planilha))
    .toPromise();

    this.descricaoAdicionais = await this.dbService
    .getAllByIndex('descricao_adicional', 'codigo', IDBKeyRange.only(this.produto.codigo))
    .toPromise();

    this.complementoAdicionais = await this.dbService
    .getAllByIndex('complementoadicional', 'coduniadicional', IDBKeyRange.only(this.produto.coduniadicional))
    .toPromise();
  }

  toggleView() {
    this.router.navigate(
      ['/pages/baixa-requisicoes/produtos-requisicao',
      { num_requisicao: this.produto.num_requisicao },
    ]);
  }

  codcompladicionalChanged = async (event: any) => {

    this.productSearch = true;

    this.complAdicional = await this.dbService
    .getByIndex('complementoadicional', 'codcompladicional', Number(event.value))
    .toPromise();

    if (this.complAdicional) {
      this.produto.codcompladicional = this.complAdicional.codcompladicional;

      this.uniAdicional = await this.dbService
      .getByIndex('descricao_adicional', 'coduniadicional', this.complAdicional.coduniadicional)
      .toPromise();

      this.produto.coduniadicional = this.uniAdicional.coduniadicional;

      this.codigo = await this.dbService
      .getByIndex('descricao', 'codigo', this.uniAdicional.codigo)
      .toPromise();

      this.produto.codigo = this.codigo.codigo;
      this.produto.planilha = this.codigo.planilha;

      await this.dadosIniciais();
      this.productSearch = false;
    } else {
      notify('Produto não encontrado', 'info');
    }

  }

  planilhaEnterKey = (event: any) => {
    // this.productSearch = false;
  }

  planilhaSelectionChanged = (event: any) => {
    if (!this.productSearch) {
      this.produto.codigo = null;
      this.produto.coduniadicional = null;
      this.produto.codcompladicional = null;
    }
  }

  descricaoEnterKey = (event: any) => {
    this.productSearch = false;
    this.dbService.getAllByIndex('descricao', 'planilha', IDBKeyRange.only(this.produto.planilha))
    .subscribe((descricoes) => {
      this.descricoes = descricoes;
    });
  }

  descricaoAdicionalEnterKey = (event: any) => {
    this.productSearch = false;
    this.dbService.getAllByIndex('descricao_adicional', 'codigo', IDBKeyRange.only(this.produto.codigo))
    .subscribe((descricaoAdicionais) => {
      this.descricaoAdicionais = descricaoAdicionais;
    });
  }

  codcomplAdicionalEnterKey = (event: any) => {
    this.productSearch = false;
    this.dbService
    .getAllByIndex('complementoadicional', 'coduniadicional', IDBKeyRange.only(this.produto.coduniadicional))
    .subscribe((complementoAdicionais) => {
      this.complementoAdicionais = complementoAdicionais;
    });
  }

  descricaoSelectionChanged = (event: any) => {
    if (!this.productSearch) {
      this.produto.coduniadicional = null;
      this.produto.codcompladicional = null;
    }
  }

  descricaoAdicionalSelectionChanged = (event: any) => {
    if (!this.productSearch) {
      this.produto.codcompladicional = null;
    }
  }

  codcomplAdicionalSelectionChanged = (event: any) => {};

  async atualizar() {

    this.loadingVisible = true;

    const planilhas = await this.produtoService.getPlanilha().toPromise();
    const descricoes = await this.produtoService.getDescricao().toPromise();
    const descricaoAdicionais = await this.produtoService.getDescricaoAdicional().toPromise();
    const complementoAdicionais = await this.produtoService.getComplementoAdicional().toPromise();

    for await (const planilha of planilhas) {
      await this.addDatabase('planilha', planilha).toPromise();
    }

    for await (const descricao of descricoes) {
      await this.addDatabase('descricao', descricao).toPromise();
    }

    for await (const descricaoAdcional of descricaoAdicionais) {
      await this.addDatabase('descricao_adicional', descricaoAdcional).toPromise();
    }

    for await (const complementoAdicional of complementoAdicionais) {
      await this.addDatabase('complementoadicional', complementoAdicional).toPromise();
    }
    this.loadingVisible = false;
  }

  buttonOptions = {
    text: 'GRAVAR',
    type: 'success',
    useSubmitBehavior: true,
    onClick: async (e) => {

      if (!e.validationGroup.validate().isValid) {
        notify('Preencha todos os campos obrigatórios', 'Warning');
        return;
      }

    this.complAdicional = await this.dbService
    .getByIndex('complementoadicional', 'codcompladicional', Number(this.produto.codcompladicional))
    .toPromise();

      this.uniAdicional = await this.dbService
      .getByIndex('descricao_adicional', 'coduniadicional', this.complAdicional.coduniadicional)
      .toPromise();

      this.codigo = await this.dbService
      .getByIndex('descricao', 'codigo', this.uniAdicional.codigo)
      .toPromise();

      if (this.produto.cod_det_req) {

        const detalhe = await this.dbService
        .getByIndex('requisicao-detalhes', 'cod_det_req', this.produto.cod_det_req)
        .toPromise();

        this.dbService.update('requisicao-detalhes',
          {
            id: detalhe['id'],
            cod_det_req: this.produto.cod_det_req,
            codcompladicional: this.produto.codcompladicional,
            codigo: this.produto.codigo,
            coduniadicional: this.produto.coduniadicional,
            num_requisicao: this.produto.num_requisicao,
            planilha: this.produto.planilha,
            produto: `${this.codigo.descricao} ${this.uniAdicional.descricao_adicional} ${this.complAdicional.complementoadicional}`,
            quantidade: this.produto.quantidade,
            unidade: this.complAdicional.unidade,
          }).toPromise();
          this.toggleView();
      } else {
        this.dbService
        .add('requisicao-detalhes', {
          codcompladicional: this.produto.codcompladicional,
          codigo: this.produto.codigo,
          coduniadicional: this.produto.coduniadicional,
          num_requisicao: Number(this.produto.num_requisicao),
          planilha: this.produto.planilha,
          produto: `${this.codigo.descricao} ${this.uniAdicional.descricao_adicional} ${this.complAdicional.complementoadicional}`,
          quantidade: this.produto.quantidade,
          unidade: this.complAdicional.unidade,
        }).subscribe((key) => {
          this.toggleView();
        });

      }


    },
  };

  addDatabase(tabela, data): Observable<any> {
    return this.dbService.add(tabela, data);
  }

}
