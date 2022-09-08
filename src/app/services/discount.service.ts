import { Injectable } from '@angular/core';
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { DiscountV } from '../pEntites/discountV.class';
import { DiscountSearch } from '../pEntites/discountSearch.class';
@Injectable()
export class DiscountService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  registerURL = this.baseURL + "/discount/register/" + this.token;
  registerMultipleURL = this.baseURL + "/discount/registerMultiple/" + this.token;
  lookUpByID_URL = this.baseURL + "/discount/id/" + this.token;
  editURL = this.baseURL + "/discount/edit/" + this.token;
  deleteURL = this.baseURL + "/discount/delete/" + this.token;
  searchURL = this.baseURL + "/discount/search/" + this.token;
  getUsageReportURL  = this.baseURL + "/discount/getUsageReport/" + this.token;
  
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
  }
  register(discount: DiscountV) {
    return this._http.post(this.registerURL, JSON.stringify(discount),this.httpOptions);
  }
  registerMultiple(discount: DiscountV,cntr:number){
    let registerMultipleURL = this.registerMultipleURL + "/" + cntr;
    return this._http.post(registerMultipleURL, JSON.stringify(discount),this.httpOptions);
  }
  lookupByID(id:number) {
    let lookUpByID_URL = this.lookUpByID_URL + "/" + id;
    return this._http.get(lookUpByID_URL,this.httpOptions);
  }
  edit(discount: DiscountV) {
    return this._http.post(this.editURL, JSON.stringify(discount),this.httpOptions);
  }
  delete(id:number) {
    let deleteURL = this.deleteURL + "/" + id;
    return this._http.get(deleteURL,this.httpOptions);
  }
  search(discountSearch: DiscountSearch) {
    return this._http.post(this.searchURL, JSON.stringify(discountSearch),this.httpOptions);
  }
  getUsageReport(discountID:number){
    let url = this.getUsageReportURL + "/" + discountID;
    return this._http.get(url,this.httpOptions);
  }
}