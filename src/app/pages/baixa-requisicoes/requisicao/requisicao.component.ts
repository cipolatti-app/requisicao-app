import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import ptMessages from 'devextreme/localization/messages/pt.json';
import { locale, loadMessages } from 'devextreme/localization';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import notify from 'devextreme/ui/notify';
import { confirm } from 'devextreme/ui/dialog';

import { RequisicoesService } from './../../../services/requisicoes.service';

@Component({
  selector: 'ngx-requisicao',
  templateUrl: './requisicao.component.html',
  styleUrls: ['./requisicao.component.scss'],
})
export class RequisicaoComponent implements OnInit {

  produtos: any[];
  showFilterRow: boolean = true;
  currentFilter: any;
  requisicao: any;
  loadingVisible = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private requisicoesService: RequisicoesService,
    private dbService: NgxIndexedDBService,
    ) {
    loadMessages(ptMessages);
    locale(navigator.language);

    this.cloneIconClick = this.cloneIconClick.bind(this);

    this.requisicao = JSON.parse(this.router.getCurrentNavigation().extras.state.data);
    this.dbService
      .getAllByIndex('requisicao-detalhes', 'num_requisicao', IDBKeyRange.only(Number(this.requisicao.num_requisicao)))
      .subscribe((itens) => {
        this.produtos = itens;
      });
  }

  ngOnInit(): void {
  }

  cloneIconClick(e) {
    const data = e.row.data;
    this.router.navigate(['/pages/baixa-requisicoes/produtos-requisicao-produto'],
    {
      state: {
        data: JSON.stringify(data),
      },
    });
  }

  plusClick() {
    const data = {
      num_requisicao: this.requisicao.num_requisicao,
    };
    this.router.navigate(
      ['/pages/baixa-requisicoes/produtos-requisicao-produto'],
      {state: { data: JSON.stringify(data) }},
    );
  }

  toggleView() {
    this.router.navigate(['/pages/baixa-requisicoes/requisicoes']);
  }

  async atualizar() {

    const result = confirm('Deseja baixar esta requisição?', 'Baixar requisição');
    result.then(async (dialogResult) => {
      if (dialogResult) {
        this.loadingVisible = true;
        const saveAll = await this.requisicoesService.saveAll(this.produtos)
        .toPromise()
        .catch(error => {
          notify('Ocorreu um erro ao baixar a requisição', 'error');
          this.loadingVisible = false;
          return error;
        });
        for await (const item of this.produtos) {
          await this.dbService.delete('requisicao-detalhes', item.id).toPromise();
        }
        await this.dbService.delete('requisicaoes', this.requisicao.id).toPromise();
        this.loadingVisible = false;
        this.toggleView();
      }
  });

  }

}
