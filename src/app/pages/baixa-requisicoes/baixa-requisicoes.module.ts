import { NgModule } from '@angular/core';
import { FormsModule as ngFormsModule } from '@angular/forms';

import { NbActionsModule, NbButtonModule, NbCardModule, NbIconModule } from '@nebular/theme';
import { DxButtonModule, DxDataGridModule, DxFormModule, DxLoadPanelModule, DxSelectBoxModule, DxTemplateModule, DxTextBoxModule } from 'devextreme-angular';

import { ThemeModule } from './../../@theme/theme.module';
import { BaixaRequisicoesRoutingModule } from './baixa-requisicoes-routing.module';
import { BaixaRequisicoesComponent } from './baixa-requisicoes.component';
import { RequisicoesComponent } from './requisicoes/requisicoes.component';
import { RequisicaoComponent } from './requisicao/requisicao.component';
import { RequisicaoProdutoComponent } from './requisicao-produto/requisicao-produto.component';


@NgModule({
  declarations: [BaixaRequisicoesComponent, RequisicoesComponent, RequisicaoComponent, RequisicaoProdutoComponent],
  imports: [
    ThemeModule,
    ngFormsModule,
    BaixaRequisicoesRoutingModule,
    DxButtonModule,
    DxDataGridModule,
    DxFormModule,
    DxSelectBoxModule,
    DxTextBoxModule,
    DxTemplateModule,
    DxLoadPanelModule,
    NbCardModule,
    NbActionsModule,
    NbIconModule,
    NbButtonModule,
  ],
})
export class BaixaRequisicoesModule { }
