import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RequisicaoProdutoComponent } from './requisicao-produto/requisicao-produto.component';
import { BaixaRequisicoesComponent } from './baixa-requisicoes.component';
import { RequisicaoComponent } from './requisicao/requisicao.component';
import { RequisicoesComponent } from './requisicoes/requisicoes.component';

const routes: Routes = [
  {
    path: '',
    component: BaixaRequisicoesComponent,
    children: [
      { path: 'requisicoes', component: RequisicoesComponent },
      { path: 'produtos-requisicao', component: RequisicaoComponent },
      { path: 'produtos-requisicao-produto', component: RequisicaoProdutoComponent },
      {path: '', redirectTo: 'requisicoes', pathMatch: 'full'},
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaixaRequisicoesRoutingModule { }
