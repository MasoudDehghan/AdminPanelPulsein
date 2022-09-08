import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';



@Injectable()
export class HomePageService {
   baseURL = environment.apiUrl;
   token = sessionStorage.getItem('token');
   httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
   };

   homePageDataUrl = this.baseURL + "/statistics/homePageData/" + this.token;
   homePageDataMiniUrl = this.baseURL + "/statistics/homePageDataMini/" + this.token;
   requestTodayGraphUrl = this.baseURL + "/statistics/requestTodayGraph/" + this.token;
   constructor(private http: HttpClient) {
   }

   geStats() {
      return this.http.get(this.homePageDataUrl, this.httpOptions);
   }
   geHeaderStats() {
      return this.http.get(this.homePageDataMiniUrl, this.httpOptions);
   }
   getRequestTodayStats() {
      return this.http.get(this.requestTodayGraphUrl, this.httpOptions);
   }

}