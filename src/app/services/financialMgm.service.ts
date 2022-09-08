import { TransactionP } from 'app/pEntites/transactionP.class';
import { LastCreditSearch } from './../pEntites/lastCreditSearch.class';
import { TransactionSearch } from './../pEntites/transactionSearch.class';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class FinancialMgmService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  searchUrl = this.baseURL + "/financial/search/" + this.token;
  lookupByIdUrl = this.baseURL + "/financial/id/" + this.token;
  creditSearchUrl = this.baseURL + "/financial/creditSearch/" + this.token;
  registerUrl = this.baseURL + "/financial/register/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {

  }

 

  search(obj: TransactionSearch) {
    return this._http
      .post(this.searchUrl, JSON.stringify(obj),this.httpOptions);
  }
 
  lookupByIdP(reqID:number){
    return this._http
    .get(this.lookupByIdUrl+"/"+reqID,this.httpOptions);
  }
  creditSearch(obj:LastCreditSearch){
    return this._http
    .post(this.creditSearchUrl, JSON.stringify(obj),this.httpOptions);
  }
  register(obj:TransactionP){
    return this._http
    .post(this.registerUrl, JSON.stringify(obj),this.httpOptions);
  }
}