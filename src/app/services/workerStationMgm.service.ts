import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import {forkJoin } from 'rxjs';

import { environment } from '../../environments/environment';
import { WorkStation } from '../entities/workStation.class'
import { WorkStationSearch } from '../entities/WorkStationSearch.class'
import { WorkStationPhone } from '../entities/workStationPhone.class'
import { WorkerStationDocument } from '../entities/workerStationDocument.class';
import * as glob from '../shared/global';
import { Constant } from '../shared/constants.class';

@Injectable()
export class WorkerStationMgmService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

  workStationListUrl = this.baseURL + "/workstation/all/" + this.token;
  addWorkStationUrl = this.baseURL + "/workstation/add/" + this.token;
  delWorkStationUrl = this.baseURL + "/workstation/delete/" + this.token;
  lookupByIdUrl = this.baseURL + "/workstation/id/" + this.token;
  lookupByTitleUrl = this.baseURL + "/workstation/title/" + this.token;
  lookupByPhoneUrl = this.baseURL + "/workstation/phone/" + this.token;
  editInfoUrl = this.baseURL + "/workstation/editInfo/" + this.token;
  editOwnerInfoUrl = this.baseURL + "/workstation/editOwnerInfo/" + this.token;
  changeOwnerUrl = this.baseURL + "/workstation/changeOwner/" + this.token;
  editWorkerUrl = this.baseURL + "/workstation/editWorker/" + this.token;
  editGeoUrl = this.baseURL + "/workstation/editGeo/" + this.token;
  editContactUrl = this.baseURL + "/workstation/editContact/" + this.token;
  editResourceUrl = this.baseURL + "/workstation/editResource/" + this.token;
  addPhoneUrl = this.baseURL + "/workstation/addPhone/" + this.token;
  addPhoneForceUrl = this.baseURL + "/workstation/addPhoneForce/" + this.token;
  deletePhoneUrl = this.baseURL + "/workstation/deletePhone/" + this.token;
  editPhoneUrl = this.baseURL + "/workstation/editPhone/" + this.token;
  editPhoneForceUrl = this.baseURL + "/workstation/editPhoneForce/" + this.token;
  addJobUrl = this.baseURL + "/workstation/addJob/" + this.token;
  deleteJobUrl = this.baseURL + "/workstation/deleteJob/" + this.token;
  updateJobUrl = this.baseURL + "/workstation/updateJob/" + this.token;
  editJobListUrl = this.baseURL + "/workstation/editJobList/" + this.token;
  addCatalogUrl = this.baseURL + "/workstation/addCatalog/" + this.token;
  deleteCatalogUrl = this.baseURL + "/workstation/deleteCatalog/" + this.token;
  searchUrl = this.baseURL + "/workstation/search/" + this.token;
  userListByIdUrl = this.baseURL + "/workstation/userList/" + this.token;
  editRegisterStateUrl = this.baseURL + "/workstation/editRegisterState/" + this.token;
  addDocumentUrl = this.baseURL + "/workstation/addDocument/" + this.token;
  editDocumentUrl = this.baseURL + "/workstation/editDocument/" + this.token;
  deleteDocumentUrl = this.baseURL + "/workstation/deleteDocument/" + this.token;
  initialAddFromPortalUrl = this.baseURL + "/workstation/initialAddFromPortal/" + this.token;
  constructor(private _http: HttpClient) {
  

  }
  getWorkStationMgmData() {
    let provinceID = Constant.defaultProvinceID;
    let townshipID = Constant.defaultTownshipID;
    let cityID = Constant.tehranCityID;
    let workTypesListUrl = this.baseURL + "/worktype/all/" + this.token;
    let jobResourceListUrl = this.baseURL + "/jobresource/all/" + this.token;
    let provinceUrl = this.baseURL + "/province/all/" + this.token;
    let townshipUrl = this.baseURL + "/township/provinceid/" + this.token + "/" + provinceID;
    let cityUrl = this.baseURL + "/city/townshipid/" + this.token + "/" + townshipID;
    let regionUrl = this.baseURL + "/region/cityid/" + this.token + "/" + cityID;
    let areaUrl = this.baseURL + "/area/cityid/" + this.token + "/" + cityID;
    let jc1Url = this.baseURL + "/jobcat1/all/" + this.token;
    let usersUrl = this.baseURL + "/users/allSystemUsers/" + this.token;
    let jc1CountUrl = this.baseURL + "/jobcat1/allCnt/" + this.token;
    let positionTypeListUrl = this.baseURL + "/positiontype/all/" + this.token;
    let registerStateListUrl = this.baseURL + "/registerstate/all/" + this.token;
    let docTypesListUrl = this.baseURL + "/documenttype/all/" + this.token;
    return forkJoin(
      this._http.get(workTypesListUrl),
      this._http.get(jobResourceListUrl),
      this._http.get(provinceUrl),
      this._http.get(townshipUrl),
      this._http.get(cityUrl),
      this._http.get(regionUrl),
      this._http.get(areaUrl),
      this._http.get(jc1Url),
      this._http.get(usersUrl),
      this._http.get(jc1CountUrl),
      this._http.get(positionTypeListUrl),
      this._http.get(registerStateListUrl),
      this._http.get(docTypesListUrl),
    );
  }

  getWorkStationList() {
    return this._http.get(this.workStationListUrl,this.httpOptions);
  }
  lookupById(id: number) {
    let _lookupByIdUrl = this.lookupByIdUrl + "/" + id;
    return this._http.get(_lookupByIdUrl,this.httpOptions);
  }
  userListById(id: number) {
    let url = this.userListByIdUrl + "/" + id;
    return this._http.get(url,this.httpOptions);
  }
  lookupByTitle(title: string) {
    let _lookupByTitleUrl = this.lookupByTitleUrl + "/" + title;
    return this._http.get(_lookupByTitleUrl,this.httpOptions);
  }

  lookupByPhone(workStationPhone: WorkStationPhone) {
    return this._http.post(this.lookupByPhoneUrl, JSON.stringify(workStationPhone),this.httpOptions);
  }
  addWorkStation(workStation: WorkStation) {
    return this._http.post(this.addWorkStationUrl, JSON.stringify(workStation),this.httpOptions);
  }

  deleteWorkStation(workStation: WorkStation) {
    return this._http.post(this.delWorkStationUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editInfo(workStation: WorkStation) {
    return this._http.post(this.editInfoUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editRegisterState(workStation: WorkStation) {
    return this._http.post(this.editRegisterStateUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editOwnerInfo(workStation: WorkStation) {
    return this._http.post(this.editOwnerInfoUrl, JSON.stringify(workStation),this.httpOptions);
  }
  changeOwner(workStation: WorkStation) {
    return this._http.post(this.changeOwnerUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editWorker(workStation: WorkStation) {
    return this._http.post(this.editWorkerUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editGeo(workStation: WorkStation) {
    return this._http.post(this.editGeoUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editContact(workStation: WorkStation) {
    return this._http.post(this.editContactUrl, JSON.stringify(workStation),this.httpOptions);
  }

  editResource(workStation: WorkStation) {
    return this._http.post(this.editResourceUrl, JSON.stringify(workStation),this.httpOptions);
  }
  addPhone(workStation: WorkStation) {
    return this._http.post(this.addPhoneUrl, JSON.stringify(workStation),this.httpOptions);
  }
  addPhoneForce(workStation: WorkStation) {
    return this._http.post(this.addPhoneForceUrl, JSON.stringify(workStation),this.httpOptions);
  }
  deletePhone(workStation: WorkStation) {
    return this._http.post(this.deletePhoneUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editPhone(workStation: WorkStation) {
    return this._http.post(this.editPhoneUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editPhoneForce(workStation: WorkStation) {
    return this._http.post(this.editPhoneForceUrl, JSON.stringify(workStation),this.httpOptions);
  }
  addJob(workStation: WorkStation) {
    return this._http.post(this.addJobUrl, JSON.stringify(workStation),this.httpOptions);
  }
  deleteJob(workStation: WorkStation) {
    return this._http.post(this.deleteJobUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editJobList(workStation: WorkStation) {
    return this._http.post(this.editJobListUrl, JSON.stringify(workStation),this.httpOptions);
  }

  updateJob(workStation: WorkStation) {
    return this._http.post(this.updateJobUrl, JSON.stringify(workStation),this.httpOptions);
  }
  addCatalog(workStation: WorkStation) {
    return this._http.post(this.addCatalogUrl, JSON.stringify(workStation),this.httpOptions);
  }
  deleteCatalog(workStation: WorkStation) {
    return this._http.post(this.deleteCatalogUrl, JSON.stringify(workStation),this.httpOptions);
  }
  search(workStationSearch: WorkStationSearch) {
    return this._http.post(this.searchUrl, JSON.stringify(workStationSearch),this.httpOptions);
  }
  addDocument(workStation: WorkStation) {
    return this._http.post(this.addDocumentUrl, JSON.stringify(workStation),this.httpOptions);
  }
  editDocument(workStationDocument: WorkerStationDocument) {
    return this._http.post(this.editDocumentUrl, JSON.stringify(workStationDocument),this.httpOptions);
  }
  
  deleteDocument(workStation: WorkStation) {
    return this._http.post(this.deleteDocumentUrl, JSON.stringify(workStation),this.httpOptions);
  }

  initialAddFromPortal(workStation: WorkStation) {
    return this._http.post(this.initialAddFromPortalUrl, JSON.stringify(workStation),this.httpOptions);
  }

}