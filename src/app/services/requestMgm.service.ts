import { RequestSearch } from './../entities/requestSearch.class';
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RequestCommentV } from 'app/entities/requestCommentV.class';
@Injectable()
export class RequestMgmService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  requestListUrl = this.baseURL + "/request/all/" + this.token;
  requestSearchUrl = this.baseURL + "/request/search/" + this.token;
  stateHistoryUrl = this.baseURL + "/request/history/" + this.token;
  lookupByIdPUrl = this.baseURL + "/request/idP/" + this.token;
  cancelUrl = this.baseURL + "/request/cancel/" + this.token;
  rollbackRequestUrl = this.baseURL + "/request/rollbackRequest/" + this.token;
  changeRequestUrl = this.baseURL + "/request/changeJobCat3/" + this.token;
  addCommentUrl = this.baseURL + "/request/addComment/" + this.token;
  commentsUrl = this.baseURL + "/request/comments/" + this.token;
  goBackUrl = this.baseURL + "/request/goBack/" + this.token;
  reActiveOfferUrl = this.baseURL + "/request/reActiveOffer/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  getRequestList() {
    return this._http
      .get(this.requestListUrl, this.httpOptions);
  }

  search(obj: RequestSearch) {
    return this._http
      .post(this.requestSearchUrl, JSON.stringify(obj), this.httpOptions);
  }
  rtvStateHistory(reqID: number) {
    return this._http
      .get(this.stateHistoryUrl + "/" + reqID, this.httpOptions);
  }
  lookupByIdP(reqID: number) {
    return this._http
      .get(this.lookupByIdPUrl + "/" + reqID, this.httpOptions);
  }
  cancel(reqID: number) {
    return this._http.get(this.cancelUrl + "/" + reqID, this.httpOptions);
  }
  rollBack(reqID: number) {
    return this._http.get(this.rollbackRequestUrl + "/" + reqID, this.httpOptions);
  }
  changeRequest(reqID: number,cat3ID:number){
    return this._http.get(this.changeRequestUrl + "/" + reqID + "/" + cat3ID, this.httpOptions);
  }
  addComment(reqID:number,obj: RequestCommentV) {
    let url = this.addCommentUrl+"/"+reqID;
    return this._http
      .post(url, JSON.stringify(obj), this.httpOptions);
  }
  comments(reqID: number) {
    return this._http
      .get(this.commentsUrl + "/" + reqID, this.httpOptions);
  }
  goBack(reqID: number) {
    return this._http
      .get(this.goBackUrl + "/" + reqID, this.httpOptions);
  }
  reActiveOffer(offerID: number) {
    return this._http
      .get(this.reActiveOfferUrl + "/" + offerID, this.httpOptions);
  }
}