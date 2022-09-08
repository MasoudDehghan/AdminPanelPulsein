import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
@Injectable()
export class JobOfferService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  listPerReqIdUrl = this.baseURL + "/joboffer/listPerReqId/" + this.token;
  listPerReqIdNewUrl = this.baseURL + "/joboffer/listPerReqIdNew/" + this.token;
  sendOfferURL =  this.baseURL + "/joboffer/registerByOperator/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  getListPerReqId(reqId: number) {
    return this._http
      .get(this.listPerReqIdUrl + "/" + reqId, this.httpOptions);
  }
  getListPerReqIdNew(reqId: number) {
    return this._http
      .get(this.listPerReqIdNewUrl + "/" + reqId, this.httpOptions);
  }
  sendOffer(reqId:number,workerID:number){
    console.log(this.sendOfferURL+"/"+reqId+"/"+workerID);
    return this._http.get(this.sendOfferURL+"/"+reqId+"/"+workerID);
  }

}