import { WorkerDocument } from './../entities/workerDocument.class';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Worker } from '../entities/worker.class'
import { WorkerSearch } from '../entities/WorkerSearch.class'
@Injectable()
export class WorkerMgmService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  listAllUrl = this.baseURL + "/worker/all/" + this.token;
  lookupByIdUrl = this.baseURL + "/worker/id/" + this.token;
  lookupByTitleUrl = this.baseURL + "/worker/title/" + this.token;
  AddUrl = this.baseURL + "/worker/add/" + this.token;
  deleteUrl = this.baseURL + "/worker/delete/" + this.token;
  editInfoUrl = this.baseURL + "/worker/editInfo/" + this.token;
  editRegisterStateUrl = this.baseURL + "/worker/editRegisterState/" + this.token;
  addJobUrl = this.baseURL + "/worker/addJob/" + this.token;
  addDocumentUrl = this.baseURL + "/worker/addDocument/" + this.token;
  editDocumentUrl = this.baseURL + "/worker/editDocument/" + this.token;
  deleteJobUrl = this.baseURL + "/worker/deleteJob/" + this.token;
  deleteDocumentUrl = this.baseURL + "/worker/deleteDocument/" + this.token;
  SearchUrl = this.baseURL + "/worker/search/" + this.token;
  deletePhoneUrl = this.baseURL + "/worker/deletePhone/" + this.token;
  addPhoneUrl = this.baseURL + "/worker/addPhone/" + this.token;
  editPhoneUrl = this.baseURL + "/worker/editPhone/" + this.token;
  editContactUrl = this.baseURL + "/worker/editContact/" + this.token;
  addServiceAreaUrl = this.baseURL + "/worker/addServiceArea/" + this.token;
  deleteServiceAreaUrl = this.baseURL + "/worker/deleteServiceArea/" + this.token;
  editWorkTimeUrl = this.baseURL + "/worker/editWorkTime/" + this.token;

  
  constructor(private _http: HttpClient) {

  }

  getWorkerList() {
    return this._http
      .get(this.listAllUrl,this.httpOptions)
      ;
  }
  lookupById(id: number) {
    let _lookupByIdUrl = this.lookupByIdUrl + "/" + id;
    return this._http
      .get(_lookupByIdUrl,this.httpOptions)
      ;
  }
  lookupByTitle(title: string) {
    let _lookupByTitleUrl = this.lookupByTitleUrl + "/" + title;
    return this._http
      .get(_lookupByTitleUrl,this.httpOptions)
      ;
  }


  addWorker(worker: Worker) {
    return this._http.post(this.AddUrl, JSON.stringify(worker),this.httpOptions);
  }


  deleteWorker(worker: Worker) {
    return this._http.post(this.deleteUrl, JSON.stringify(worker),this.httpOptions);
  }

  addDocument(worker: Worker) {
    return this._http.post(this.addDocumentUrl, JSON.stringify(worker),this.httpOptions);
  }
  editDocument(workerDocument: WorkerDocument) {
    return this._http.post(this.editDocumentUrl, JSON.stringify(workerDocument),this.httpOptions);
  }

  deleteDocument(worker: Worker) {
    return this._http.post(this.deleteDocumentUrl, JSON.stringify(worker),this.httpOptions);
  }

  editInfo(worker: Worker) {
    return this._http
      .post(this.editInfoUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  editRegisterState(worker: Worker) {
    return this._http
      .post(this.editRegisterStateUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  editWorkTime(worker: Worker) {
    return this._http
      .post(this.editWorkTimeUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  addJob(worker: Worker) {
    return this._http
      .post(this.addJobUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  deleteJob(worker: Worker) {
    return this._http
      .post(this.deleteJobUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  search(workerSearch: WorkerSearch) {
    return this._http
      .post(this.SearchUrl, JSON.stringify(workerSearch),this.httpOptions)
      ;
  }
  deletePhone(worker: Worker) {
    return this._http
      .post(this.deletePhoneUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  editContact(worker: Worker) {
    return this._http
      .post(this.editContactUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  addPhone(worker: Worker) {
    return this._http
      .post(this.addPhoneUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  editPhone(worker: Worker) {
    return this._http
      .post(this.editPhoneUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  addServiceArea(worker: Worker) {
    return this._http
      .post(this.addServiceAreaUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
  deleteServiceArea(worker: Worker) {
    return this._http
      .post(this.deleteServiceAreaUrl, JSON.stringify(worker),this.httpOptions)
      ;
  }
}