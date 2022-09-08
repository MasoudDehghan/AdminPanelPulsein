import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { AppVersion } from '../pEntites/appVersion.class';
import { environment } from '../../environments/environment';

@Injectable()
export class AppVersionService {

  baseURL = environment.apiUrl;
  token =  sessionStorage.getItem('token');

  listAllWUrl = this.baseURL + "/appversion/allW/" + this.token;
  listAllCUrl = this.baseURL + "/appversion/allC/" + this.token;
  lookupByIdUrl = this.baseURL + "/appversion/id/" + this.token;
  addUrl = this.baseURL + "/appversion/add/" + this.token;
  editUrl = this.baseURL + "/appversion/edit/" + this.token;
  deleteUrl = this.baseURL + "/appversion/delete/" + this.token;
  //options: RequestOptions;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {

  }

  getListAllW()  {
    return this._http.get(this.listAllWUrl, this.httpOptions);
  }

  getListAllC() {
    return this._http.get(this.listAllCUrl,this.httpOptions);
  }
  lookupByID(id: number) {
    return this._http.get(this.lookupByIdUrl+"/"+id,this.httpOptions);
  }
  add(appVersion: AppVersion) {
    return this._http.post(this.addUrl, JSON.stringify(appVersion),this.httpOptions);
  }
  edit(appVersion: AppVersion) {
    return this._http.post(this.editUrl, JSON.stringify(appVersion),this.httpOptions);
  }
  delete(appVersion: AppVersion) {
    return this._http.post(this.deleteUrl, JSON.stringify(appVersion),this.httpOptions);
  }

}