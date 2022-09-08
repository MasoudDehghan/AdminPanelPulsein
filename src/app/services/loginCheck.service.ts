import {Injectable} from '@angular/core'
import { HttpClient, HttpHeaders} from '@angular/common/http';
import {User} from '../entities/User.class'  
import { environment } from '../../environments/environment';

@Injectable()
export class LoginCheck{
    baseURL = environment.apiUrl;
    token =  sessionStorage.getItem('token');
    loginUrl = this.baseURL+"/users/loginP";
    logoutUrl = this.baseURL+"/users/logout/"+this.token;
    httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
 
    constructor(private _http:HttpClient){
   

    } 
   sendLoginRequest(data:User){
    
        return this._http
                .post(this.loginUrl,JSON.stringify(data),this.httpOptions);

    }

    sendLogoutRequest(){
        return this._http
                .get(this.logoutUrl,this.httpOptions);
    }
}