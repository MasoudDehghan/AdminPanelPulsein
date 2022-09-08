import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { FestivalInfo } from './../pEntites/FestivalInfo.class';
@Injectable()
export class FestivalService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  reportURL = this.baseURL + "/festival/portalReport/" + this.token;
  editURL = this.baseURL + "/festival/edit/" + this.token;
  confirmURL = this.baseURL + "/festival/confirmAll/" + this.token;

  
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
  }
  report() {
    return this._http.get(this.reportURL,this.httpOptions);
  }

  edit(festival: FestivalInfo) {
    return this._http.post(this.editURL, JSON.stringify(festival),this.httpOptions);
  }

  
}