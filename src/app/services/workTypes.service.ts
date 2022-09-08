import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { WorkType } from '../entities/WorkType.class'
import { environment } from '../../environments/environment';

@Injectable()
export class WorkTypeService {
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  baseURL = environment.apiUrl;
  token =  sessionStorage.getItem('token');
  workTypesListUrl = this.baseURL + "/worktype/all/" + this.token;
  addWorkTypeUrl = this.baseURL + "/worktype/add/" + this.token;
  updateWorkTypeUrl = this.baseURL + "/worktype/edit/" + this.token;
  delWorkTypeUrl = this.baseURL + "/worktype/delete/" + this.token;

  constructor(private _http: HttpClient) {

  }

  getWorkTypesList() {
    return this._http.get(this.workTypesListUrl,this.httpOptions);
  }


  addWorkType(workType: WorkType) {
    return this._http.post(this.addWorkTypeUrl, JSON.stringify(workType),this.httpOptions);
  }
  updateWorkType(workType: WorkType) {
    return this._http.post(this.updateWorkTypeUrl, JSON.stringify(workType),this.httpOptions);
  }
  deleteWorkType(workType: WorkType) {
    return this._http.post(this.delWorkTypeUrl, JSON.stringify(workType),this.httpOptions);
  }
 

}