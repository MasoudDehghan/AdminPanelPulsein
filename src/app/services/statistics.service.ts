import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { WorkStationSearch } from '../entities/WorkStationSearch.class'

@Injectable()
export class StatisticsService {
    baseURL = environment.apiUrl;
    token = sessionStorage.getItem('token');
  

    wsCountInCityUrl = this.baseURL + "/statistics/wsCity/" + this.token;
    wsCountInRegionUrl = this.baseURL + "/statistics/wsRegion/" + this.token;
    requestStatisticsUrl = this.baseURL + "/statistics/requestStatistics/" + this.token;
    httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) {
    }

    wsCountInCity(wss: WorkStationSearch) {
        return this.http.post(this.wsCountInCityUrl, JSON.stringify(wss),this.httpOptions)
            ;
    }

    wsCountInRegion(wss: WorkStationSearch) {
        return this.http
            .post(this.wsCountInRegionUrl, JSON.stringify(wss),this.httpOptions);
    }
    getRequestStatistics() {
        return this.http
          .get(this.requestStatisticsUrl,this.httpOptions)
          ;
      }
}