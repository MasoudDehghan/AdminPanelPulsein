import { RequestP } from './../pEntites/requestP.class';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { WorkStation } from '../entities/WorkStation.class'
import { Worker } from '../entities/Worker.class'
import { WorkerStationDocument } from '../entities/workerStationDocument.class'
import { WorkerStationCatalog } from '../entities/workerStationCatalog.class'
import { WorkerDocument } from '../entities/workerDocument.class'
import { User } from '../entities/user.class'
import { CartableSearch } from '../entities/cartableSearch.class'
import { environment } from '../../environments/environment';

@Injectable()
export class CartableService {
  baseURL = environment.apiUrl+ "/cartable";
  token = sessionStorage.getItem('token');

  summaryUrl = this.baseURL + "/summary/" + this.token;
  WorkStationDocumentUrl = this.baseURL + "/WsD/" + this.token;
  WorkerDocumentUrl = this.baseURL + "/WrD/" + this.token;
  WorkStationFirstUrl = this.baseURL + "/WsFirst/" + this.token;
  WsW4DocUrl = this.baseURL + "/WsW4Doc/" + this.token;
  WsW4AreaUrl = this.baseURL + "/WsW4Area/" + this.token;
  WrW4DocUrl = this.baseURL + "/WrW4Doc/" + this.token;
  WorkerFirstUrl = this.baseURL + "/WrFirst/" + this.token;
  WorkStationFinalUrl = this.baseURL + "/WsFinal/" + this.token;
  WorkerPreFinalUrl = this.baseURL + "/WrPreFinal/" + this.token;
  WorkerFinalUrl = this.baseURL + "/WrFinal/" + this.token;
  
  UserUrl = this.baseURL + "/user/" + this.token;
  WorkStationCatalogUrl = this.baseURL + "/WsC/" + this.token;
  WorkStationLogoUrl = this.baseURL + "/WsL/" + this.token;
  verifyWorkStationFirstUrl = this.baseURL + "/verifyWsFirst/" + this.token;
  verifyWorkStationFinalUrl = this.baseURL + "/verifyWsFinal/" + this.token;
  verifyWorkStationDocUrl = this.baseURL + "/verifyWsDoc/" + this.token;
  verifyWorkStationCatUrl = this.baseURL + "/verifyWsCat/" + this.token;
  verifyWorkStationLogoUrl = this.baseURL + "/verifyWsLogo/" + this.token;
  verifyWorkerFirstUrl = this.baseURL + "/verifyWrFirst/" + this.token;
  verifyWorkerFinalUrl = this.baseURL + "/verifyWrFinal/" + this.token;
  verifyWorkerDocUrl = this.baseURL + "/verifyWrDoc/" + this.token;
  verifyUserUrl = this.baseURL + "/verifyUser/" + this.token;
  searchUrl = this.baseURL + "/search/" + this.token;
  reqExpireUrl = this.baseURL + "/ReqExpire/" + this.token;
  cancelExipredRequestUrl = this.baseURL + "/cancelRequest/" + this.token;
  snoozeRequestUrl = this.baseURL + "/snoozeRequest/" + this.token;
  closeRequestURL = this.baseURL + "/closeRequest/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
 

  }

  getSummary() {
    return this._http
      .get(this.summaryUrl,this.httpOptions);
  }
  getWorkStationDocument() {
    return this._http
      .get(this.WorkStationDocumentUrl,this.httpOptions);
  }
  getWsW4Doc() {
    return this._http
      .get(this.WsW4DocUrl,this.httpOptions);
  }
  getWsW4Area() {
    return this._http
      .get(this.WsW4AreaUrl,this.httpOptions);
  }
  getWrW4Doc() {
    return this._http
      .get(this.WrW4DocUrl,this.httpOptions);
  }
  getWorkerDocument() {
    return this._http
      .get(this.WorkerDocumentUrl,this.httpOptions);
  }
  getNewWorkStations() {
    return this._http
      .get(this.WorkStationFirstUrl,this.httpOptions);
  }
  getFinalWorkStations() {
    return this._http
      .get(this.WorkStationFinalUrl,this.httpOptions);
  }
  getNewWorkers() {
    return this._http
      .get(this.WorkerFirstUrl,this.httpOptions);
  }
  getPreFinalWorkers() {
    return this._http
      .get(this.WorkerPreFinalUrl,this.httpOptions);
  }
  getFinalWorkers() {
    return this._http
      .get(this.WorkerFinalUrl,this.httpOptions);
  }
  getNewUserProfile() {
    return this._http
      .get(this.UserUrl,this.httpOptions);
  }
  getWorkStationCatalog() {
    return this._http
      .get(this.WorkStationCatalogUrl,this.httpOptions);
  }
  getWorkStationLogo() {
    return this._http
      .get(this.WorkStationLogoUrl,this.httpOptions);
  }
  verifyWorkStationFirst(ws: WorkStation) {
    return this._http
      .post(this.verifyWorkStationFirstUrl, JSON.stringify(ws),this.httpOptions) ;
  }
  verifyWorkStationFinal(ws: WorkStation) {
    return this._http
      .post(this.verifyWorkStationFinalUrl, JSON.stringify(ws),this.httpOptions);
  }
  verifyWorkStationDoc(doc: WorkerStationDocument) {
    return this._http
      .post(this.verifyWorkStationDocUrl, JSON.stringify(doc),this.httpOptions);
  }
  verifyWorkStationCat(cat: WorkerStationCatalog) {
    return this._http
      .post(this.verifyWorkStationCatUrl, JSON.stringify(cat),this.httpOptions);
  }
  verifyWorkStationLogo(ws: WorkStation) {
    return this._http
      .post(this.verifyWorkStationLogoUrl, JSON.stringify(ws),this.httpOptions);
  }
  verifyWorkerFirst(wr: Worker) {
    return this._http
      .post(this.verifyWorkerFirstUrl, JSON.stringify(wr),this.httpOptions);
  }
  verifyWorkerFinal(wr: Worker) {
    return this._http
      .post(this.verifyWorkerFinalUrl, JSON.stringify(wr),this.httpOptions);
  }
  verifyWorkerDoc(doc: WorkerDocument) {
    return this._http
      .post(this.verifyWorkerDocUrl, JSON.stringify(doc),this.httpOptions);
  }
  verifyUser(usr: User) {
    return this._http
      .post(this.verifyUserUrl, JSON.stringify(usr),this.httpOptions);
  }
    search(cartableSearch:CartableSearch){
    return this._http
      .post(this.searchUrl, JSON.stringify(cartableSearch),this.httpOptions);
    }

    getExpiredRequestList() {
      return this._http
        .get(this.reqExpireUrl,this.httpOptions);
    }
    cancelExipredRequest(request:RequestP) {
      return this._http
        .post(this.cancelExipredRequestUrl,JSON.stringify(request),this.httpOptions);
    }
    snoozeExpiredRequest(requestID:number,snoozeCount:number) {
      return this._http
        .get(this.snoozeRequestUrl+"/"+requestID+"/"+snoozeCount,this.httpOptions);
    }
    closeRequest(requestID:number){
      return this._http.get(this.closeRequestURL+"/"+requestID,this.httpOptions);
    }
}