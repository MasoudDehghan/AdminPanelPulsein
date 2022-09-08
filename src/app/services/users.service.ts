import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { User } from '../entities/User.class'
import { environment } from '../../environments/environment';
@Injectable()
export class UsersService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');
  usersUrl = this.baseURL + "/users/all/" + this.token;
  sysUsersUrl = this.baseURL + "/users/allSystemUsers/" + this.token;
  findUserUrl = this.baseURL + "/users/username/" + this.token;
  updatePassUrl = this.baseURL + "/users/updatePass/" + this.token;
  addUserUrl = this.baseURL + "/users/add/" + this.token;
  updateUserUrl = this.baseURL + "/users/edit/" + this.token;
  delUserUrl = this.baseURL + "/users/delete/" + this.token;
  changePassURL = this.baseURL + "/users/changePass/" + this.token;
  lookupByID_URL =  this.baseURL + "/users/id/" + this.token ;
  allClients_URL  = this.baseURL + "/users/allClients/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {
    
  }

  getUsersList() {
  return this._http.get(this.usersUrl,this.httpOptions);
  }
  getSystemUsersList() {
    this.sysUsersUrl = this.baseURL + "/users/allSystemUsers/" + this.token;
    return this._http.get(this.sysUsersUrl,this.httpOptions);
  }
  getClientUsers(){
    return this._http.get(this.allClients_URL,this.httpOptions);
  }
  lookupByID(id:number) {
    let url = this.lookupByID_URL + "/"+id;
      return this._http.get(url,this.httpOptions);
  }
updatePass(user: User) {
    return this._http.post(this.updatePassUrl, JSON.stringify(user),this.httpOptions);
  }
  findSystemUser(userName: string) {
    return this._http.get(this.findUserUrl + "/" + userName,this.httpOptions);

  }


  addUser(user: User) {
    return this._http.post(this.addUserUrl, JSON.stringify(user),this.httpOptions);
  }
  updateUser(user: User) {
    return this._http.post(this.updateUserUrl, JSON.stringify(user),this.httpOptions);
  }
  deleteSystemUser(user: User) {
    return this._http.post(this.delUserUrl, JSON.stringify(user),this.httpOptions);
  }
  changeSystemUserPass(user: User) {
    return this._http.post(this.changePassURL, JSON.stringify(user),this.httpOptions);
  }

}