import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { RegisterState } from '../entities/registerState.class'

@Injectable()
export class RegisterStateService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  listUrl = this.baseURL + "/registerstate/all/" + this.token;
  addUrl = this.baseURL + "/registerstate/add/" + this.token;
  updateUrl = this.baseURL + "/registerstate/edit/" + this.token;
  delUrl = this.baseURL + "/registerstate/delete/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  getList() {
    return this._http.get(this.listUrl, this.httpOptions);
  }


  add(obj: RegisterState) {
    return this._http.post(this.addUrl, JSON.stringify(obj), this.httpOptions);
  }
  update(obj: RegisterState) {
    return this._http.post(this.updateUrl, JSON.stringify(obj), this.httpOptions);
  }
  delete(obj: RegisterState) {
    return this._http.post(this.delUrl, JSON.stringify(obj), this.httpOptions);
  }


}