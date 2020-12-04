import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProdutoService {

  private URL = 'http://localhost:8080/produtos';

  constructor(
    private dbService: NgxIndexedDBService,
    private http: HttpClient) {

    }

  getPlanilha(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/planilha`);
  }

  getDescricao(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/descricao`);
  }

  getDescricaoAdicional(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/descricao-adcional`);
  }

  getComplementoAdicional(): Observable<any[]> {
    return this.http.get<any[]>(`${this.URL}/complemento-adcional`);
  }

  getProduto(codcompladicional): Observable<any> {
    const params = new HttpParams()
        .set('codcompladicional', codcompladicional);

    return this.http.get<any>(`${this.URL}/produto`, {params});
  }

}
