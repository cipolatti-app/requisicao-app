import { Component, OnInit } from '@angular/core';

import ptMessages from 'devextreme/localization/messages/pt.json';
import { locale, loadMessages } from 'devextreme/localization';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxIndexedDBService } from 'ngx-indexed-db';

import { RequisicoesService } from './../../../services/requisicoes.service';

@Component({
  selector: 'ngx-requisicoes',
  templateUrl: './requisicoes.component.html',
  styleUrls: ['./requisicoes.component.scss'],
})
export class RequisicoesComponent implements OnInit {

  requisicoes: any[];
  showFilterRow: boolean = true;
  currentFilter: any;
  loadingVisible = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private requisicoesService: RequisicoesService,
    private dbService: NgxIndexedDBService,
    ) {
    loadMessages(ptMessages);
    locale(navigator.language);

    this.cloneIconClick = this.cloneIconClick.bind(this);
  }

  ngOnInit(): void {
    this.getRequisicoes();
  }

  cloneIconClick(e) {
    this.router.navigate(['/pages/baixa-requisicoes/produtos-requisicao'],
    {
      state: {
        data: JSON.stringify(e.row.data),
      },
    });
  }

  async atualizar() {
    this.loadingVisible = true;
    const requisicoes = await this.requisicoesService.getRequisicoes().toPromise();
    for await (const requisicao of requisicoes) {
      await this.dbService.add('requisicaoes', requisicao).toPromise();
      const detalhes = await this.requisicoesService.getProdutoRequisicao(requisicao.num_requisicao).toPromise();
      for await (const detalhe of detalhes) {
        await this.dbService.add('requisicao-detalhes', detalhe).toPromise();
      }
    }
    this.getRequisicoes();
    this.loadingVisible = false;
  }

  async getRequisicoes() {
    this.requisicoes = await this.dbService.getAll('requisicaoes').toPromise();
  }

}
