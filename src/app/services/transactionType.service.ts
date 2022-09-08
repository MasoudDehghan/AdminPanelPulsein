import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class TransactionTypeService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  allUrl = this.baseURL + "/transactiontype/all/" + this.token;
  lookupByIdUrl = this.baseURL + "/transactiontype/id/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
  }

 

  list() {
    return this._http.get(this.allUrl,this.httpOptions);
  }
 
  lookupById(reqID:number){
    return this._http.get(this.lookupByIdUrl+"/"+reqID,this.httpOptions);
  }
 
}