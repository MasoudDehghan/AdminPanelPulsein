import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { JobResource } from '../entities/jobResource.class'
import { environment } from '../../environments/environment';

@Injectable()
export class JobResourceService {

  baseURL = environment.apiUrl;
  token =  sessionStorage.getItem('token');
  jobResourceListUrl = this.baseURL + "/jobresource/all/" + this.token;
  addJobResourceUrl = this.baseURL + "/jobresource/add/" + this.token;
  updateJobResourceUrl = this.baseURL + "/jobresource/edit/" + this.token;
  delJobResourceUrl = this.baseURL + "/jobresource/delete/" + this.token;
httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {

  }

  getJobResourceList() {
    return this._http
      .get(this.jobResourceListUrl,this.httpOptions)
      ;
  }


  addJobResource(jobResource: JobResource) {
    return this._http
      .post(this.addJobResourceUrl, JSON.stringify(jobResource),this.httpOptions)
      ;
  }
  updateJobResource(jobResource: JobResource) {
    return this._http
      .post(this.updateJobResourceUrl, JSON.stringify(jobResource),this.httpOptions)
      ;
  }
  deleteJobResource(jobResource: JobResource) {
    return this._http
      .post(this.delJobResourceUrl, JSON.stringify(jobResource),this.httpOptions)
      ;
  }
 

}