import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { SubscriptionType } from '../entities/SubscriptionType.class'

@Injectable()
export class SubscribtionTypeService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  subTypesListUrl = this.baseURL + "/subscriptiontype/all/" + this.token;
  addSubTypeUrl = this.baseURL + "/subscriptiontype/add/" + this.token;
  updateSubTypeUrl = this.baseURL + "/subscriptiontype/edit/" + this.token;
  delSubTypeUrl = this.baseURL + "/subscriptiontype/delete/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  getSubscribtionTypesList() {
    return this._http
      .get(this.subTypesListUrl, this.httpOptions);
  }


  addSubscribtionType(subType: SubscriptionType) {
    return this._http
      .post(this.addSubTypeUrl, JSON.stringify(subType), this.httpOptions)
      ;
  }
  updateSubType(subType: SubscriptionType) {
    return this._http
      .post(this.updateSubTypeUrl, JSON.stringify(subType), this.httpOptions)
      ;
  }
  deleteSubType(subType: SubscriptionType) {
    return this._http
      .post(this.delSubTypeUrl, JSON.stringify(subType), this.httpOptions)
      ;
  }


}