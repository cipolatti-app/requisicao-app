/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
} from '@nebular/theme';

import { DBConfig, NgxIndexedDBModule } from 'ngx-indexed-db';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';


const dbConfig: DBConfig  = {
  name: 'CipDb',
  version: 3,
  objectStoresMeta: [{
    store: 'planilha',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'planilha', keypath: 'planilha', options: { unique: false } },
    ],
  }, {
    store: 'descricao',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'codigo', keypath: 'codigo', options: { unique: false } },
      { name: 'descricao', keypath: 'descricao', options: { unique: false } },
      { name: 'planilha', keypath: 'planilha', options: { unique: false } },
    ],
  }, {
    store: 'descricao_adicional',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'coduniadicional', keypath: 'coduniadicional', options: { unique: false } },
      { name: 'descricao_adicional', keypath: 'descricao_adicional', options: { unique: false } },
      { name: 'codigo', keypath: 'codigo', options: { unique: false } },
    ],
  }, {
    store: 'complementoadicional',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'codcompladicional', keypath: 'codcompladicional', options: { unique: false } },
      { name: 'coduniadicional', keypath: 'coduniadicional', options: { unique: false } },
      { name: 'complementoadicional', keypath: 'complementoadicional', options: { unique: false } },
      { name: 'unidade', keypath: 'unidade', options: { unique: false } },
    ],
  }, {
    store: 'requisicaoes',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'num_os_servico', keypath: 'num_os_servico', options: { unique: false } },
      { name: 'num_requisicao', keypath: 'num_requisicao', options: { unique: false } },
      { name: 'data', keypath: 'data', options: { unique: false } },
      { name: 'setor_caminho', keypath: 'setor_caminho', options: { unique: false } },
    ],
  }, {
    store: 'requisicao-detalhes',
    storeConfig: { keyPath: 'id', autoIncrement: true },
    storeSchema: [
      { name: 'cod_det_req', keypath: 'cod_det_req', options: { unique: false } },
      { name: 'codcompladicional', keypath: 'codcompladicional', options: { unique: false } },
      { name: 'codigo', keypath: 'codigo', options: { unique: false } },
      { name: 'coduniadicional', keypath: 'coduniadicional', options: { unique: false } },
      { name: 'num_requisicao', keypath: 'num_requisicao', options: { unique: false } },
      { name: 'planilha', keypath: 'planilha', options: { unique: false } },
      { name: 'produto', keypath: 'produto', options: { unique: false } },
      { name: 'quantidade', keypath: 'quantidade', options: { unique: false } },
      { name: 'unidade', keypath: 'unidade', options: { unique: false } },
    ],
  }],
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    ThemeModule.forRoot(),
    NgxIndexedDBModule.forRoot(dbConfig),
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
