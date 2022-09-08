import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { SeoData } from './../pEntites/seoData.class';

@Injectable()
export class SeoService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  listUrl = this.baseURL + "/jobcat3/getSeoData/" + this.token;
  updateUrl = this.baseURL + "/jobcat3/updateSeoData/" + this.token;
  updateSeoPriceUrl = this.baseURL + "/jobcat3/updateSeoPriceData/" + this.token;
  delUrl = this.baseURL + "/jobcat3/removeSeoData/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  getList(id:number) {
    return this._http.get(this.listUrl+"/"+id, this.httpOptions);
  }

  update(id:number,obj:SeoData) {
    return this._http.post(this.updateUrl+"/"+id, JSON.stringify(obj), this.httpOptions);
  }
  updatePrice(id:number,obj:SeoData) {
    return this._http.post(this.updateSeoPriceUrl+"/"+id, JSON.stringify(obj), this.httpOptions);
  }
  delete(id:number) {
    return this._http.get(this.delUrl+"/"+id, this.httpOptions);
  }


}