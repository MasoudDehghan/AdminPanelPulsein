import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Setting } from '../entities/setting.class';

@Injectable()
export class SettingService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  private listUrl = this.baseURL + "/setting/all/" + this.token;
  private editUrl = this.baseURL + "/setting/edit/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {

  }

  getAll() {
    return this._http
      .get(this.listUrl,this.httpOptions);
  }

  edit(setting: Setting) {
    return this._http
      .post(this.editUrl, JSON.stringify(setting),this.httpOptions);
  }



}