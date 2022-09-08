import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WorkType } from '../entities/WorkType.class'

@Injectable()
export class JobGeoReportService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  workTypesListUrl = this.baseURL + "/worktype/all/" + this.token;
  addWorkTypeUrl = this.baseURL + "/worktype/add/" + this.token;
  updateWorkTypeUrl = this.baseURL + "/worktype/edit/" + this.token;
  delWorkTypeUrl = this.baseURL + "/worktype/delete/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {
  }

  getWorkTypesList() {
    return this._http
      .get(this.workTypesListUrl, this.httpOptions);
  }

  addWorkType(workType: WorkType) {
    return this._http
      .post(this.addWorkTypeUrl, JSON.stringify(workType), this.httpOptions);
  }

}