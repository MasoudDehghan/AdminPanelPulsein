import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WorkerSearch } from '../entities/WorkerSearch.class'
@Injectable()
export class WorkerService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  listAllUrl = this.baseURL + "/workerN/all/" + this.token;
  excelUrl = this.baseURL + "/workerN/allExcel/" + this.token;
  searchUrl = this.baseURL + "/workerN/search/" + this.token;


  constructor(private _http: HttpClient) {

  }

  getWorkerList() {
    return this._http
      .get(this.listAllUrl,this.httpOptions);
  }
  getExcelList() {
    return this._http
      .get(this.excelUrl,this.httpOptions);
  }
  search(workerSearch: WorkerSearch) {
    return this._http.post(this.searchUrl, JSON.stringify(workerSearch),this.httpOptions);
  }
 
}