import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { PositionType } from '../entities/positionType.class'
import { environment } from '../../environments/environment';

@Injectable()
export class PositionTypeService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  listUrl = this.baseURL + "/positiontype/all/" + this.token;
  lookupByIdUrl = this.baseURL + "/positiontype/id/" + this.token;
  lookupByNameUrl = this.baseURL + "/positiontype/name/" + this.token;
  addUrl = this.baseURL + "/positiontype/add/" + this.token;
  editUrl = this.baseURL + "/positiontype/edit/" + this.token;
  deleteUrl = this.baseURL + "/positiontype/delete/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {


  }

  getPostionTypeList() {
    return this._http
      .get(this.listUrl, this.httpOptions);
  }

  lookupByID(id: number) {
    return this._http
      .get(this.lookupByIdUrl + "/" + id, this.httpOptions);
  }
  lookupByName(name: string) {
    return this._http
      .get(this.lookupByNameUrl + "/" + name, this.httpOptions);
  }
  addPostionType(positionType: PositionType) {
    return this._http
      .post(this.addUrl, JSON.stringify(positionType), this.httpOptions);
  }
  updatPostionType(positionType: PositionType) {
    return this._http
      .post(this.editUrl, JSON.stringify(positionType), this.httpOptions);
  }
  deletePostionType(positionType: PositionType) {
    return this._http
      .post(this.deleteUrl, JSON.stringify(positionType), this.httpOptions);
  }


}