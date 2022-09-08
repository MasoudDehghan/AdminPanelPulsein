import { NotificationRegister } from '../entities/NotificationRegister.class';
import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Sms } from '../entities/Sms.class'
import { TempUserSmsDto } from 'app/pEntites/tempUserSmsDto.class';

@Injectable()
export class AdminService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  sendSmsUrl = this.baseURL + "/admin/sendSms/" + this.token;
  sendNotifUrl = this.baseURL + "/admin/sendNotification/" + this.token;
  getAllNotificationsUrl = this.baseURL + "/admin/getAllNotifications/" + this.token;
  getNotificationUrl = this.baseURL + "/admin/getNotification/" + this.token;
  tempSmsUrl = this.baseURL + "/admin/tempSms/" + this.token;
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json' })
  };
  constructor(private _http: HttpClient) {

  }

  sendSMS(sms: Sms) {
    return this._http
      .post(this.sendSmsUrl, JSON.stringify(sms), this.httpOptions);
  }

  sendNotification(notificationRegister: NotificationRegister) {
    return this._http
      .post(this.sendNotifUrl, JSON.stringify(notificationRegister), this.httpOptions);
  }

  getAllNotifications() {
    return this._http
      .get(this.getAllNotificationsUrl, this.httpOptions);
  }
  getNotification(notID:number) {
    return this._http
      .get(`${this.getNotificationUrl}/${notID}`, this.httpOptions);
  }
  tempSms(tempUserSmsDto: TempUserSmsDto) {
    return this._http
      .post(this.tempSmsUrl, JSON.stringify(tempUserSmsDto), this.httpOptions);
  }

}