import { Injectable } from '@angular/core'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { JobCategory1 } from '../entities/JobCategory1.class'
import { JobCategory2 } from '../entities/JobCategory2.class'
import { JobCategory3 } from '../entities/JobCategory3.class'
import { environment } from '../../environments/environment';

@Injectable()
export class JobCateogryService {
    baseURL = environment.apiUrl;
    token = sessionStorage.getItem('token');
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    constructor(private http: HttpClient) {

    }

    lookupById(id: number) {
        let _url = this.baseURL + "/jobcat1/id/" + this.token + "/" + id;
        return this.http.get(_url, this.httpOptions);
    }
    geJobCategory1List() {
        let _url = this.baseURL + "/jobcat1/all/" + this.token;
        return this.http
            .get(_url, this.httpOptions);
    }
    getAllJobCategory3List() {
        let _url = this.baseURL + "/jobcat3/all/" + this.token;
        return this.http
            .get(_url, this.httpOptions);
    }
    geJobCategory1ListCount() {
        let _url = this.baseURL + "/jobcat1/allCnt/" + this.token;
        return this.http
            .get(_url, this.httpOptions)
            ;
    }
    geJobCategory2List(jobCat1ID: number) {
        let _url = this.baseURL + "/jobcat2/jobcat1id/" + this.token + "/" + jobCat1ID;
        return this.http
            .get(_url, this.httpOptions)
            ;
    }
    geJobCategory3List(jobCat2ID: number) {
        let _url = this.baseURL + "/jobcat3/jobcat2id/" + this.token + "/" + jobCat2ID;
        return this.http
            .get(_url, this.httpOptions)
            ;
    }

    addJobCategory1(obj: JobCategory1) {
        let _url = this.baseURL + "/jobcat1/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    updateJobCategory1(obj: JobCategory1) {
        let _url = this.baseURL + "/jobcat1/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    deleteJobCategory1(obj: JobCategory1) {
        let _url = this.baseURL + "/jobcat1/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }

    addJobCategory1Icon(obj: JobCategory1) {
        let _url = this.baseURL + "/jobcat1/addIcon/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    removeJobCategory1Icon(obj: JobCategory1) {
        let _url = this.baseURL + "/jobcat1/removeIcon/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    addJobCategory2(obj: JobCategory2) {
        let _url = this.baseURL + "/jobcat2/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    updateJobCategory2(obj: JobCategory2) {
        let _url = this.baseURL + "/jobcat2/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    deleteJobCategory2(obj: JobCategory2) {
        let _url = this.baseURL + "/jobcat2/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    addJobCategory2Icon(obj: JobCategory2) {
        let _url = this.baseURL + "/jobcat2/addIcon/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    removeJobCategory2Icon(obj: JobCategory2) {
        let _url = this.baseURL + "/jobcat2/removeIcon/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    addJobCategory3(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/add/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    updateJobCategory3(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/edit/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    deleteJobCategory3(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/delete/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    addJobCategory3Icon(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/addIcon/" + this.token;
        return this.http
            .post(_url, JSON.stringify(obj), this.httpOptions)
            ;
    }
    removeJobCategory3Icon(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/removeIcon/" + this.token;
        return this.http.post(_url, JSON.stringify(obj), this.httpOptions);
    }
    editCommission(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/editCommission/" + this.token;
        return this.http.post(_url, JSON.stringify(obj), this.httpOptions);
    }

    addActiveCity(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/addCity/" + this.token;
        return this.http.post(_url, JSON.stringify(obj), this.httpOptions);
    }
    editActiveCity(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/editCity/" + this.token;
        return this.http.post(_url, JSON.stringify(obj), this.httpOptions);
    }
    deleteActiveCity(obj: JobCategory3) {
        let _url = this.baseURL + "/jobcat3/deleteCity/" + this.token;
        return this.http.post(_url, JSON.stringify(obj), this.httpOptions);
    }
}