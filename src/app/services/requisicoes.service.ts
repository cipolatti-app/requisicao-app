import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class RequisicoesService {

  _URL = 'http://localhost:8080';

  constructor(private httpClient: HttpClient) { }

  getRequisicoes(): Observable<any[]> {
    return this.httpClient.get<any[]>(`${this._URL}/requisicoes/todas`);
  }

  getProdutoRequisicao(num_requisicao): Observable<any[]> {

    const params = new HttpParams()
    .set('num_requisicao', num_requisicao);

    return this.httpClient.get<any[]>(`${this._URL}/requisicoes/produtos-requisicao`, {params});
  }

  saveAll(detalhes): Observable<any> {
    return this.httpClient.post<any>(`${this._URL}/requisicao-detalhes/update`, detalhes);
  }

  // post(
  //   url: string,
  //   body: any,
  //   options?: {
  //     headers?: HttpHeaders | { [header: string]: string | string[]; };
  //     observe?: "body";
  //     params?: HttpParams | { [param: string]: string | string[]; };
  //     reportProgress?: boolean;
  //     responseType?: "json";
  //     withCredentials?: boolean;
  //   }): Observable<any[]>


}
