import { BasicData } from './../entities/basicData.class';
import { WorkerSummary } from './../entities/workerSummary.class';
import { WorkerService } from './../services/worker.service';
import { Component, Input, Output, OnInit, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder } from '@angular/forms'

import * as glob from '../shared/global';
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Worker } from '../entities/worker.class'
import { JobCategory1 } from '../entities/JobCategory1.class'
import { JobCategory2 } from '../entities/JobCategory2.class'
import { JobCategory3 } from '../entities/JobCategory3.class'
import { JobCateogryService } from '../services/jobCategory.service'
import { TownShip } from '../entities/township.class'
import { City } from '../entities/city.class'
import { Region } from '../entities/region.class'
import { Area } from '../entities/area.class'
import { GeoService } from '../services/geo.service'
import { User } from '../entities/user.class'
import { WorkerSearch } from '../entities/workerSearch.class'
import { WorkerSearchResult } from '../entities/woSearchResult.class'
import { GrowlMessage } from '../entities/growlMessage.class'
import { SharedValues } from '../services/shared-values.service'
import { WorkerMgmService } from '../services/workerMgm.service'
import { RegisterState } from '../entities/registerState.class';
import { Constant } from '../shared/constants.class';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { puts } from 'util';


@Component({
    moduleId: module.id,
    selector: 'wrFilterComponent',
    templateUrl: './wrFilter.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[GeoService,JobCateogryService,WorkerMgmService]
})

export class WorkerFilter implements OnInit {
    filterForm: FormGroup;
    selectedWorker: Worker = new Worker();
    selectedFilter: WorkerSearch = new WorkerSearch();
    @Input() provinceList: SelectItem[] = [];
    @Input() jobCategory1List: SelectItem[] = [];
    @Input() jobCategory1Map: Map<number, JobCategory1> = new Map<number, JobCategory1>();
    @Input() usersList: SelectItem[] = [];
    @Input() appVersionList: SelectItem[] = [];
    @Input() serviceCityList: SelectItem[] = [];
    @Input() selectedCode: string = null;
    @Input() selectedJobCategory1: JobCategory1 = null;
    @Input() selectedJobCategory2: JobCategory2 = null;
    @Input() selectedJobCategory3: JobCategory3 = null;
    @Input() selectedWorkerMobileNumber: string = "";
    @Input() selectedWorkerfirstName: string = "";
    @Input() selectedWorkerLastName: string = "";
    @Input() selectedWorkerNationalCode: string = "";
    @Input() selectedCity: City = new City();
    @Input() selectedRegion: Region = new Region();
    @Input() selectedArea: Area = new Area();
    @Input() selectedWorkerRegisteredBy: User = null;
    @Input() selectedWorkerVerifiedBy: User = null;
    @Input() selectedActive: boolean = undefined;
    @Input() selectedHaveBond: boolean = undefined;
    @Input() selectedOfferBlock: boolean = undefined;
    @Input() selectedCoverageCityList: City[] = [];
    @Input() registerStateList: SelectItem[] = [];
    @Input() selectedRegisterState: RegisterState = null;
    @Input() selectedRegisterStartDate: string = null;
    @Input() selectedRegisterStopDate: string = null;
    @Input() selectedAppVersion: string = null;
    
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSearch = new EventEmitter<WorkerSearchResult>();
    jobDataLabel = this.shared.jobDataLabel;
    worker: Worker = new Worker();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    jobCategory2List: SelectItem[] = [];
    jobCategory3List: SelectItem[] = [];

    jobCategory2Map: Map<number, JobCategory2> = new Map<number, JobCategory2>();
    jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();

    selectedProvinceID: number = 0;
    selectedTownshipID: number = 0;
    selectedTownshipName: string = "";

    selectedCityID: number = 0;

    selectedRegionID: number = 0;
    selectedAreaID: number = 0;
    areaName: string;
    msgs: GrowlMessage[] = [];

    townshipList: SelectItem[] = [];
    cityList: SelectItem[] = [];
    regionList: SelectItem[] = [];
    areaList: SelectItem[] = [];

    datePickerConfig = {
        drops: 'up',
        format: 'YYYY/MM/DD HH:mm:ss',
        appendTo: 'body'
    };
    _registerStartDate: Moment;
    _registerStopDate: Moment;
    basicData:BasicData;
    constructor(private _router: Router, private _fb: FormBuilder,
        private workerMgmService: WorkerService,
        private _geoService: GeoService,
        private _jService: JobCateogryService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.filterForm = this._fb.group({
            code: [''],
            jobCategory1FormCntrl: [''],
            jobCategory2FormCntrl: [''],
            jobCategory3FormCntrl: [''],
            keywordFormCntrl: [''],
            phoneNumber: [''],
            location: new FormGroup({
                province: new FormControl(''),
                township: new FormControl(''),
                city: new FormControl(''),
                region: new FormControl(['']),
                area: new FormControl([''])
            }),
            personalData: new FormGroup({
                firstName: new FormControl(['']),
                lastName: new FormControl(['']),
                nationalCode: new FormControl(['']),
                mobileNumber: new FormControl(['']),
                appVersion:  new FormControl([''])

            }),
            registerById: [''],
            verifyById: [''],
            active: [''],
            haveBond:[''],
            offerBlock:[''],
            coverageCity: [''],
            registerState: [],
            registerStartDate: [''],
            registerStopDate: ['']
        });

        this.errorCntrler = new HandleErrorMsg(this._router);
        this.initJobCategory2List();
        this.initJobCategory3List();
        this.initTownshipList();
        this.initCityList();
        this.initRegionList();
        this.initAreaList();
        this.selectedFilter = new WorkerSearch();
        if (this.selectedRegion != null)
            this.selectedRegionID = this.selectedRegion.id;

        this.basicData = JSON.parse(localStorage.getItem('basicData'));
        this.serviceCityList = this.serviceCityList.filter((val, i) => i != 0);
    }
    ngAfterViewInit() {

    }
    
    onSubmitFilterform() {
        try {
            if (this._registerStartDate != undefined)
                this.selectedRegisterStartDate = moment(this._registerStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            if (this._registerStopDate != undefined)
                this.selectedRegisterStopDate = moment(this._registerStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            if (this.selectedCode != null) {
                if (this.selectedCode != '') {
                    this.selectedFilter.code = this.selectedCode.replace(' ', '');
                    this.selectedFilter.f_code = true;
                }
            }
            if (this.selectedJobCategory1 != null) {
                if (this.selectedJobCategory1.id != 0) {
                    this.selectedFilter.jobCategory1Id = this.selectedJobCategory1.id;
                    this.selectedFilter.f_jobCategory1Id = true;
                }
            }
            if (this.selectedJobCategory2 != null) {
                if (this.selectedJobCategory2.id != 0) {
                    this.selectedFilter.jobCategory2Id = this.selectedJobCategory2.id;
                    this.selectedFilter.f_jobCategory2Id = true;
                }
            }
            if (this.selectedJobCategory3 != null) {
                if (this.selectedJobCategory3.id != 0) {
                    this.selectedFilter.jobCategory3Id = this.selectedJobCategory3.id;
                    this.selectedFilter.f_jobCategory3Id = true;
                }
            }

            if (this.selectedWorkerMobileNumber != "") {
                this.selectedFilter.mobileNumber = this.selectedWorkerMobileNumber;
                this.selectedFilter.f_mobileNumber = true;
            }
            if (this.selectedCityID != 0) {
                this.selectedFilter.cityId = this.selectedCityID;
                this.selectedFilter.f_cityId = true;
            }
            if (this.selectedAreaID != 0) {
                this.selectedFilter.areaId = this.selectedAreaID;
                this.selectedFilter.f_areaId = true;
            }
            if (this.selectedWorkerfirstName != "") {
                this.selectedFilter.firstName = this.selectedWorkerfirstName;
                this.selectedFilter.f_firstName = true;
            }
            if (this.selectedWorkerLastName != "") {
                this.selectedFilter.lastName = this.selectedWorkerLastName;
                this.selectedFilter.f_lastName = true;
            }
            if (this.selectedWorkerNationalCode != "") {
                this.selectedFilter.nationalCode = this.selectedWorkerNationalCode;
                this.selectedFilter.f_nationalCode = true;
            }
            if (this.selectedWorkerRegisteredBy != null) {
                if (this.selectedWorkerRegisteredBy.id != 0) {
                    this.selectedFilter.registerById = this.selectedWorkerRegisteredBy.id;
                    this.selectedFilter.f_registerById = true;
                }
            }
            if (this.selectedWorkerVerifiedBy != null) {
                if (this.selectedWorkerVerifiedBy.id != 0) {
                    this.selectedFilter.verifyById = this.selectedWorkerVerifiedBy.id;
                    this.selectedFilter.f_verifyById = true;
                }
            }
            if (this.selectedActive != undefined) {
                this.selectedFilter.active = this.selectedActive;
                this.selectedFilter.f_active = true;
            }
            if (this.selectedHaveBond != undefined) {
                this.selectedFilter.haveBond = this.selectedHaveBond;
                this.selectedFilter.f_haveBond = true;
            }
            if (this.selectedOfferBlock != undefined) {
                this.selectedFilter.offerBlock = this.selectedOfferBlock;
                this.selectedFilter.f_offerBlock = true;
            }
            if (this.selectedCityID != 0) {
                this.selectedFilter.cityId = this.selectedCityID;
                this.selectedFilter.f_cityId = true;
            }

            if (this.selectedAreaID != 0) {
                this.selectedFilter.areaId = this.selectedAreaID;
                this.selectedFilter.f_areaId = true;
            }
            if (this.selectedRegionID != 0) {
                this.selectedFilter.regionId = this.selectedRegionID;
                this.selectedFilter.f_regionId = true;
            }
            if (this.selectedCoverageCityList) {
                this.selectedFilter.s_cityList = [];
                this.selectedCoverageCityList.forEach(city=>{
                    this.selectedFilter.s_cityList.push(city.id);
                });
                this.selectedFilter.f_s_cityList = true;
            }
            if (this.selectedRegisterState != null) {
                this.selectedFilter.registerStateId = this.selectedRegisterState.id;
                this.selectedFilter.f_registerStateId = true;
            }
            if (this.selectedRegisterStartDate != null && this.selectedRegisterStopDate != null) {
                if (this.selectedRegisterStartDate != "" && this.selectedRegisterStopDate != "") {
                    this.selectedFilter.registerTimeStart = this.selectedRegisterStartDate;
                    this.selectedFilter.registerTimeEnd = this.selectedRegisterStopDate;
                    this.selectedFilter.f_registerTime = true;
                }
            }
            if (this.selectedAppVersion != null) {
                this.selectedFilter.appVersion = this.selectedAppVersion;
                this.selectedFilter.f_appVersion = true;
            }
            this.loading = true;
            this.workerMgmService.search(this.selectedFilter).subscribe(response => {
                let out: WorkerSearchResult = new WorkerSearchResult();
                out.workers = [];
                let workers = <WorkerSummary[]>response;
                workers.forEach(element => {
                    //element.registerTime = new Date(element.registerTimeS);
                    out.workers.push(element);
                });
                out.workerSearch = this.selectedFilter;
                out.selectedw_code = this.selectedCode;
                out.selectedJobCategory1 = this.selectedJobCategory1;
                out.selectedJobCategory2 = this.selectedJobCategory2;
                out.selectedJobCategory3 = this.selectedJobCategory3;
                out.selectedw_mobileNumber = this.selectedWorkerMobileNumber;
                out.selectedw_firstName = this.selectedWorkerfirstName;
                out.selectedw_lastName = this.selectedWorkerLastName;
                out.selectedw_nationalCode = this.selectedWorkerNationalCode;
                out.selectedCity = this.selectedCity;
                out.selectedRegion = this.selectedRegion;
                out.selectedArea = this.selectedArea;
                out.selectedRegisterBy = this.selectedWorkerRegisteredBy;
                out.selectedVerifyBy = this.selectedWorkerVerifiedBy;
                out.selectedw_active = this.selectedActive;
                out.selectedw_haveBond = this.selectedHaveBond;
                out.selectedw_offerBlock = this.selectedOfferBlock;
                out.selectedw_cityList = this.selectedCoverageCityList;
                out.selectedRegisterState = this.selectedRegisterState;
                out.selectedRegisterStartDate = this.selectedRegisterStartDate;
                out.selectedRegisterStopDate = this.selectedRegisterStopDate;
                out.selectedAppVersion = this.selectedAppVersion;
                
                this.onSearch.emit(out);
                this.loading = false;
            }, error => {
                let obj: Worker[] = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
                this.loading = false;
            });

        }
        catch (e) {
            console.log(e);
        }
    }
    reset_stateGroupfilter() {
        this.selectedActive = undefined;
    }
    reset_bondGroupfilter(){
        this.selectedHaveBond = undefined;
    }
    reset_offerBlockGroupfilter(){
        this.selectedOfferBlock = undefined;
    }
    onProvinceChange(event: any) {
        this.selectedProvinceID = event.value;
        this.selectedTownshipID = 0;
        this.townshipList = [];
        this._geoService.geTownshipList(this.selectedProvinceID)
            .subscribe(response => {
                let list: TownShip[] = <TownShip[]>response;
                list.forEach(element => {
                    this.townshipList.push({ label: element.name, value: element.id });
                });
                this.selectedTownshipID = this.townshipList[0].value;
                this.initCityList();

            }
                , error => {
                    let obj: TownShip[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }
    onTownshipChange(event: any) {
        try {
            this.selectedTownshipID = event.value;
            this.initCityList();
        }
        catch (e) {
            console.log(e);
        }
    }
    onCityChange(event: any) {
        this.selectedCity = event.value;
        this.selectedCityID = this.selectedCity.id;
        this.initRegionList();
        this.initAreaList();
    }
    onRegionChange(event: any) {
        this.selectedRegion = event.value;
        if (this.selectedRegion != null)
            this.selectedRegionID = this.selectedRegion.id;
        else
            this.selectedRegionID = 0;

        this.initAreaList();
    }


    onAreaChange(event: any) {
        if (this.selectedArea != null) {
            this.selectedAreaID = this.selectedArea.id;
            this.areaName = this.selectedArea.name;
        }
    }
    onJobCategory1Change(event: any) {
        this.selectedJobCategory1 = event.value;
        this.selectedJobCategory2 = new JobCategory2();
        this.selectedJobCategory3 = new JobCategory3();
        this.initJobCategory2List();
        this.initJobCategory3List();
    }

    initTownshipList() {
        this.townshipList = [];
        this.townshipList.push({ label: glob.chooseTownshipMsg, value: 0 });
        if (this.selectedProvinceID != 0) {
            this._geoService.geTownshipList(this.selectedProvinceID)
                .subscribe(response => {
                    let list: TownShip[] = <TownShip[]>response;
                    list.forEach(element => {
                        this.townshipList.push({ label: element.name, value: element.id });
                    });
                }
                    , error => {
                        let obj: TownShip[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
    }

    initCityList() {
        this.cityList = [];
        this.cityList.push({ label: glob.chooseCityMsg, value: 0 });
        if (this.selectedTownshipID != 0) {
            this._geoService.geCityList(this.selectedTownshipID)
                .subscribe(response => {
                    let list: City[] = <City[]>response;
                    list.forEach(element => {
                        this.cityList.push({ label: element.name, value: element });
                    });

                }
                    , error => {
                        let obj: City[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
    }
    initRegionList() {
        this.regionList = [];
        this.regionList.push({ label: this.shared.allRegionLabel, value: null });
        if (this.selectedCityID != 0) {
            this._geoService.geRegionList(this.selectedCityID)
                .subscribe(response => {
                    let list: Region[] = <Region[]>response;
                    list.forEach(element => {
                        this.regionList.push({ label: element.name, value: element });
                    });

                }
                    , error => {
                        let obj: Region[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
    }


    initAreaList() {
        this.selectedArea = null;
        this.selectedAreaID = 0;
        this.loadAreaList();
    }
    loadAreaList() {
        this.areaList = [];
        this.areaList.push({ label: glob.chooseAreaMsg, value: 0 });
        if (this.selectedCityID !== 0 && this.selectedRegionID == 0) {
            this._geoService.geAreaListByCityID(this.selectedCityID)
                .subscribe(response => {
                    let list: Area[] = <Area[]>response;
                    list.forEach(element => {
                        this.areaList.push({ label: element.region.name + " - " + element.name, value: element });
                    });

                }
                    , error => {
                        let obj: Area[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }

        else if (this.selectedCityID !== 0 && this.selectedRegionID != 0) {
            this._geoService.geAreaList(this.selectedRegionID)
                .subscribe(response => {
                    let list: Area[] = <Area[]>response;
                    list.forEach(element => {
                        this.areaList.push({ label: element.name, value: element });
                    });

                }
                    , error => {
                        let obj: Area[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
        else if (this.selectedRegionID == 0) {
            this.areaList.push({ label: this.shared.chooseAreaMsg, value: 0 });
        }
    }
    initJobCategory2List() {
        this.jobCategory2List = [];
        this.jobCategory2Map.clear();
        this.jobCategory2List.push({ label: this.shared.chooseJC2Msg, value: 0 });
        if (this.selectedJobCategory1 != null) {
            if (this.selectedJobCategory1.id != undefined) {
                if (this.selectedJobCategory1.id != 0) {
                    this._jService.geJobCategory2List(this.selectedJobCategory1.id)
                        .subscribe(response => {
                            let list: JobCategory2[] = <JobCategory2[]>response;
                            list.forEach(element => {
                                this.jobCategory2Map.set(element.id, element);
                                this.jobCategory2List.push({ label: element.name, value: element });

                            });

                        }
                            , error => {
                                let obj: JobCategory2[] = error.error;
                                let err: BackendMessage = obj[0].error;
                                this.parseError(error.status, err);
                            }
                        );
                }
            }
        }
    }

    initJobCategory3List() {
        this.jobCategory3List = [];
        this.jobCategory3Map.clear();
        this.jobCategory3List.push({ label: this.shared.allJC3Label, value: null });
        if (this.selectedJobCategory2 != null) {
            if (this.selectedJobCategory2.id != undefined) {
                if (this.selectedJobCategory2.id != 0) {

                    this._jService.geJobCategory3List(this.selectedJobCategory2.id)
                        .subscribe(response => {
                            let list: JobCategory3[] = <JobCategory3[]>response;
                            list.forEach(element => {
                                this.jobCategory3Map.set(element.id, element);
                                this.jobCategory3List.push({ label: element.name, value: element });
                            });

                        }
                            , error => {
                                let obj: JobCategory3[] = error.error;
                                let err: BackendMessage = obj[0].error;
                                this.parseError(error.status, err);
                            }
                        );
                }
            }
        }
    }
    onJobCategory2Change(event: any) {
        this.selectedJobCategory2 = event.value;
        this.selectedJobCategory3 = new JobCategory3();
        this.initJobCategory3List();
    }
    parseError(status: any, err: any) {
        this.errorCntrler.gMessage = [];
        this.msgs = [];
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
            this.msgs.push(element);
        });
    }
}