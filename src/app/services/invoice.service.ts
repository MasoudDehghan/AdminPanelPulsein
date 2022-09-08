import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class InvoiceService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  lookupByIdUrl = this.baseURL + "/invoice/id/" + this.token;
    httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
  
  }

  lookupById(invoiceID:number){
    return this._http
    .get(this.lookupByIdUrl+"/"+invoiceID,this.httpOptions);
    }
 
}