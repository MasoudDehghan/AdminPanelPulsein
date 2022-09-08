import { environment } from './../../../environments/environment';
import { RegisterStateEnum } from 'app/enums/registerState.enum';
import { WorkerSummary } from './../../entities/workerSummary.class';
import { WorkerExcelView } from './../../entities/workerExcelView.class';
import { Component, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router';

import { ConfirmationService } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
//Import Services
import { WorkerStationMgmService } from '../../services/workerStationMgm.service'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { WorkTypeService } from '../../services/workTypes.service'
import { GeoService } from '../../services/geo.service'
import { JobCateogryService } from '../../services/jobCategory.service'
import { JobResourceService } from '../../services/registerResource.service'
import { SharedValues } from '../../services/shared-values.service'


//Import Entities
import { Worker } from '../../entities/worker.class'
import { WorkerPhone } from '../../entities/workerPhone.class'
import { City } from '../../entities/city.class'
import { Region } from '../../entities/region.class'
import { Area } from '../../entities/area.class'
import { JobCategory1 } from '../../entities/JobCategory1.class'
import { JobCategory2 } from '../../entities/JobCategory2.class'
import { JobCategory3 } from '../../entities/JobCategory3.class'

import { WorkerToJobsMap } from '../../entities/workerToJobsMap.class'
import { User } from '../../entities/user.class'
import { WorkerSearchResult } from '../../entities/woSearchResult.class'
import { WorkerSearch } from '../../entities/workerSearch.class'
import { RegisterState } from '../../entities/registerState.class'

import { ExcelService } from '../../services/excel.service';
import { Sms } from '../../entities/sms.class';
import { UserRoleEnum } from '../../enums/userRole.enum';
import { BasicData } from '../../entities/basicData.class';
import { WorkerService } from '../../services/worker.service';
import { Constant } from '../../shared/constants.class';
import { Table } from 'primeng/table';

@Component({
    moduleId: module.id,
    selector: 'workerMgmComponent',
    templateUrl: './workerMgm.template.html',
    providers: [WorkerStationMgmService, WorkerMgmService, WorkerService, WorkTypeService, GeoService, JobCateogryService, JobResourceService, ExcelService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class WorkerMgmComponent implements OnInit {
    activeLabel: string = this.shared.manageWorkerLabel;
    options: any;
    overlays: any[];
    // @ViewChild('dt') public dataTable: DataTable;
    @ViewChild('dt') public dataTable: Table;
    cols: any[];

    baseImagePath = environment.fileServerUrl;
    workstationHeader = this.shared.showBizInfo;

    workers: WorkerSummary[] = [];
    workers_json: any[];
    filtered_workers_json: any[];
    worker: Worker = new Worker();
    selectedWorker: Worker = new Worker();
    selectedWorkerID: number = 0;
    selectedWorkerFullName: string = "";
    selectedWorkerSummary: WorkerSummary;

    selectedFilter: WorkerSearch = null;
    panelWorker: Worker = new Worker();
    showWorkerList: boolean = false;
    showOnMapFlag: boolean = false;
    errorCntrler: HandleErrorMsg;
    //Add panel
    displayDialog: boolean = false;
    displayMgmPanel: boolean = false;
    displayFilterDialog: boolean = false;
    displayAddWorkerDialog: boolean = false;
    displayEditWorkerDialog: boolean = false;
    displayWorkerDetailDialog: boolean = false;
    displayEditContactDialog: boolean = false;
    displayPhoneDialog: boolean = false;
    displayEditDocumentDialog: boolean = false;
    displayEditServiceDialog: boolean = false;
    displayEditWorkingHourDialog: boolean = false;
    displayImageDialog: boolean = false;
    displayWorkerView: boolean = false;
    displaySMSPanel: boolean = false;
    newWorkerPhone: boolean = false;
    showRegisterStateInfoPanel = false;
    errorMsg: string[] = [];
    hmsgs: GrowlMessage[] = [];

    loading: boolean = false;
    needToLoadWorkStationList: boolean = false;
    editMode: boolean = false;
    selectedWorkerPhone: WorkerPhone;
    workerPhone: WorkerPhone = new WorkerPhone();
    //Dropdown List SelectItems 

    selectedProvinceID: number = Constant.defaultProvinceID;
    selectedTownshipID: number = Constant.defaultTownshipID;
    selectedTownshipName: string = "";
    selectedCity: City = new City();

    selectedCityID: number = Constant.tehranCityID;
    selectedRegion: Region = new Region();
    selectedRegionID: number = 0;
    selectedArea: Area = new Area();
    selectedAreaID: number = 0;
    selectedImagePath: string;
    selectedJobCategory1ID: number = 0;
    selectedJobCategory2ID: number = 0;
    selectedJobCategory3ID: number = 0;
    workerDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
    latitude: number;
    longitude: number;
    zoom: number;
    areaName: string;

    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory2: JobCategory2 = null;
    selectedJobCategory3: JobCategory3 = null;


    displayEditWorkerJobCatDialog: boolean;
    displayEditWorkerPersonalInfoDialog: boolean;
    displayJobCategoryDialog: boolean;
    selectedWorkerToJobMap: WorkerToJobsMap;
    newWorkerToJobsMap: boolean = false;
    workerToJobMap: WorkerToJobsMap = new WorkerToJobsMap();

    chipsFilterValues: string[] = [];
    chipsFilterMap: Map<string, string> = new Map<string, string>();
    filteredCode: string = null;
    filteredJobCategory1: JobCategory1 = null;
    filteredJobCategory2: JobCategory2 = null;
    filteredJobCategory3: JobCategory3 = null;
    filteredWorkerfirstName: string = "";
    filteredWorkerLastName: string = "";
    filteredWorkerNationalCode: string = "";
    filteredWorkerMobileNumber: string = "";
    filteredCity: City = null;
    filteredRegion: Region = null;
    filteredArea: Area = null;
    filteredWorkerRegisteredBy: User = null;
    filteredWorkerVerifiedBy: User = null;
    filteredActive: boolean = undefined;
    filteredHaveBond: boolean = undefined;
    filteredOfferBlock: boolean = undefined;
    filteredCoverageCityList: City[] = [];
    filteredRegisterState: RegisterState = null;
    filteredRegisterStartDate: string = null;
    filteredRegisterStopDate: string = null;
    filteredAppVersion: string = null;
    paramSubscriber: any;
    wsMarkerList: marker[] = [];
    filteredSMSList: Sms[] = [];
    editCapable: boolean = false;
    sensSMSCapable: boolean = false;
    basicData: BasicData;
    jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();
    workerLength: number = 0;
    jobCat3Result: JobCategory3[] = [];

    constructor(private _router: Router, private _activatedRouter: ActivatedRoute,
        private _workerService: WorkerMgmService,
        private _workerSummaryService: WorkerService,
        private confirmationService: ConfirmationService,
        public shared: SharedValues,
        private excelService: ExcelService) {
        this.errorCntrler = new HandleErrorMsg(_router);
        this.excelService = excelService;

    }


    initData() {
        this.activeLabel = this.shared.manageWorkerLabel;
        this.displayDialog = false;
        this.displayWorkerDetailDialog = false;
        this.displayMgmPanel = false;
        this.showOnMapFlag = false;
        this.workers = [];
        this.hmsgs = [];
        this.baseImagePath = environment.fileServerUrl;

        this.zoom = Constant.mapZoomLevel;
        this.latitude = Constant.centerlatitude;
        this.longitude = Constant.centerLongitude;
        let basicData = null;
        let loggedInRole = Number(sessionStorage.getItem("roleId"));
        this.editCapable = false;
        if (loggedInRole == UserRoleEnum.SysAdmin || loggedInRole == UserRoleEnum.Operator_H)
            this.editCapable = true;
        this.sensSMSCapable = false;
        if (loggedInRole == UserRoleEnum.SysAdmin ||
            loggedInRole == UserRoleEnum.Operator_H)
            this.sensSMSCapable = true;


        this.loading = true;
        this.basicData = JSON.parse(localStorage.getItem('basicData'));
        this.basicData.jobCategory3DataList.forEach(el => {
            this.jobCategory3Map.set(el.id, el);
        });


        this.paramSubscriber = this._activatedRouter.params.subscribe(params => {
            let filteredActive = params['filteredActive'];
            this.filteredActive = filteredActive;
            if (filteredActive != undefined)
                this.onFilterActiveWorker(filteredActive);
            else
                this.refreshWorkerList();

        });

        //this.showWorkerListAction();
    }
    ngOnInit() {
        this.paramSubscriber = this._activatedRouter.params.subscribe(params => {
            let _load = params['load'];
            if (_load == 1)
                this.needToLoadWorkStationList = true;
            else
                this.needToLoadWorkStationList = false;
        });
        this.initData();

        this.selectedCity.id = Constant.tehranCityID;
        this.selectedProvinceID = Constant.defaultProvinceID;
        this.selectedTownshipID = Constant.defaultTownshipID;
        this.workerToJobMap.jobCategory3 = new JobCategory3();
        this.displayEditWorkerJobCatDialog = false;
    }

    showWorkerListAction() {
        this.displayDialog = false;
        this.displayWorkerDetailDialog = false;
        this.showOnMapFlag = false;
        this.showWorkerList = true;
        this.displayMgmPanel = true;
        this.activeLabel = this.shared.manageWorkerLabel;
        this.clearFilter();

    }
    clearFilter() {
        this.chipsFilterMap.clear();
        this.chipsFilterValues = [];
        this.filteredCode = null;
        this.filteredJobCategory1 = null;
        this.filteredJobCategory2 = null;
        this.filteredJobCategory3 = null;
        this.filteredWorkerfirstName = "";
        this.filteredWorkerLastName = "";
        this.filteredWorkerNationalCode = "";
        this.filteredWorkerMobileNumber = "";
        this.filteredCity = null;
        this.filteredRegion = null;
        this.filteredArea = null;
        this.filteredWorkerRegisteredBy = null;
        this.filteredWorkerVerifiedBy = null;
        this.filteredActive = undefined;
        this.filteredHaveBond = undefined;
        this.filteredOfferBlock = undefined;
        this.filteredAppVersion = null;
    }
    refreshWorkerList() {
        this.loading = true;
        this.workers = [];
        let __workers = [...this.workers];
        this.workers = __workers;
        this.hmsgs = [];
        this.activeLabel = this.shared.menuItem4Label;
        this.displayDialog = false;
        this.displayWorkerDetailDialog = false;
        this.showOnMapFlag = false;
        this.displayMgmPanel = true;
        this.clearFilter();
        this._workerSummaryService.getExcelList().subscribe(response => {
            this.loading = false;
            this.wsMarkerList = [];
            let _workers: WorkerSummary[] = <WorkerSummary[]>response;
            _workers.forEach(element => {
                this.workerDataLoadedMap.set(element.id, true);
                __workers.push(element);
                this.workers = __workers;
            }
            );
            this.workerLength = this.workers.length;
            this.showWorkerListAction();
        }, error => {
            let err: BackendMessage = error.error.error;
            this.parseError(error.status, err);
            this.loading = false;

        });
    }

    rtvWokreView4Excel(_id: number, element: WorkerSummary): WorkerExcelView {
        try {
            let wxv: WorkerExcelView = new WorkerExcelView();
            wxv.id = _id;
            wxv.name = element.firstName + " " + element.lastName;
            wxv.mobileNumber = element.mobileNumber;
            wxv.registerTime = element.registerTime;
            wxv.updateTime = element.updateTime;


            let jobCat3List: string = "";
            let list = element.jobCat3Ids;
            if (list != undefined) {
                let wsJobCat23Length = list.length;
                if (wsJobCat23Length == 0)
                    jobCat3List = "";
                else if (wsJobCat23Length == 1) {
                    jobCat3List = this.jobCategory3Map.get(list[0]).name;
                }
                else {
                    for (let jcID in list) {
                        let id = list[jcID];
                        jobCat3List = jobCat3List + "," + this.jobCategory3Map.get(id).name;
                    }
                }
            }
            wxv.jobCategory3 = jobCat3List;


            let coverageCityList: string = "";
            let cityList = element.coveredCityList;
            if (element) {
                coverageCityList = cityList.toString();
            }
            wxv.cityList = coverageCityList;

            return wxv;
        }
        catch (e) {
            console.log(e);
        }
    }

    rtvFilteredWorkerView4Excel(_id: number, element: WorkerSummary): WorkerExcelView {
        try {
            let wxv: WorkerExcelView = new WorkerExcelView();
            wxv.code = element.code;
            wxv.name = element.firstName + " " + element.lastName;
            wxv.mobileNumber = element.mobileNumber;
            wxv.state = element.registerState;

            if (element.active)
                wxv.active = this.shared.activeLabel;
            else
                wxv.active = this.shared.inactiveLabel;
            wxv.registerTime = element.registerTime;
            wxv.updateTime = element.updateTime;


            let jobCat3List: string = "";
            let list = element.jobCat3Ids;
            if (list != undefined) {
                let wsJobCat23Length = list.length;
                if (wsJobCat23Length == 0)
                    jobCat3List = "";
                else if (wsJobCat23Length == 1) {
                    jobCat3List = this.jobCategory3Map.get(list[0]).name;
                }
                else {
                    for (let jcID in list) {
                        let id = list[jcID];
                        jobCat3List = jobCat3List + "," + this.jobCategory3Map.get(id).name;
                    }
                }
            }
            wxv.jobCategory3 = jobCat3List;


            let coverageCityList: string = "";
            let cityList = element.coveredCityList;
            if (element) {
                coverageCityList = cityList.toString();
            }
            wxv.cityList = coverageCityList;

            return wxv;
        }
        catch (e) {
            console.log(e);
        }
    }


    toggleEditMode() {
        if (this.editCapable)
            this.editMode = !this.editMode;
    }


    showDialogToAdd() {
        this._router.navigate(['/NewWorkerStationComponent']);
    }
    showFilterDialog() {
        this.displayFilterDialog = true;
    }
    showSMSPanel() {
        if (!this.sensSMSCapable)
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.restrictedAccess });
        this.filteredSMSList = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(wr => {
                let sms: Sms = new Sms();
                sms.mobileNumber = wr.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }
        else {
            this.workers.forEach(wr => {
                let sms: Sms = new Sms();
                sms.mobileNumber = wr.mobileNumber;
                this.filteredSMSList.push(sms);
            });
        }


        this.displaySMSPanel = true;
    }
    onSearchFilterPanel(event) {
        try {

            let data: WorkerSearchResult = event;
            let __workers = [...this.workers];

            __workers = data.workers;
            this.workers = __workers;
            this.workerLength = this.workers.length;
            this.workerDataLoadedMap.clear();
            let cntr = 1;
            this.workers_json = [];
            this.workers.forEach(element => {
                this.workerDataLoadedMap.set(element.id, true);
                cntr++;
            });
            this.selectedFilter = data.workerSearch;
            this.filteredCode = data.selectedw_code;
            this.filteredJobCategory1 = data.selectedJobCategory1;
            this.filteredJobCategory2 = data.selectedJobCategory2;
            this.filteredJobCategory3 = data.selectedJobCategory3;
            this.filteredWorkerfirstName = data.selectedw_firstName;
            this.filteredWorkerLastName = data.selectedw_lastName;
            this.filteredWorkerNationalCode = data.selectedw_nationalCode;
            this.filteredWorkerMobileNumber = data.selectedw_mobileNumber;
            this.filteredCity = data.selectedCity;
            this.filteredRegion = data.selectedRegion;
            this.filteredArea = data.selectedArea;
            this.filteredWorkerRegisteredBy = data.selectedRegisterBy;
            this.filteredWorkerVerifiedBy = data.selectedVerifyBy;
            this.filteredActive = data.selectedw_active;
            this.filteredHaveBond = data.selectedw_haveBond;
            this.filteredOfferBlock = data.selectedw_offerBlock;
            this.filteredCoverageCityList = data.selectedw_cityList;
            this.filteredRegisterState = data.selectedRegisterState;
            this.filteredRegisterStartDate = data.selectedRegisterStartDate;
            this.filteredRegisterStopDate = data.selectedRegisterStopDate;
            this.filteredAppVersion = data.selectedAppVersion;
            this.displayFilterDialog = false;
            this.chipsFilterMap.clear();
            this.chipsFilterValues = [];
            if (this.selectedFilter.f_code) {
                let code: string = data.selectedw_code;
                this.chipsFilterMap.set(this.shared.workerCodeLabel + " : " + code, "f_code");
                this.chipsFilterValues.push(this.shared.workerCodeLabel + " : " + code);
            }
            if (this.selectedFilter.f_jobCategory1Id) {
                let jc1: JobCategory1 = data.selectedJobCategory1;
                this.chipsFilterMap.set(jc1.name, "f_jobCategory1Id");
                this.chipsFilterValues.push(jc1.name);
            }
            if (this.selectedFilter.f_jobCategory2Id) {
                let jc2: JobCategory2 = data.selectedJobCategory2;
                this.chipsFilterMap.set(jc2.name, "f_jobCategory2Id");
                this.chipsFilterValues.push(jc2.name);
            }
            if (this.selectedFilter.f_jobCategory3Id) {
                let jc3: JobCategory3 = data.selectedJobCategory3;
                this.chipsFilterMap.set(jc3.name, "f_jobCategory3Id");
                this.chipsFilterValues.push(jc3.name);
            }

            if (this.selectedFilter.f_firstName) {
                let firstName: string = data.selectedw_firstName;
                this.chipsFilterMap.set(this.shared.firstNameLabel + " : " + firstName, "f_w_firstName");
                this.chipsFilterValues.push(this.shared.firstNameLabel + " : " + firstName);
            }
            if (this.selectedFilter.f_lastName) {
                let lastName: string = data.selectedw_lastName;
                this.chipsFilterMap.set(this.shared.lastNameLabel + " : " + lastName, "f_w_lastName");
                this.chipsFilterValues.push(this.shared.lastNameLabel + " : " + lastName);
            }
            if (this.selectedFilter.f_nationalCode) {
                let nationalCode: string = data.selectedw_nationalCode;
                this.chipsFilterMap.set(this.shared.nationalCodeLabel + " : " + nationalCode, "f_w_nationalCode");
                this.chipsFilterValues.push(this.shared.nationalCodeLabel + " : " + nationalCode);
            }
            if (this.selectedFilter.f_mobileNumber) {
                let mobileNumber: string = data.selectedw_mobileNumber;
                this.chipsFilterMap.set(this.shared.mobileLabel + " : " + mobileNumber, "f_w_mobileNumber");
                this.chipsFilterValues.push(this.shared.mobileLabel + " : " + mobileNumber);
            }
            if (this.selectedFilter.f_cityId) {
                let cityId: number = data.selectedCity.id;
                this.chipsFilterMap.set(this.shared.cityLabel + " : " + data.selectedCity.name, "f_cityId");
                this.chipsFilterValues.push(this.shared.cityLabel + " : " + data.selectedCity.name);
            }
            if (this.selectedFilter.f_regionId) {
                let regionId: number = data.selectedRegion.id;
                this.chipsFilterMap.set(this.shared.regionLabel + " : " + data.selectedRegion.name, "f_regionId");
                this.chipsFilterValues.push(this.shared.regionLabel + " : " + data.selectedRegion.name);
            }
            if (this.selectedFilter.f_areaId) {
                let areaId: number = data.selectedArea.id;
                this.chipsFilterMap.set(this.shared.areaLabel + " : " + data.selectedArea.name, "f_areaId");
                this.chipsFilterValues.push(this.shared.areaLabel + " : " + data.selectedArea.name);
            }
            if (this.selectedFilter.f_registerById) {
                let registerById: number = data.selectedRegisterBy.id;
                this.chipsFilterMap.set(this.shared.registerWsUserName + " : " + data.selectedRegisterBy.userName, "f_registerById");
                this.chipsFilterValues.push(this.shared.registerWsUserName + " : " + data.selectedRegisterBy.userName);
            }
            if (this.selectedFilter.f_verifyById) {
                let verifyById: number = data.selectedVerifyBy.id;
                this.chipsFilterMap.set(this.shared.verifierWsUserName + " : " + data.selectedVerifyBy.userName, "f_verifyById");
                this.chipsFilterValues.push(this.shared.verifierWsUserName + " : " + data.selectedVerifyBy.userName);
            }
            if (this.selectedFilter.f_active) {
                let active: boolean = data.selectedw_active;
                this.chipsFilterMap.set(this.shared.serviceState + " : " + data.selectedw_active, "f_w_active");
                this.chipsFilterValues.push(this.shared.serviceState + " : " + data.selectedw_active);
            }
            if (this.selectedFilter.f_haveBond) {
                this.chipsFilterMap.set(this.shared.bondLabel + " : " + data.selectedw_haveBond, "f_w_haveBond");
                this.chipsFilterValues.push(this.shared.bondLabel + " : " + data.selectedw_haveBond);
            }
            if (this.selectedFilter.f_offerBlock) {
                this.chipsFilterMap.set(this.shared.offerSendLabel + " : " + data.selectedw_offerBlock, "f_w_offerBlock");
                this.chipsFilterValues.push(this.shared.offerSendLabel + " : " + data.selectedw_offerBlock);
            }
            if (this.selectedFilter.f_s_cityList) {
                let cityList: City[] = data.selectedw_cityList;
                let cityListStr = "";
                cityList.forEach(city => {
                    cityListStr = cityListStr + " " + city.name;
                });
                this.chipsFilterMap.set(this.shared.coverageAreaLabel + " : " + cityListStr, "f_s_cityList");
                this.chipsFilterValues.push(this.shared.coverageAreaLabel + " : " + cityListStr);
            }
            if (this.selectedFilter.f_registerStateId) {
                this.chipsFilterMap.set(this.shared.registerStateLabel + " : " + data.selectedRegisterState.name, "f_registerStateId");
                this.chipsFilterValues.push(this.shared.registerStateLabel + " : " + data.selectedRegisterState.name);
            }
            if (this.selectedFilter.f_registerTime) {
                let registerTime: string = data.selectedRegisterStartDate + " " + data.selectedRegisterStopDate;
                this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
                this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);
            }
            if (this.selectedFilter.f_appVersion) {
                let appVersion: string = data.selectedAppVersion;
                this.chipsFilterMap.set(this.shared.appVersionLabel + " : " + appVersion, "f_appVersion");
                this.chipsFilterValues.push(this.shared.appVersionLabel + " : " + appVersion);
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    onRemoveChip(event) {
        let selectedChipFilter: string = this.chipsFilterValues[event];
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_code') {
            this.selectedFilter.f_code = false;
            this.selectedFilter.code = null;
            this.filteredCode = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory1Id') {
            this.selectedFilter.f_jobCategory1Id = false;
            this.selectedFilter.f_jobCategory2Id = false;
            this.selectedFilter.f_jobCategory3Id = false;

            this.filteredJobCategory1 = null;
            this.filteredJobCategory2 = null;
            this.filteredJobCategory3 = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory2Id') {
            this.filteredJobCategory2 = null;
            this.filteredJobCategory3 = null;
            this.selectedFilter.f_jobCategory2Id = false;
            this.selectedFilter.f_jobCategory3Id = false;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory3Id') {
            this.selectedFilter.f_jobCategory3Id = false;
            this.filteredJobCategory3 = null;
        }

        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_firstName') {
            this.selectedFilter.f_firstName = false;
            this.filteredWorkerfirstName = "";
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_lastName') {
            this.selectedFilter.f_lastName = false;
            this.filteredWorkerLastName = "";
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_mobileNumber') {
            this.selectedFilter.f_mobileNumber = false;
            this.filteredWorkerMobileNumber = "";
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_nationalCode') {
            this.selectedFilter.f_nationalCode = false;
            this.filteredWorkerNationalCode = "";
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cityId') {
            this.selectedFilter.f_cityId = false;
            this.filteredCity = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_regionId') {
            this.selectedFilter.f_regionId = false;
            this.filteredRegion = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_areaId') {
            this.selectedFilter.f_areaId = false;
            this.filteredArea = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerById') {
            this.selectedFilter.f_registerById = false;
            this.filteredWorkerRegisteredBy = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_verifyById') {
            this.selectedFilter.f_verifyById = false;
            this.filteredWorkerVerifiedBy = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_active') {
            this.selectedFilter.f_active = false;
            this.filteredActive = undefined;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_haveBond') {
            this.selectedFilter.f_haveBond = false;
            this.filteredHaveBond = undefined;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_w_offerBlock') {
            this.selectedFilter.f_offerBlock = false;
            this.filteredOfferBlock = undefined;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_s_cityList') {
            this.selectedFilter.f_s_cityList = false;
            this.filteredCoverageCityList = [];
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerStateId') {
            this.selectedFilter.f_registerStateId = false;
            this.filteredRegisterState = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerTime') {
            this.selectedFilter.f_registerTime = false;
            this.filteredRegisterStartDate = null;
            this.filteredRegisterStopDate = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_appVersion') {
            this.selectedFilter.f_appVersion = false;
            this.filteredAppVersion = null;
        }
        this.loading = true;
        this.workerDataLoadedMap.clear();
        this.workers = [];
        let __workers = [...this.workers];
        let cntr = 1;
        this._workerSummaryService.search(this.selectedFilter).subscribe(response => {
            this.workers = [];
            let workers = <WorkerSummary[]>response;

            workers.forEach(element => {
                __workers.push(element);
                this.workerDataLoadedMap.set(element.id, true);
                cntr++;
            });

            this.displayFilterDialog = false;
            this.chipsFilterValues.splice(event, 1);
            this.chipsFilterMap.delete(selectedChipFilter);
            this.workers = __workers;
            this.workerLength = this.workers.length;
            this.loading = false;
        }, error => {
            let err: BackendMessage = error.error.error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }
    onErrorFilterPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
    }
    onFilterJobCategory1(event) {
        this.clearFilter();
        let jc1: JobCategory1 = event;
        this.selectedFilter = new WorkerSearch();
        this.selectedFilter.f_jobCategory1Id = true;
        this.selectedFilter.jobCategory1Id = jc1.id;
        this.filteredJobCategory1 = jc1;
        this.loading = true;
        this.workerDataLoadedMap.clear();
        this.workers = [];
        let __workers = [...this.workers];

        this._workerSummaryService.search(this.selectedFilter).subscribe(response => {
            this.workers = [];
            let workers = <WorkerSummary[]>response;
            workers.forEach(element => {
                //element.registerTime = new Date(element.registerTime);
                __workers.push(element);
                this.workerDataLoadedMap.set(element.id, true);
            });
            this.workers = __workers;
            this.workerLength = this.workers.length;

            this.chipsFilterMap.set(jc1.name, "f_jobCategory1Id");
            this.chipsFilterValues.push(jc1.name);
            this.displayMgmPanel = true;
            this.showWorkerList = true;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkerSummary[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });

    }

    onFilterActiveWorker(param: boolean) {
        this.clearFilter();
        this.selectedFilter = new WorkerSearch();
        this.selectedFilter.f_active = true;
        this.selectedFilter.active = param;
        this.selectedFilter.f_registerStateId = true;
        this.selectedFilter.registerStateId = RegisterStateEnum.RegState_FinalConfirm;
        this.filteredRegisterState = new RegisterState();
        this.filteredRegisterState.id = RegisterStateEnum.RegState_FinalConfirm;
        this.filteredRegisterState.name = this.shared.finalOK;
        this.loading = true;
        this.workerDataLoadedMap.clear();
        this.workers = [];
        let __workers = [...this.workers];

        this._workerSummaryService.search(this.selectedFilter).subscribe(response => {
            this.workers = [];
            let workers = <WorkerSummary[]>response;
            workers.forEach(element => {
                //element.registerTime = new Date(element.registerTime);
                __workers.push(element);
                this.workerDataLoadedMap.set(element.id, true);
            });
            this.workers = __workers;
            this.workerLength = this.workers.length;

            this.chipsFilterMap.set(this.shared.registerStateLabel + " : " + this.filteredRegisterState.name, "f_registerStateId");
            this.chipsFilterValues.push(this.shared.registerStateLabel + " : " + this.filteredRegisterState.name);
            this.chipsFilterMap.set(this.shared.serviceState + " : " + param, "f_w_active");
            this.chipsFilterValues.push(this.shared.serviceState + " : " + param);

            this.displayMgmPanel = true;
            this.showWorkerList = true;
            this.loading = false;
        }, error => {
            this.loading = false;
            let obj: WorkerSummary[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });

    }




    cloneToSelectedWorker(worker: Worker) {
        try {
            this.selectedWorker = new Worker();
            this.selectedWorker.id = worker.id;
            this.selectedWorker.active = worker.active;
            this.selectedWorker.haveBond = worker.haveBond;
            this.selectedWorker.offerBlock = worker.offerBlock;
            this.selectedWorker.code = worker.code;

            this.selectedWorker.experienceStart = worker.experienceStart;
            this.selectedWorker.user.ownerFlag = worker.user.ownerFlag;
            this.selectedWorker.user.workerFlag = worker.user.workerFlag;

            this.selectedWorker.registerBy = worker.registerBy;
            this.selectedWorker.registerState = worker.registerState;
            this.selectedWorker.regStateInfo = worker.regStateInfo;
            this.selectedWorker.registerTimeS = worker.registerTimeS;
            this.selectedWorker.requests = worker.requests;
            this.selectedWorker.showCurrentLocation = worker.showCurrentLocation;
            this.selectedWorker.updateTimeS = worker.updateTimeS;
            this.selectedWorker.verifyBy = worker.verifyBy;
            this.selectedWorker.verifyTimeS = worker.verifyTimeS;
            this.selectedWorker.workerDocuments = [];
            worker.workerDocuments.forEach(doc => {
                this.selectedWorker.workerDocuments.push(doc);
            });

            this.selectedWorker.workerPhones = worker.workerPhones;
            this.selectedWorker.workerScore = worker.workerScore;
            this.selectedWorker.workerToJobsMaps = worker.workerToJobsMaps;
            this.selectedWorker.workerToServiceCityMaps = worker.workerToServiceCityMaps;
            this.selectedWorker.workStation = worker.workStation;
            this.selectedWorker.workStation.id = worker.workStation.id;
            this.selectedWorker.workTime = worker.workTime;
            this.selectedWorker.user = worker.user;
            this.selectedWorker.user.id = worker.user.id;
            this.selectedWorker.user.firstName = worker.user.firstName;
            this.selectedWorker.user.lastName = worker.user.lastName;
            this.selectedWorker.user.nationalCode = worker.user.nationalCode;
            this.selectedWorker.user.sex = worker.user.sex;
            this.selectedWorker.user.photo = worker.user.photo;
            this.selectedWorker.user.mobileNumber = worker.user.mobileNumber;
            this.selectedWorker.user.email = worker.user.email;
            this.selectedWorker.user.birthYear = worker.user.birthYear;
            this.selectedWorker.experienceStart = worker.experienceStart;
            this.selectedWorker.user.appVersion = worker.user.appVersion;
        }
        catch (e) {
            console.log(e);
        }
    }


    public findWorkerIndex(wo: WorkerSummary): number {
        for (let i = 0; i < this.workers.length; i++) {
            let element: WorkerSummary = this.workers[i];
            if (element.id == wo.id)
                return i;
        }
    }



    doShowOnMap() {
        this.showOnMapFlag = true;
        this.displayDialog = false;
        this.displayWorkerDetailDialog = false;
        this.displayMgmPanel = false;
    }
    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
    }

    showJobCatEditPanel(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.editMode = false;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.displayEditWorkerJobCatDialog = true;
    }
    cloneFromWorker(worker: Worker) {
        console.log(worker);
        let wrSummary: WorkerSummary = new WorkerSummary();
        wrSummary.id = worker.id;
        wrSummary.firstName = worker.user.firstName;
        wrSummary.lastName = worker.user.lastName;
        wrSummary.mobileNumber = worker.user.mobileNumber;
        wrSummary.active = worker.active;
        wrSummary.offerBlock = worker.offerBlock;
        wrSummary.haveBond = worker.haveBond;
        wrSummary.wsTitle = worker.wsTitle;
        wrSummary.registerState = worker.registerState.name;
        wrSummary.registerTime = worker.registerTimeS;
        wrSummary.code = worker.code;
        wrSummary.updateTime = worker.updateTimeS;
        wrSummary.appVersion = worker.user.appVersion;
        wrSummary.score = worker.workerScore.totalScore;
        worker.workerToJobsMaps.forEach(element => {
            wrSummary.jobCat3Ids.push(element.jobCategory3.id);
        });
        return wrSummary;
    }
    showPersonalInfoEditPanel(worker: WorkerSummary) {
        this.editMode = false;
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.displayEditWorkerPersonalInfoDialog = true;
    }
    closePersonalPanel() {
        this.displayEditWorkerPersonalInfoDialog = false;
    }
    showRegisterStateData(worker: WorkerSummary) {
        this.selectedWorkerSummary = { ...worker };
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.showRegisterStateInfoPanel = true;
    }
    closeRegisterStatePanel() {
        this.showRegisterStateInfoPanel = false;
    }
    showEditContactDialog(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.displayEditContactDialog = true;

    }
    closeEditContactDialog() {
        this.displayEditContactDialog = false;
    }
    showEditDocumentDialog(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.displayEditDocumentDialog = true;

    }
    closeEditDocumentDialog() {
        this.displayEditDocumentDialog = false;
    }
    showEditServiceDialog(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.displayEditServiceDialog = true;

    }
    closeEditServiceDialog() {
        this.displayEditServiceDialog = false;
    }
    showEditWorkingHourDialog(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.displayEditWorkingHourDialog = true;
    }
    closeEditWorkingHourDialog() {
        this.displayEditWorkingHourDialog = false;
    }

    showViewDialog(worker: WorkerSummary) {
        this.selectedWorkerID = worker.id;
        this.selectedWorkerFullName = worker.firstName + " " + worker.lastName;
        this.editMode = false;
        this.displayWorkerView = true;
    }
    closeViewDialog() {
        this.displayWorkerView = false;
    }

    onSaveWorkerJobCat(event) {
        let worker = event;
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(worker);
        __workers[_index] = worker;
        this.workers = __workers;
        this.workerDataLoadedMap.set(worker.id, true);

    }
    onSavePersonalInfoPanel(event) {
        let worker: Worker = event;
        let workerSummary = this.cloneFromWorker(worker);
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(workerSummary);
        __workers[_index] = workerSummary;
        this.workers = __workers;
        this.displayEditWorkerPersonalInfoDialog = false;
    }
    onCloseWorkerJobCat(event) {
        this.displayEditWorkerJobCatDialog = false;
    }
    onClosePersonalInfoPanel(event) {
        this.displayEditWorkerPersonalInfoDialog = false;
    }
    onSaveRegisterInfoPanel(event) {
        let worker: Worker = event;
        let workerSummary = this.cloneFromWorker(worker);
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(workerSummary);
        __workers[_index] = workerSummary;
        this.workers = __workers;

        this.showRegisterStateInfoPanel = false;
    }
    onCloseRegisterInfoPanel(event) {
        this.showRegisterStateInfoPanel = false;
    }
    onSaveDocumentInfoPanel(event) {
        let worker: Worker = event;
        let workerSummary = this.cloneFromWorker(worker);
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(workerSummary);
        __workers[_index] = workerSummary;
        this.workers = __workers;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.displayEditDocumentDialog = false;
    }
    onCloseDocumentInfoPanel(event) {
        this.displayEditDocumentDialog = false;
    }
    onSaveServiceAreaInfoPanel(event) {
        // let worker: Worker = event;
        // let workerSummary = this.cloneFromWorker(worker);
        // let __workers = [...this.workers];
        // let _index = this.findWorkerIndex(workerSummary);
        // __workers[_index] = workerSummary;
        // this.workers = __workers;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.displayEditServiceDialog = false;
    }
    onCloseServiceAreaInfoPanel(event) {
        this.displayEditServiceDialog = false;
    }
    onSaveContactInfoPanel(event) {
        let worker: Worker = event;
        let workerSummary = this.cloneFromWorker(worker);
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(workerSummary);
        __workers[_index] = workerSummary;
        this.workers = __workers;
        this.displayEditContactDialog = false;
    }
    onShowImage(event) {
        this.displayImageDialog = true;
        this.selectedImagePath = event;
    }
    onCloseContactInfoPanel(event) {
        this.displayEditContactDialog = false;
    }
    onShowPhoneDialogToAdd(event) {
        try {
            let wr: Worker = event;
            this.workerPhone = new WorkerPhone();
            this.selectedWorkerID = wr.id;
            this.newWorkerPhone = true;
            this.displayPhoneDialog = true;
        }
        catch (e) {
            console.log(e);
        }
    }
    onShowPhoneDialogToEdit(event) {
        let wr: Worker = event;
        this.workerPhone = this.CloneWorkerPhone(wr.workerPhones[0]);
        this.selectedWorkerID = wr.id;
        this.newWorkerPhone = false;
        this.displayPhoneDialog = true;


    }
    CloneWorkerPhone(wp: WorkerPhone) {
        let workerPhone = new WorkerPhone();
        for (let prop in wp) {
            workerPhone[prop] = wp[prop];
        }
        return workerPhone;
    }
    onClosePhoneInfoPanel(event) {
        this.displayPhoneDialog = event;
        this.editMode = false;
    }
    onErrorPhoneInfoPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
        this.displayPhoneDialog = false;
    }
    onSavePhoneInfoPanel(event) {
        let wr: Worker = event;
        let __workers = [...this.workers];
        let wrSummary = this.cloneFromWorker(this.worker);
        let _index = this.findWorkerIndex(wrSummary);

        __workers[_index] = wrSummary;
        this.workers = __workers;
        this.selectedWorker.workerPhones = [];
        wr.workerPhones.forEach(element => {
            this.selectedWorker.workerPhones.push(element);
        });
        this.displayPhoneDialog = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });

    }

    onSaveWorkingHourInfoPanel(event) {
        let worker: Worker = event;
        let workerSummary = this.cloneFromWorker(worker);
        let __workers = [...this.workers];
        let _index = this.findWorkerIndex(workerSummary);
        __workers[_index] = workerSummary;
        this.workers = __workers;
        this.displayEditWorkingHourDialog = false;
    }
    onCloseWorkingHourInfoPanel(event) {
        this.displayEditWorkingHourDialog = false;
    }
    delete(workerSummary: WorkerSummary) {
        let worker = new Worker();
        worker.id = workerSummary.id;
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                //this.loading = true;
                this._workerService.deleteWorker(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkerIndex(workerSummary);
                        this.workers = this.workers.filter((val, i) => i != index);
                        this.displayDialog = false;
                        this.displayMgmPanel = true;
                        this.hmsgs = [];
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    },
                        error => {
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }
    parseError(status: any, err: any) {
        this.errorCntrler.gMessage = [];
        this.hmsgs = [];
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
            this.hmsgs.push(element);
        });
    }
    exportExcel() {

        this.workers_json = [];
        this.loading = true;

        this._workerSummaryService.getExcelList().subscribe(response => {
            this.loading = false;
            this.wsMarkerList = [];
            let _workers: WorkerSummary[] = <WorkerSummary[]>response;

            let cntr = 1;
            _workers.forEach(element => {
                this.workers_json.push(JSON.parse(JSON.stringify(this.rtvWokreView4Excel(cntr, element))));
                cntr++;
            }
            );
            this.excelService.exportAsExcelFile(this.workers_json, 'workers');

        }, error => {
            let err: BackendMessage = error.error.error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }

    exportFilteredDataExcel() {
        let cntr = 1;
        this.filtered_workers_json = [];
        let filteredWorkerList: WorkerSummary[] = [];
        if (this.dataTable.filteredValue != undefined) {
            this.dataTable.filteredValue.forEach(wr => {
                let entity = <WorkerSummary>wr;
                filteredWorkerList.push(entity);
            });
        }
        else {
            this.workers.forEach(wr => {
                let entity = <WorkerSummary>wr;
                filteredWorkerList.push(entity);
            });
        }
        filteredWorkerList.forEach(element => {
            console.log(this.workers);
            console.log(this.workers.find(wr => wr.id == element.id));
            element = this.workers.find(wr => wr.id == element.id);
            this.filtered_workers_json.push(JSON.parse(JSON.stringify(this.rtvFilteredWorkerView4Excel(cntr, element))));
            cntr++;
        }
        );
        this.excelService.exportAsExcelFile(this.filtered_workers_json, 'filteredWorkers');



    }
    onFilter(e) {
        let list = e.filteredValue;
        this.workerLength = list.length;
    }

    searchJobCat3(event) {
        this.jobCat3Result = [];
        let value = event.query;
        this.basicData.jobCategory3DataList.forEach(elemant => {
            if (elemant.name.indexOf(value) != -1) {
                this.jobCat3Result.push(elemant);
            }
        });
    }
    selectJobCat3(event) {
        console.log(event);
        let jc3 = <JobCategory3>event;
        this.selectedFilter = new WorkerSearch();
        this.selectedFilter.f_jobCategory3Id = true;
        this.selectedFilter.jobCategory3Id = jc3.id;
        this.loading = true;
        this.workerDataLoadedMap.clear();
        this.workers = [];
        let __workers = [...this.workers];
        let cntr = 1;
        this._workerSummaryService.search(this.selectedFilter).subscribe(response => {
            this.workers = [];
            let workers = <WorkerSummary[]>response;

            workers.forEach(element => {
                __workers.push(element);
                this.workerDataLoadedMap.set(element.id, true);
                cntr++;
            });

            this.displayFilterDialog = false;

            this.chipsFilterMap.set(jc3.name, "f_jobCategory3Id");
            this.chipsFilterValues.push(jc3.name);
            this.workers = __workers;
            this.workerLength = this.workers.length;
            this.loading = false;
        }, error => {
            let err: BackendMessage = error.error.error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }
}

interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

