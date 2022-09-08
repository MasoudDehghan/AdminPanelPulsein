import { AppVersion } from './../pEntites/appVersion.class';
import { RequestStateEnum } from './../enums/requestState.enum';
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { forkJoin } from 'rxjs';

import { DocumentType } from '../entities/DocumentType.class'
import { WorkType } from '../entities/WorkType.class'
import { Province } from '../entities/province.class'
import { TownShip } from '../entities/township.class'
import { City } from '../entities/city.class'
import { Region } from '../entities/region.class'
import { Area } from '../entities/area.class'
import { JobCategory1 } from '../entities/JobCategory1.class'
import { JobCategory3 } from '../entities/JobCategory3.class'

import { JobResource } from '../entities/jobResource.class'
import { User } from '../entities/user.class'
import { PositionType } from '../entities/positionType.class'
import { RegisterState } from '../entities/registerState.class'
import { RequestState } from '../entities/requestState.class'
import { PhoneTypeEnum } from '../enums/phoneType.enum'
import { SharedValues } from '../services/shared-values.service'
import { TransactionType } from './../entities/transactionType.class';

import { BasicData } from './../entities/basicData.class';
import { environment } from '../../environments/environment';
import { Constant } from '../shared/constants.class';
import { TypeInfo } from 'app/entities/typeInfo.class';

@Injectable()
export class BackendRequestClass {

    private result: Object = null;
    baseURL = environment.apiUrl;

    token = sessionStorage.getItem('token');

    basicDataParam: BasicData = new BasicData();;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    constructor(private _http: HttpClient, private shared: SharedValues) {

    }
   
    public initBasicObservables() {
        this.token = sessionStorage.getItem('token');

        let provinceID = Constant.defaultProvinceID;
        let townshipID = Constant.defaultTownshipID;
        let tehranCityID = Constant.tehranCityID;
        let karajCityID = Constant.karajCityID;
        let workTypesListUrl = this.baseURL + "/worktype/all/" + this.token;
        let jobResourceListUrl = this.baseURL + "/jobresource/all/" + this.token;
        let provinceUrl = this.baseURL + "/province/all/" + this.token;
        let townshipUrl = this.baseURL + "/township/provinceid/" + this.token + "/" + provinceID;
        let cityUrl = this.baseURL + "/city/townshipid/" + this.token + "/" + townshipID;
        let tehranRegionUrl = this.baseURL + "/region/cityid/" + this.token + "/" + tehranCityID;
        let karajRegionUrl = this.baseURL + "/region/cityid/" + this.token + "/" + karajCityID;
        let areaUrl = this.baseURL + "/area/cityid/" + this.token + "/" + tehranCityID;
        let jc1Url = this.baseURL + "/jobcat1/all/" + this.token;
        let usersUrl = this.baseURL + "/users/allSystemUsers/" + this.token;
        let jc1CountUrl = this.baseURL + "/jobcat1/allCnt/" + this.token;
        let positionTypeListUrl = this.baseURL + "/positiontype/all/" + this.token;
        let registerStateListUrl = this.baseURL + "/registerstate/all/" + this.token;
        let docTypesListUrl = this.baseURL + "/documenttype/all/" + this.token;
        let reqStateListUrl = this.baseURL + "/requeststate/all/" + this.token;
        let transactionTypeListUrl = this.baseURL + "/transactiontype/all/" + this.token;
        let jc3CountUrl = this.baseURL + "/jobcat3/all/" + this.token;
        let clientAppVersionist = this.baseURL + "/appversion/allC/" + this.token;
        let workerAppVersionist = this.baseURL + "/appversion/allW/" + this.token;
        let activeCityListURL = this.baseURL + "/city/allActive/" + this.token;

        return forkJoin(
            this._http.get(workTypesListUrl),
            this._http.get(jobResourceListUrl),
            this._http.get(provinceUrl),
            this._http.get(townshipUrl),
            this._http.get(cityUrl),
            this._http.get(tehranRegionUrl),
            this._http.get(karajRegionUrl),
            this._http.get(areaUrl),
            this._http.get(jc1Url),
            this._http.get(usersUrl),
            this._http.get(jc1CountUrl),
            this._http.get(positionTypeListUrl),
            this._http.get(registerStateListUrl),
            this._http.get(docTypesListUrl),
            this._http.get(reqStateListUrl),
            this._http.get(transactionTypeListUrl),
            this._http.get(jc3CountUrl),
            this._http.get(clientAppVersionist),
            this._http.get(workerAppVersionist),
            this._http.get(activeCityListURL)
        );
    }

   

    public initData(userRoleID:number) {
        this.basicDataParam = new BasicData();
        this.initBasicObservables().subscribe(result => {
            let basicData = result;
            let _workTypeList: WorkType[] = basicData[0];
            this.basicDataParam.filterWorkTypeList.push({ label: this.shared.chooseWorkTypeLabel, value: new WorkType() });
            _workTypeList.forEach(element => {
                this.basicDataParam.workTypeList.push({ label: element.name, value: element });
                this.basicDataParam.filterWorkTypeList.push({ label: element.name, value: element });
            });
            //------------------------
            let _registerResourceList: JobResource[] = basicData[1];
            _registerResourceList.forEach(element => {
                this.basicDataParam.registerResourceList.push({ label: element.name, value: element });
            });
            //------------------------
            let _provinceList: Province[] = basicData[2];
            this.basicDataParam.chooseProvinceList.push({ label: this.shared.chooseProvinceMsg, value: 0 });
            this.basicDataParam.editProvinceList.push({ label: this.shared.allLabel, value: 0 });

            _provinceList.forEach(element => {
                this.basicDataParam.provinceList.push({ label: element.name, value: element.id });
                this.basicDataParam.chooseProvinceList.push({ label: element.name, value: element.id });
                this.basicDataParam.editProvinceList.push({ label: element.name, value: element.id });
            });
            //------------------------
            let _townshipList: TownShip[] = basicData[3];
            _townshipList.forEach(element => {
                this.basicDataParam.townshipList.push({ label: element.name, value: element.id });
            });
            //------------------------
            let _cityList: City[] = basicData[4];
            _cityList.forEach(element => {
                this.basicDataParam.cityList.push({ label: element.name, value: element });

            });
            //------------------------
            let _regionList: Region[] = basicData[5];
            this.basicDataParam.regionList.push({ label: this.shared.allRegionLabel, value: 0 });
            _regionList.forEach(element => {
                this.basicDataParam.regionList.push({ label: 'تهران'+"-"+element.name, value: element });
            });
            
            //---------------------------------
            let _karajRegionList: Region[] = basicData[6];
            _karajRegionList.forEach(element => {
                this.basicDataParam.regionList.push({ label: element.name, value: element });
            });
            //---------------------------------
            let _areaList: Area[] = basicData[7];
            this.basicDataParam.areaList.push({ label: this.shared.chooseAreaMsg, value: 0 });
            _areaList.forEach(element => {
                this.basicDataParam.areaList.push({ label: element.region.name + " - " + element.name, value: element });
            });
            //--------------------------------------
            this.basicDataParam.jobCategory1List.push({ label: this.shared.chooseJC1Msg, value: 0 });
            this.basicDataParam.filteredJobCatgory1List.push({ label: this.shared.allLabel, value: 0 });
            this.basicDataParam.editJobCategory1List.push({ label: this.shared.allLabel, value: 0 });
            
            let _jobCategory1List: JobCategory1[] = basicData[8];
            this.basicDataParam.jobCategory1Map = new Map<number, JobCategory1>();
            _jobCategory1List.forEach(element => {
                this.basicDataParam.jobCategory1Map.set(element.id, element);
                this.basicDataParam.jobCategory1List.push({ label: element.name, value: element });
                this.basicDataParam.filteredJobCatgory1List.push({ label: element.name, value: element });
                this.basicDataParam.editJobCategory1List.push({ label: element.name, value: element.id });
            });
            //--------------------------------------
            this.basicDataParam.usersList.push({ label: this.shared.chooseUserMsg, value: 0 });
            let users: User[] = basicData[9];
            users.forEach(element => {
                this.basicDataParam.usersList.push({ label: element.userName, value: element });
            });
            //--------------------------------------

            let jc1StatList: JobCategory1[] = basicData[10];
            let list = [...jc1StatList];
            jc1StatList.forEach(jc => {
                this.basicDataParam.jobCategory1Stat.push(jc);
            });

            let positionTypeList: PositionType[] = basicData[11];
            positionTypeList.forEach(po => {
                this.basicDataParam.positionTypeList.push({ label: po.name, value: po });
            });

            let registerStateList: RegisterState[] = basicData[12];
            this.basicDataParam.filteredRegisterStateList.push({ label: this.shared.chooseStateMsg, value: null });
            this.basicDataParam.filteredRegisterStateIDList.push({ label: this.shared.chooseStateMsg, value: -1 });
            registerStateList.forEach(po => {
                this.basicDataParam.registerStateList.push({ label: po.name, value: po });
                this.basicDataParam.filteredRegisterStateList.push({ label: po.name, value: po.name });
                this.basicDataParam.filteredRegisterStateIDList.push({ label: po.name, value: po.id });

            });


            let _docTypeList: DocumentType[] = basicData[13];
            this.basicDataParam.docTypeList.push({ label: this.shared.chooseDocMsg, value: 0 });
            this.basicDataParam.wdocTypeList.push({ label: this.shared.chooseDocMsg, value: 0 });

            _docTypeList.forEach(po => {
                this.basicDataParam.docTypeList.push({ label: po.name, value: po });
                let docType: DocumentType = <DocumentType>po;
                if (docType.related2Wr)
                    this.basicDataParam.wdocTypeList.push({ label: po.name, value: po });

            });
            //-----------------
            let _requestStateList: RequestState[] = basicData[14];
            this.basicDataParam.requestStateList.push({ label: this.shared.chooseStateMsg, value: 0 });
            this.basicDataParam.finishedRequestStateList.push({ label: this.shared.chooseStateMsg, value: 0 });
            _requestStateList.forEach(po => {
                this.basicDataParam.requestStateList.push({ label: po.name, value: po });

                if (po.id == RequestStateEnum.canceled ||
                    po.id == RequestStateEnum.canceledByWorker ||
                    po.id == RequestStateEnum.expired ||
                    po.id == RequestStateEnum.finished)
                    this.basicDataParam.finishedRequestStateList.push({ label: po.name, value: po });
            });

            let _transactionTypeList: TransactionType[] = basicData[15];
            this.basicDataParam.transactionTypeList.push({ label: this.shared.chooseStateMsg, value: 0 });
            _transactionTypeList.forEach(po => {
                this.basicDataParam.transactionTypeList.push({ label: po.name, value: po });
                if (po.manual)
                    this.basicDataParam.rtransactionTypeList.push({ label: po.name, value: po });
            });
            // console.log(this.basicDataParam.rtransactionTypeList);
            this.initFilterPhoneTypeList();

            let jc3List: JobCategory3[] = basicData[16];
            this.basicDataParam.jobCategory3DataList = [];
            jc3List.forEach(element => {
                this.basicDataParam.jobCategory3DataList.push(element);
                this.basicDataParam.jobCategory3List.push({ label: element.name, value: element });
            });
            this.basicDataParam.clientAppVersionMap = new Map<string,boolean>();
            let clientAppVersionList: AppVersion[] = basicData[17];
            this.basicDataParam.clientAppVersions.push({ label: this.shared.chooseStateMsg, value: null });
            this.basicDataParam.clientAppVersions.push({ label: 'Web', value: 'Web' });
            clientAppVersionList.forEach(po => {
                if(po.ios)
                    this.basicDataParam.clientAppVersions.push({ label: 'IOS '+po.name, value: po.name });
                else
                    this.basicDataParam.clientAppVersions.push({ label: po.name, value: po.name });
                this.basicDataParam.clientAppVersionMap.set(po.name, po.active);
            });

            let workerAppVersionList: AppVersion[] = basicData[18];
            this.basicDataParam.workerAppVersions.push({ label: this.shared.chooseStateMsg, value: null });

            workerAppVersionList.forEach(po => {
                this.basicDataParam.workerAppVersions.push({ label: po.name, value: po.name });
            });

            let activeCityList: TypeInfo[] = basicData[19];
            this.basicDataParam.activeCityList.push({ label: this.shared.chooseStateMsg, value: null });

            activeCityList.forEach(po => {
                this.basicDataParam.activeCityList.push({ label: po.name, value: po });
            });


            localStorage.setItem('basicData', JSON.stringify(this.basicDataParam));

        }, error => {
            console.log(error);
            return;
        });
    }

    public initFilterPhoneTypeList() {

        this.basicDataParam.filterPhoneTypeList = [];
        this.basicDataParam.filterPhoneTypeList.push({ label: this.shared.phoneLabel2, value: PhoneTypeEnum.landline });
        this.basicDataParam.filterPhoneTypeList.push({ label: this.shared.mobileLabel2, value: PhoneTypeEnum.mobile });
        this.basicDataParam.filterPhoneTypeList.push({ label: this.shared.faxLabel2, value: PhoneTypeEnum.fax });
    }



}