import { ValueAddedReportRequest } from './../entities/valueAddedReportRequest.class';
import { AccountantDocumentRegister } from './../entities/accountantDocumentRegister.class';
import { AccountantReportRequest } from './../entities/accountantReportRequest.class';
import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable()
export class FinancialReportService {
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  baseURL = environment.apiUrl;
  token =  sessionStorage.getItem('token');
  paymentReportUrl = this.baseURL + "/financialReport/paymentReport/" + this.token;
  accountantReportUrl = this.baseURL + "/financialReport/accountantReport/" + this.token;
  valueAddedReportUrl = this.baseURL + "/financialReport/valueAddedReport/" + this.token;
  registerAccountantNumberUrl = this.baseURL + "/financialReport/registerAccountantNumber/" + this.token;
  constructor(private _http: HttpClient) {

  }

  getPaymentReport(date:string) {
    return this._http.get(this.paymentReportUrl+"/"+date,this.httpOptions);
  }
  getAccountantReport(obj:AccountantReportRequest){
    return this._http
    .post(this.accountantReportUrl, JSON.stringify(obj),this.httpOptions);
  }
  registerAccountantNumber(obj:AccountantDocumentRegister){
    return this._http
    .post(this.registerAccountantNumberUrl, JSON.stringify(obj),this.httpOptions);
  }
  getValueAddedReport(input:ValueAddedReportRequest){
    return this._http
    .post(this.valueAddedReportUrl, JSON.stringify(input),this.httpOptions);
  }

}