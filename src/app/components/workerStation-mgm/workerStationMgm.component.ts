import { BasicData } from './../../entities/basicData.class';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, DataTable, SelectItem } from 'primeng/primeng';
import { environment } from '../../../environments/environment';
import { Area } from '../../entities/area.class';
import { City } from '../../entities/city.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { JobCategory2 } from '../../entities/JobCategory2.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { JobResource } from '../../entities/jobResource.class';
import { BackendMessage } from '../../entities/Msg.class';
import { PhoneType } from '../../entities/phoneType.class';
import { PositionType } from '../../entities/positionType.class';
import { Province } from '../../entities/province.class';
import { Region } from '../../entities/region.class';
import { RegisterState } from '../../entities/registerState.class';
import { TownShip } from '../../entities/township.class';
import { User } from '../../entities/user.class';
import { Worker } from '../../entities/worker.class';
import { WorkerToJobsMap } from '../../entities/workerToJobsMap.class';
//  Import Entities
import { WorkStation } from '../../entities/workStation.class';
import { WorkStationPhone } from '../../entities/workStationPhone.class';
import { WorkStationSearch } from '../../entities/WorkStationSearch.class';
import { WorkType } from '../../entities/WorkType.class';
import { WorkStationSearchResult } from '../../entities/wsSearchResult.class';
import { PhoneTypeEnum } from '../../enums/phoneType.enum';
import { BackendRequestClass } from '../../services/backend.request';
import { GeoService } from '../../services/geo.service';
import { JobCateogryService } from '../../services/jobCategory.service';
import { JobResourceService } from '../../services/registerResource.service';
import { SharedValues } from '../../services/shared-values.service';
import { WorkerMgmService } from '../../services/workerMgm.service';
//  Import Services
import { WorkerStationMgmService } from '../../services/workerStationMgm.service';
import { WorkTypeService } from '../../services/workTypes.service';
import { Constant } from '../../shared/constants.class';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { DocumentType } from './../../entities/DocumentType.class';
import { UserRoleEnum } from './../../enums/userRole.enum';




@Component({
    moduleId: module.id,
    selector: 'workerStationMgmComponent',
    templateUrl: './workerStationMgm.template.html',
    providers: [WorkerStationMgmService, WorkerMgmService, WorkTypeService, GeoService, JobCateogryService, JobResourceService,BackendRequestClass],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class WorkerStationMgmComponent implements OnInit {
    loggedInRole: number;
    activeLabel = this.shared.menuItem4Label;
    options: any;
    overlays: any[];
    @ViewChild('dataTable') public dataTable: DataTable;
    baseImagePath = environment.fileServerUrl;
    workstationHeader = this.shared.showBizInfo;

    workStations: WorkStation[] = [];
    workStation: WorkStation = new WorkStation();
    rowSelectedWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    selectedWorker: Worker = new Worker();
    selectedFilter: WorkStationSearch = null;
    panelWorkStation: WorkStation = new WorkStation();
    showWorkStationList = false;
    showOnMapFlag = false;
    errorCntrler: HandleErrorMsg;
    //  Add panel
    displayDialog = false;
    displayMgmPanel = false;
    displayFilterDialog = false;
    displayAddWorkerDialog = false;
    displayChangleWorkstationOwner = false;
    displayEditWorkerDialog = false;
    displayWorkStationDetailDialog = false;
    displayWorkStationDetailDialog_Loading = false;

    changeWSOwnerForm: FormGroup;
    selectedWs_UserList: User[] = [];
    selectedWSOwnerID = 0;

    errorMsg: string[] = [];
    hmsgs: GrowlMessage[] = [];

    loading = false;

    editMode = false;

    //  Dropdown List SelectItems
    workTypeList: SelectItem[] = [];
    filterWorkTypeList: SelectItem[] = [];
    filterPhoneTypeList: SelectItem[] = [];
    filterPhoneTypeList2: SelectItem[] = [];
    registerResourceList: SelectItem[] = [];
    provinceList: SelectItem[] = [];
    chooseProvinceList: SelectItem[] = [];
    townshipList: SelectItem[] = [];
    cityList: SelectItem[] = [];
    regionList: SelectItem[] = [];
    areaList: SelectItem[] = [];
    jobCategory1List: SelectItem[] = [];
    filteredJobCatgory1List: SelectItem[] = [];
    editJobCategory1List: SelectItem[] = [];
    specifiedJobCategory1List: SelectItem[] = [];
    jobCategory2List: SelectItem[] = [];
    editJobCategory2List: SelectItem[] = [];
    jobCategory3List: SelectItem[] = [];
    editJobCategory3List: SelectItem[] = [];
    usersList: SelectItem[] = [];
    positionTypeList: SelectItem[] = [];
    registerStateList: SelectItem[] = [];
    docTypeList: SelectItem[] = [];

    selectedProvinceID = Constant.defaultProvinceID;
    selectedTownshipID = Constant.defaultTownshipID;
    selectedTownshipName = '';
    selectedCity: City = new City();

    selectedCityID = Constant.tehranCityID;
    selectedRegion: Region = new Region();
    selectedRegionID = 0;
    selectedArea: Area = new Area();
    selectedAreaID = 0;

    selectedJobCategory1ID = 0;
    selectedJobCategory2ID = 0;
    selectedJobCategory3ID = 0;
    jobCategory1Map: Map<number, JobCategory1> = new Map<number, JobCategory1>();
    jobCategory2Map: Map<number, JobCategory2> = new Map<number, JobCategory2>();
    jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();
    selectedWorkStationTitle: string;
    selectedWorkType: WorkType = new WorkType();
    workerDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
    latitude;
    longitude;
    zoom;
    areaName: string;

    selectedJobCategory1: JobCategory1 = null;
    selectedJobCategory2: JobCategory2 = null;
    selectedJobCategory3: JobCategory3 = null;

    ownerWorker: Worker;
    showContactInfoPanel = false;
    showJobInfoPanel = false;
    showJobInfoPanel_Loading = false;
    showBizInfoPanel = false;
    showBizInfoPanel_Loading = false;
    showPersonalInfoPanel = false;
    showPersonalInfoPanel_Loading: boolean = false;
    showLocationInfoPanel = false;
    showLocationInfoPanel_Loading = false;
    showRegisterStateInfoPanel = false;
    showRegisterStateInfoPanel_Loading = false;
    showDocumentInfoPanel = false;
    showDocumentInfoPanel_Loading = false;
    selectedImageCatalog: any;
    displayCatalogImageDialog = false;

    displayPhoneDialog;
    selectedWorkStationPhone: WorkStationPhone;
    workStationPhone: WorkStationPhone = new WorkStationPhone();
    newWorkStationPhone = false;
    displayJobCategoryDialog;
    selectedWorkerToJobMap: WorkerToJobsMap;
    newWorkerToJobsMap = false;
    workerToJobMap: WorkerToJobsMap = new WorkerToJobsMap();

    chipsFilterValues: string[] = [];
    chipsFilterMap: Map<string, string> = new Map<string, string>();
    filteredCode = null;
    filteredJobCategory1: JobCategory1 = null;
    filteredJobCategory2: JobCategory2 = null;
    filteredJobCategory3: JobCategory3 = null;
    filteredWorkStationTitle = '';
    filteredWorkType: WorkType = null;
    filteredWorkStationWorkerTelNumber = '';
    filteredOfficeRegisterNumber = '';
    filteredOfficeNationalCode = '';
    filteredStoreLicenseNumber = '';
    filteredWorkStationWorkerfirstName = '';
    filteredWorkStationWorkerLastName = '';
    filteredWorkStationWorkerNationalCode = '';
    filteredCity: City = null;
    filteredRegion: Region = null;
    filteredArea: Area = null;
    filteredWorkStationRegisteredBy: User = null;
    filteredWorkStationVerifiedBy: User = null;
    filteredVerfied = undefined;

    paramSubscriber: any;
    wsPaginatorFirst = 0;
    savedWSPaginatorFirst = 0;
    wsPaginatorRows = 6;
    wsSortField = '';
    wsSortOrder = -1;
    wsMarkerList: marker[] = [];

    expandedItems: Array<any> = new Array<any>();

    editCapable:boolean = false;
    basicData: BasicData;
    constructor(private _router: Router, private _activatedRouter: ActivatedRoute,
        private _dService: WorkerStationMgmService,
        private _workerService: WorkerMgmService,
        private _geoService: GeoService,
        private _jService: JobCateogryService,
        private confirmationService: ConfirmationService,
        private _fb: FormBuilder,
        public shared: SharedValues,
        private _BackendRequestClass: BackendRequestClass) {
        this.errorCntrler = new HandleErrorMsg(_router)

    }


    initData() {
        this.workTypeList = [];
        this.registerResourceList = [];
        this.provinceList = [];
        this.chooseProvinceList = [];
        this.townshipList = [];
        this.cityList = [];
        this.regionList = [];
        this.areaList = [];
        this.jobCategory1List = [];
        this.filteredJobCatgory1List = [];
        this.usersList = [];
        this.positionTypeList = [];
        this.registerStateList = [];
        this.jobCategory1List = [];
        this.jobCategory1Map.clear();
        this.activeLabel = this.shared.menuItem4Label;
        this.displayDialog = false;
        this.displayWorkStationDetailDialog = false;
        this.displayMgmPanel = false;
        this.showOnMapFlag = false;
        this.workStations = [];
        this.hmsgs = [];
        this.baseImagePath = environment.fileServerUrl;

        this.zoom = 12;
        this.latitude = 35.6891980;
        this.longitude = 51.3889740;
        this.loggedInRole = Number(sessionStorage.getItem("roleId"));
        this.editCapable = false;
        if(this.loggedInRole == UserRoleEnum.SysAdmin || this.loggedInRole == UserRoleEnum.Operator_H)
            this.editCapable = true;
        

        try {
            this.basicData = JSON.parse(localStorage.getItem('basicData'));
            this.initFilterPhoneTypeList();


            this.changeWSOwnerForm = this._fb.group({
                isOwner: ['']
            });



        } catch (e) { console.log(e); }
    }

    ngOnInit() {
        this.loading = true;
        this.initData();
        this.paramSubscriber = this._activatedRouter.params.subscribe(params => {
            let _jc1 = params['jc1'];
            if(_jc1 == undefined){
                this.refreshWorkStationList();
                this.selectedCity.id = Constant.tehranCityID;
                this.selectedProvinceID = Constant.defaultProvinceID;
                this.selectedTownshipID = Constant.defaultTownshipID;
                this.workerToJobMap.jobCategory3 = new JobCategory3();
                this.showContactInfoPanel = false;
                this.showJobInfoPanel = false;
            }
            else{
                this._jService.lookupById(_jc1).subscribe(result=>{
                    this.onFilterJobCategory1(result);
                },error=>{
                    let obj: JobCategory1 = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                });
            }



        });

        


    }
    onRowExpand(event) {
        let _list: Array<any> = [];
        let tobeExpandWS: WorkStation = <WorkStation>event.data;
        this.expandedItems.forEach(element => {
            let ws: WorkStation = <WorkStation>element;
            this.selectedWorkStation = ws;
            if (ws.id == tobeExpandWS.id) {
                _list.push(element);
            }

        });
        this.expandedItems = _list;

    }
    showWorkStationListAction() {
        this.displayDialog = false;
        this.displayWorkStationDetailDialog = false;
        this.showOnMapFlag = false;
        this.showWorkStationList = true;
        this.displayMgmPanel = true;
        this.activeLabel = this.shared.menuItem4Label;
        this.clearFilter();

    }
    clearFilter() {
        this.chipsFilterMap.clear();
        this.chipsFilterValues = [];
        this.filteredCode = null;
        this.filteredJobCategory1 = null;
        this.filteredJobCategory2 = null;
        this.filteredJobCategory3 = null;
        this.filteredWorkStationTitle = '';
        this.filteredWorkType = null;
        this.filteredWorkStationWorkerTelNumber = '';
        this.filteredOfficeRegisterNumber = '';
        this.filteredOfficeNationalCode = '';
        this.filteredStoreLicenseNumber = '';
        this.filteredWorkStationWorkerfirstName = '';
        this.filteredWorkStationWorkerLastName = '';
        this.filteredWorkStationWorkerNationalCode = '';
        this.filteredCity = null;
        this.filteredRegion = null;
        this.filteredArea = null;
        this.filteredWorkStationRegisteredBy = null;
        this.filteredWorkStationVerifiedBy = null;
        this.filteredVerfied = undefined;

    }

    justRefreshWorkStationList() {
        this.loading = true;
        this.workStations = [];
        let __workStations = [...this.workStations];
        this.workStations = __workStations;
        this.hmsgs = [];
        this.jobCategory1Map.clear();
        this.clearFilter();
        this._dService.getWorkStationList().subscribe(response => {
            this.showWorkStationList = true;
            this.loading = false;
            this.onRtvWorkStationList(<WorkStation[]>response);

        }, error => {
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;

        });
    }
    refreshWorkStationList() {
        this.loading = true;
        this.workStations = [];
        let __workStations = [...this.workStations];
        this.workStations = __workStations;
        this.hmsgs = [];
        this.jobCategory1Map.clear();
        this.activeLabel = this.shared.menuItem4Label;
        this.displayDialog = false;
        this.displayWorkStationDetailDialog = false;
        this.showOnMapFlag = false;
        this.displayMgmPanel = true;
        this.clearFilter();
        this._dService.getWorkStationList().subscribe(response => {
            this.showWorkStationList = true;
            this.loading = false;
            this.onRtvWorkStationList(<WorkStation[]>response);

        }, error => {
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }


    toggleEditMode() {
        if(this.editCapable)
            this.editMode = !this.editMode;
    }



    initFilterPhoneTypeList() {

        this.filterPhoneTypeList = [];
        this.filterPhoneTypeList.push({ label: this.shared.phoneLabel2, value: PhoneTypeEnum.landline });
        this.filterPhoneTypeList.push({ label: this.shared.mobileLabel2, value: PhoneTypeEnum.mobile });
        this.filterPhoneTypeList.push({ label: this.shared.faxLabel2, value: PhoneTypeEnum.fax });
    }



    initTownshipList() {
        this.townshipList = [];
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

    initCityList() {
        this.cityList = [];
        this._geoService.geCityList(this.selectedTownshipID)
            .subscribe(response => {
                let list: City[] = <City[]>response;
                list.forEach(element => {
                    this.cityList.push({ label: element.name, value: element });
                    if (element.id == Constant.tehranCityID) {
                        this.selectedCity = element;
                        this.selectedCity.centerLat = element.centerLat;
                        this.selectedCity.centerLong = element.centerLong;
                    }
                });

            }
                , error => {
                    let obj: City[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }
    initRegionList() {
        this.regionList = [];
        this.regionList.push({ label: this.shared.allRegionLabel, value: 0 });
        this._geoService.geRegionList(this.selectedCityID)
            .subscribe(response => {
                let list: Region[] = <Region[]>response;
                list.forEach(element => {
                    this.regionList.push({ label: element.name, value: element.id });
                });

            }
                , error => {
                    let obj: Region[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }
    initAreaList() {
        this.selectedArea = null;
        this.selectedAreaID = 0;
        this.loadAreaList();
    }
    loadAreaList() {
        this.areaList = [];
        this.areaList.push({ label: this.shared.chooseAreaMsg, value: 0 });
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

    initJobCategory1List() {
        try {
            this.jobCategory1List = [];
            this.editJobCategory1List = [];
            this.jobCategory1Map.clear();
            this.jobCategory1List.push({ label: this.shared.chooseJC1Msg, value: 0 });
            this.editJobCategory1List.push({ label: this.shared.chooseJC1Msg, value: 0 });

            this._jService.geJobCategory1List()
                .subscribe(response => {
                    let list: JobCategory1[] = <JobCategory1[]>response;
                    list.forEach(element => {
                        this.jobCategory1Map.set(element.id, element);
                        this.jobCategory1List.push({ label: element.name, value: element });
                        this.editJobCategory1List.push({ label: element.name, value: element.id });

                    });
                }
                    , error => {
                        let obj: JobCategory1[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
        catch (e) {
            console.log(e);
        }

    }

    initJobCategory2List() {
        this.jobCategory2List = [];
        this.editJobCategory2List = [];
        this.jobCategory2Map.clear();
        this.jobCategory2List.push({ label: this.shared.chooseJC2Msg, value: 0 });
        this.editJobCategory2List.push({ label: this.shared.chooseJC2Msg, value: 0 });
        if (this.selectedJobCategory1 != null) {
            if (this.selectedJobCategory1.id != undefined) {
                if (this.selectedJobCategory1.id != 0) {
                    this._jService.geJobCategory2List(this.selectedJobCategory1.id)
                        .subscribe(response => {
                            let list: JobCategory2[] = <JobCategory2[]>response;
                            list.forEach(element => {
                                this.jobCategory2Map.set(element.id, element);

                                this.jobCategory2List.push({ label: element.name, value: element });
                                this.editJobCategory2List.push({ label: element.name, value: element.id });

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
        this.editJobCategory3List = [];
        this.jobCategory3Map.clear();
        this.jobCategory3List.push({ label: this.shared.allJC3Label, value: null });
        this.editJobCategory3List.push({ label: this.shared.allLabel, value: 0 });
        if (this.selectedJobCategory2 != null) {
            if (this.selectedJobCategory2.id != undefined) {
                if (this.selectedJobCategory2.id != 0) {

                    this._jService.geJobCategory3List(this.selectedJobCategory2.id)
                        .subscribe(response => {
                            let list: JobCategory3[] = <JobCategory3[]>response;
                            list.forEach(element => {
                                this.jobCategory3Map.set(element.id, element);

                                this.jobCategory3List.push({ label: element.name, value: element });
                                this.editJobCategory3List.push({ label: element.name, value: element.id });

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

    onEditInitJobCategory(event: any) {
        this.selectedJobCategory2 = event.data.jobCategory2;
        this.initJobCategory3List();
    }


    showDialogToAdd() {
        this._router.navigate(['/NewWorkerStationComponent']);
    }
    showFilterDialog() {
        this.displayFilterDialog = true;
    }

    onSearchFilterPanel(event) {
        try {

            let data: WorkStationSearchResult = event;
            this.onRtvWorkStationList(data.workstations);
            this.selectedFilter = data.workStationSearch;
            this.filteredCode = data.selectedCode;
            this.filteredJobCategory1 = data.selectedJobCategory1;
            this.filteredJobCategory2 = data.selectedJobCategory2;
            this.filteredJobCategory3 = data.selectedJobCategory3;
            this.filteredWorkStationTitle = data.selectedWorkStationTitle;
            this.filteredWorkType = data.selectedWorkType;
            this.filteredWorkStationWorkerTelNumber = data.selectedWorkStationWorkerTelNumber;
            this.filteredOfficeRegisterNumber = data.selectedOfficeRegisterNumber;
            this.filteredOfficeNationalCode = data.selectedOfficeNationalCode;
            this.filteredStoreLicenseNumber = data.selectedStoreLicenseNumber;
            this.filteredWorkStationWorkerfirstName = data.selectedWorkStationWorkerfirstName;
            this.filteredWorkStationWorkerLastName = data.selectedWorkStationWorkerLastName;
            this.filteredWorkStationWorkerNationalCode = data.selectedWorkStationWorkerNationalCode;
            this.filteredCity = data.selectedCity;
            this.filteredRegion = data.selectedRegion;
            this.filteredArea = data.selectedArea;
            this.filteredWorkStationRegisteredBy = data.selectedWorkStationRegisteredBy;
            this.filteredWorkStationVerifiedBy = data.selectedWorkStationVerifiedBy;
            this.filteredVerfied = data.selectedVerfied;
            this.displayFilterDialog = false;
            this.chipsFilterMap.clear();
            this.chipsFilterValues = [];
            if (this.selectedFilter.f_code) {
                let code = data.selectedCode;
                this.chipsFilterMap.set(this.shared.bizCodeLabel + " : " + code, "f_code");
                this.chipsFilterValues.push(this.shared.bizCodeLabel + " : " + code);
            }
            if (this.selectedFilter.f_jobCategory1Id) {
                let jc1: JobCategory1 = data.selectedJobCategory1;
                this.chipsFilterMap.set(jc1.name, "f_jobCategory1Id");
                this.chipsFilterValues.push(jc1.name);
            }

            if (this.selectedFilter.f_title) {
                let title = data.selectedWorkStationTitle;
                this.chipsFilterMap.set(this.shared.bizNameLabel + " : " + title, "f_title");
                this.chipsFilterValues.push(this.shared.bizNameLabel + " : " + title);
            }
            if (this.selectedFilter.f_workTypeId) {
                let wkTypeName = data.selectedWorkType.name;
                this.chipsFilterMap.set(this.shared.workTypeLabelFa + " : " + wkTypeName, "f_workTypeId");
                this.chipsFilterValues.push(this.shared.workTypeLabelFa + " : " + wkTypeName);
            }
            if (this.selectedFilter.f_phoneNumber) {
                let phone = data.selectedWorkStationWorkerTelNumber;
                this.chipsFilterMap.set(this.shared.telLabel + " : " + phone, "f_workStationPhoneNumber");
                this.chipsFilterValues.push(this.shared.telLabel + " : " + phone);
            }
            if (this.selectedFilter.f_officeRegisterNumber) {
                let officeRegisterNumber = data.selectedOfficeRegisterNumber;
                this.chipsFilterMap.set(this.shared.officeRegisterCodeLabel + " : " + officeRegisterNumber, "f_officeRegisterNumber");
                this.chipsFilterValues.push(this.shared.officeRegisterCodeLabel + " : " + officeRegisterNumber);
            }
            if (this.selectedFilter.f_officeNationalCode) {
                let officeNationalCode = data.selectedOfficeNationalCode;
                this.chipsFilterMap.set(this.shared.officeNationalCodeLabel + " : " + officeNationalCode, "f_officeNationalCode");
                this.chipsFilterValues.push(this.shared.officeNationalCodeLabel + " : " + officeNationalCode);
            }
            if (this.selectedFilter.f_storeLicenseNumber) {
                let storeLicenseNumber = data.selectedStoreLicenseNumber;
                this.chipsFilterMap.set(this.shared.storeLicenseLabel + " : " + storeLicenseNumber, "f_storeLicenseNumber");
                this.chipsFilterValues.push(this.shared.storeLicenseLabel + " : " + storeLicenseNumber);
            }

            if (this.selectedFilter.f_cityId) {
                let cityId = data.selectedCity.id;
                this.chipsFilterMap.set(this.shared.cityLabel + " : " + data.selectedCity.name, "f_cityId");
                this.chipsFilterValues.push(this.shared.cityLabel + " : " + data.selectedCity.name);
            }
            if (this.selectedFilter.f_regionId) {
                let regionId = data.selectedRegion.id;
                this.chipsFilterMap.set(this.shared.regionLabel + " : " + data.selectedRegion.name, "f_regionId");
                this.chipsFilterValues.push(this.shared.regionLabel + " : " + data.selectedRegion.name);
            }
            if (this.selectedFilter.f_areaId) {
                let areaId = data.selectedArea.id;
                this.chipsFilterMap.set(this.shared.areaLabel + " : " + data.selectedArea.name, "f_areaId");
                this.chipsFilterValues.push(this.shared.areaLabel + " : " + data.selectedArea.name);
            }
            if (this.selectedFilter.f_registerById) {
                let registerById = data.selectedWorkStationRegisteredBy.id;
                this.chipsFilterMap.set(this.shared.registerWsUserName + " : " + data.selectedWorkStationRegisteredBy.userName, "f_registerById");
                this.chipsFilterValues.push(this.shared.registerWsUserName + " : " + data.selectedWorkStationRegisteredBy.userName);
            }
            if (this.selectedFilter.f_verifyById) {
                let verifyById = data.selectedWorkStationVerifiedBy.id;
                this.chipsFilterMap.set(this.shared.verifierWsUserName + " : " + data.selectedWorkStationVerifiedBy.userName, "f_verifyById");
                this.chipsFilterValues.push(this.shared.verifierWsUserName + " : " + data.selectedWorkStationVerifiedBy.userName);
            }
            if (this.selectedFilter.f_verified) {
                let f_verified = data.selectedVerfied;
                this.chipsFilterMap.set(this.shared.state + ":" + f_verified + '', "f_verified");
                if (f_verified == 1)
                    this.chipsFilterValues.push(this.shared.state + ":" + f_verified + '');
                if (f_verified == 2 || f_verified == 0)
                    this.chipsFilterValues.push(this.shared.state + ":" + f_verified + '');
            }
        }
        catch (e) {
            console.log(e);
        }

    }
    onRemoveChip(event) {
        //console.log(event);
        let selectedChipFilter = this.chipsFilterValues[event];
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_code') {
            this.selectedFilter.f_code = false;
            this.selectedFilter.code = null;
            this.filteredCode = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_jobCategory1Id') {
            this.selectedFilter.f_jobCategory1Id = false;
            this.filteredJobCategory1 = null;
            this.filteredJobCategory2 = null;
            this.filteredJobCategory3 = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_title') {
            this.selectedFilter.f_title = false;
            this.filteredWorkStationTitle = '';
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_workTypeId') {
            this.selectedFilter.f_workTypeId = false;
            this.filteredWorkType = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_workStationPhoneNumber') {
            this.selectedFilter.f_phoneNumber = false;
            this.filteredWorkStationWorkerTelNumber = '';
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_officeRegisterNumber') {
            this.selectedFilter.f_officeRegisterNumber = false;
            this.filteredOfficeRegisterNumber = '';
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_officeNationalCode') {
            this.selectedFilter.f_officeNationalCode = false;
            this.filteredOfficeNationalCode = '';
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_storeLicenseNumber') {
            this.selectedFilter.f_storeLicenseNumber = false;
            this.filteredStoreLicenseNumber = '';
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
            this.filteredWorkStationRegisteredBy = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_verifyById') {
            this.selectedFilter.f_verifyById = false;
            this.filteredWorkStationVerifiedBy = null;
        }
        if (this.chipsFilterMap.get(selectedChipFilter) == 'f_verified') {
            this.selectedFilter.f_verified = false;
            this.filteredVerfied = undefined;
        }

        this.loading = true;

        this._dService.search(this.selectedFilter).subscribe(response => {
            this.onRtvWorkStationList(<WorkStation[]>response);
            this.displayFilterDialog = false;
            this.chipsFilterValues.splice(event, 1);
            this.chipsFilterMap.delete(selectedChipFilter);
            this.loading = false;
        }, error => {
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
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
        this.selectedFilter = new WorkStationSearch();
        this.selectedFilter.f_jobCategory1Id = true;
        this.selectedFilter.jobCategory1Id = jc1.id;
        this.filteredJobCategory1 = jc1;
        this.loading = true;

        this._dService.search(this.selectedFilter).subscribe(response => {
            this.onRtvWorkStationList(<WorkStation[]>response);
            this.chipsFilterMap.set(jc1.name, "f_jobCategory1Id");
            this.chipsFilterValues.push(jc1.name);
            this.displayMgmPanel = true;
            this.showWorkStationList = true;
            this.loading = false;
        }, error => {
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });

    }
    onCloseBizInfoPanel(event) {
        this.showBizInfoPanel = event;
        this.editMode = false;
    }
    onClosePersonalInfoPanel(event) {
        this.showPersonalInfoPanel = event;
        this.editMode = false;
    }
    onCloseDocumentInfoPanel(event) {
        this.showDocumentInfoPanel = event;
        this.editMode = false;
    }

    onSaveBizInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;

        this.showBizInfoPanel = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }
    onSaveDocumentInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
    }
    onAddWorker(event) {
        let worker: Worker = event;
        let __workStations = [...this.workStations];
        let _workers = [...this.selectedWorkStation.workers];
        let _index = this.findWorkStationIndex(this.selectedWorkStation);
        _workers.push(worker);
        __workStations[_index].workers.push(worker);
        this.selectedWorkStation.workers = _workers;
        this.workStations = __workStations;
        this.displayAddWorkerDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }
    onEditWorker(event) {
        let worker: Worker = event;
        let __workStations = [...this.workStations];
        let _workers = [...this.selectedWorkStation.workers];
        let _index = this.findWorkStationIndex(this.selectedWorkStation);
        let _wIndex = this.findWorkerIndex(worker);
        __workStations[_index].workers[_wIndex] = worker;
        _workers[_wIndex] = worker;
        this.selectedWorkStation.workers = _workers;
        this.workStations = __workStations;
        this.displayEditWorkerDialog = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }
    onDisplayCatalogImageDialog(event) {
        this.displayCatalogImageDialog = true;
        this.selectedImageCatalog = event;
    }
    onUploadBizInfoPanel(event) {
        this.hmsgs.push({ severity: 'info', summary: '', detail: event });
    }

    onSaveLocationInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.showLocationInfoPanel = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.setCurrentPage();
        //this.setPage();
    }

    onCloseLocationInfoPanel(event) {
        this.showLocationInfoPanel = event;
        this.editMode = false;
    }
    onSaveRegisterInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.showRegisterStateInfoPanel = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
    }

    onCloseRegisterInfoPanel(event) {
        this.showRegisterStateInfoPanel = event;
        this.editMode = false;
    }


    onSavePersonalInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.showPersonalInfoPanel = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.setCurrentPage();
        //this.setPage();
    }
    onPage(event) {
        this.wsPaginatorFirst = event.first;
        this.wsPaginatorRows = event.rows;
    }
    onSaveJobInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.setCurrentPage();
    }
    onSaveJobCategoryPanel(event) {
        try {
            let ws: WorkStation = event;
            let __workStations = [...this.workStations];
            let _index = this.findWorkStationIndex(ws);
            __workStations[_index] = ws;
            this.workStations = __workStations;
            this.cloneToSelectedWorkStation(ws);
            this.displayJobCategoryDialog = false;
            this.hmsgs = [];
            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
            //this.setCurrentPage();
            //this.setPage();
        }
        catch (e) {
            console.log(e);
        }
    }

    onDeleteJobCategoryPanel(event) {
        try {
            let ws: WorkStation = event;
            let __workStations = [...this.workStations];
            let _index = this.findWorkStationIndex(ws);
            __workStations[_index] = ws;
            this.workStations = __workStations;
            this.cloneToSelectedWorkStation(ws);
            //this.setCurrentPage();
            //this.setPage();
        }
        catch (e) {
            console.log(e);
        }
    }

    onCloseJobCategoryPanel(event) {
        this.displayJobCategoryDialog = false;
        this.newWorkerToJobsMap = false;
    }

    onCloseJobInfoPanel(event) {
        this.showJobInfoPanel = event;
        this.editMode = false;
    }
    onCloseContactInfoPanel(event) {
        this.showContactInfoPanel = event;
        this.editMode = false;
    }

    onSaveContactInfoPanel(event) {
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.showContactInfoPanel = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.setCurrentPage();
        //this.setPage();
    }
    onErrorContactInfoPanel(event) {
        this.hmsgs.push({ severity: 'error', summary: '', detail: event });
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
        let ws: WorkStation = event;
        let __workStations = [...this.workStations];
        let _index = this.findWorkStationIndex(ws);
        __workStations[_index] = ws;
        this.workStations = __workStations;
        this.selectedWorkStation.workStationPhones = [];
        ws.workStationPhones.forEach(element => {
            this.selectedWorkStation.workStationPhones.push(element);
        });
        this.displayPhoneDialog = false;
        this.editMode = false;
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        //this.setCurrentPage();
        //this.setPage();

    }

    onShowPhoneDialogToAdd(event) {
        try {
            let ws: WorkStation = event;
            this.workStationPhone = new WorkStationPhone();
            this.workStationPhone.phoneType.name = this.filterPhoneTypeList[0].label;
            this.workStationPhone.phoneType.id = this.filterPhoneTypeList[0].value;
            this.panelWorkStation = new WorkStation();
            this.panelWorkStation.id = ws.id;
            this.panelWorkStation.title = ws.title;
            this.panelWorkStation.workType = ws.workType;
            this.panelWorkStation.workStationPhones = [];
            this.displayPhoneDialog = true;
            this.newWorkStationPhone = true;
        }
        catch (e) {
            console.log(e);
        }
    }
    onShowPhoneDialogToEdit(event) {
        let ws: WorkStation = event;
        this.workStationPhone = this.CloneWorkStationPhone(ws.workStationPhones[0]);
        this.panelWorkStation = new WorkStation();
        this.panelWorkStation.id = ws.id;
        this.panelWorkStation.title = ws.title;
        this.panelWorkStation.workType = ws.workType;
        this.panelWorkStation.workStationPhones = [];
        this.displayPhoneDialog = true;
        this.newWorkStationPhone = false;

    }

    onShowWorkerToJobMapToEdit(event) {
        this.workerToJobMap = event;
        this.selectedJobCategory1 = this.workerToJobMap.jobCategory3.jobCategory2.jobCategory1;
        this.selectedJobCategory2 = this.workerToJobMap.jobCategory3.jobCategory2;
        this.selectedJobCategory3 = this.workerToJobMap.jobCategory3;
        this.selectedJobCategory1ID = this.workerToJobMap.jobCategory3.jobCategory2.jobCategory1.id;
        this.selectedJobCategory2ID = this.workerToJobMap.jobCategory3.jobCategory2.id;
        this.selectedJobCategory3ID = this.workerToJobMap.jobCategory3.id;
        this.initJobCategory2List();
        this.initJobCategory3List();
        this.newWorkerToJobsMap = false;
        this.displayJobCategoryDialog = true;
    }
    onShowWorkerToJobMapToAdd(event) {
        this.selectedWorkStation = event;
        this.selectedJobCategory1 = new JobCategory1();
        this.selectedJobCategory2 = new JobCategory2();
        this.selectedJobCategory3 = new JobCategory3();
        this.selectedJobCategory3ID = this.workerToJobMap.jobCategory3.id;
        this.selectedJobCategory2ID = this.workerToJobMap.jobCategory3.jobCategory2.id;
        this.selectedJobCategory1ID = this.workerToJobMap.jobCategory3.jobCategory2.jobCategory1.id;

        this.newWorkerToJobsMap = true;
        this.initJobCategory2List();
        this.initJobCategory3List();
        this.displayJobCategoryDialog = true;

    }

    CloneWorkStationPhone(wp: WorkStationPhone) {
        let workStationPhone = new WorkStationPhone();
        for (let prop in wp) {
            workStationPhone[prop] = wp[prop];
            workStationPhone.phoneType = new PhoneType();
            workStationPhone.phoneType.id = wp.phoneType.id;
            workStationPhone.phoneType.name = wp.phoneType.name;
        }
        return workStationPhone;
    }
    cloneWorker(worker: Worker): Worker {
        let out: Worker = new Worker();
        try {
            out.user.firstName = worker.user.firstName;
            out.user.lastName = worker.user.lastName;
            out.user.nationalCode = worker.user.nationalCode;
            out.user.sex = worker.user.sex;
            return out;
        }
        catch (e) {
            console.log(e);
            return out;
        }
    }

    showBizData(workStation: WorkStation) {
        this.savedWSPaginatorFirst = this.wsPaginatorFirst;
        this.wsSortField = this.dataTable.sortField;
        this.wsSortOrder = this.dataTable.sortOrder;
        this.selectedWorkStation = new WorkStation();
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            //this.loading = true;
            let __workStations = [...this.workStations];
            this.showBizInfoPanel = true;
            this.showBizInfoPanel_Loading = true;
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.showBizInfoPanel = true;
                    this.showBizInfoPanel_Loading = false;
                    this.selectedWorkStation = <WorkStation>response;
                    workStation = <WorkStation>response;
                    this.workStation = workStation;
                    let _index = this.findWorkStationIndex(workStation);
                    this.workerDataLoadedMap.set(this.selectedWorkStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                    //this.loading = false;
                    //this.setCurrentPage();
                }
                    , error => {
                        this.showBizInfoPanel = false;
                        this.showBizInfoPanel_Loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        //this.loading = false;
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showBizInfoPanel = true;
            this.showBizInfoPanel_Loading = false;
        }
        this.editMode = false;


    }
    showJobData(workStation) {
        this.savedWSPaginatorFirst = this.wsPaginatorFirst;
        this.wsSortField = this.dataTable.sortField;
        this.wsSortOrder = this.dataTable.sortOrder;
        this.workStation = workStation;

        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            //this.loading = true;
            let __workStations = [...this.workStations];
            this.showJobInfoPanel = true;

            this._dService.lookupById(workStation.id)
                .subscribe(response => {

                    this.selectedWorkStation = <WorkStation>response;
                    workStation = <WorkStation>response;
                    this.workStation = workStation;
                    let _index = this.findWorkStationIndex(workStation);
                    this.workerDataLoadedMap.set(this.selectedWorkStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                    this.showJobInfoPanel_Loading = false;
                }
                    , error => {
                        this.showWorkStationList = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.showJobInfoPanel_Loading = false;
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showJobInfoPanel = true;
            this.showJobInfoPanel_Loading = false;
        }
        this.editMode = false;


    }

    showContactData(workStation) {
        this.savedWSPaginatorFirst = this.wsPaginatorFirst;
        this.wsSortField = this.dataTable.sortField;
        this.wsSortOrder = this.dataTable.sortOrder;
        this.workStation = workStation;
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);

        if (needToLoaded) {
            //this.loading = true;
            let __workStations = [...this.workStations];
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.showContactInfoPanel = true;
                    this.selectedWorkStation = <WorkStation>response;
                    workStation = response;
                    this.workStation = workStation;
                    let _index = this.findWorkStationIndex(this.workStation);
                    this.workerDataLoadedMap.set(this.workStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                    //this.loading = false;
                    //this.setCurrentPage();
                }
                    , error => {
                        this.showWorkStationList = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        //this.loading = false;
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showContactInfoPanel = true;
        }
        this.editMode = false;

    }

    cloneToSelectedWorkStation(workStation) {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = workStation.id;
            this.selectedWorkStation.title = workStation.title;
            this.selectedWorkStation.code = workStation.code;
            this.selectedWorkStation.workType = workStation.workType;
            this.selectedWorkStation.name = workStation.name;
            this.selectedWorkStation.officeNationalCode = workStation.officeNationalCode;
            this.selectedWorkStation.officeRegisterDateS = workStation.officeRegisterDateS;
            this.selectedWorkStation.officeRegisterNumber = workStation.officeRegisterNumber;
            this.selectedWorkStation.storeLicenseDateS = workStation.storeLicenseDateS;
            this.selectedWorkStation.storeLicenseNumber = workStation.storeLicenseNumber;
            this.selectedWorkStation.info = workStation.info;
            this.selectedWorkStation.registerState = workStation.registerState;
            this.selectedWorkStation.regStateInfo = workStation.regStateInfo;

            this.selectedWorkStation.owner.firstName = workStation.owner.firstName;
            this.selectedWorkStation.owner.lastName = workStation.owner.lastName;
            this.selectedWorkStation.owner.nationalCode = workStation.owner.nationalCode;
            this.selectedWorkStation.ownerPosition = workStation.ownerPosition;
            if (workStation.workStationCatalogs != undefined)
                this.selectedWorkStation.workStationCatalogs = workStation.workStationCatalogs;
            else
                this.selectedWorkStation.workStationCatalogs = [];
            this.selectedWorkStation.workStationPhones = [];
            let iii = 0;
            if (workStation.workStationPhones != undefined) {

                workStation.workStationPhones.forEach(element => {
                    this.selectedWorkStation.workStationPhones[iii] = element;
                    iii++;
                });
            }

            this.selectedWorkStation.website = workStation.website;
            this.selectedWorkStation.email = workStation.email;
            this.selectedWorkStation.telegram = workStation.telegram;
            this.selectedWorkStation.instagram = workStation.instagram;

            this.selectedWorkStation.area = workStation.area;

            this.selectedWorkStation.address = workStation.address;
            this.selectedWorkStation.lat = workStation.lat;
            this.selectedWorkStation.longg = workStation.longg;
            this.selectedWorkStation.postalCode = workStation.postalCode;

            this.selectedWorkStation.workStationJobs = workStation.workStationJobs;
            this.selectedWorkStation.workStationDocuments = workStation.workStationDocuments;
        }
        catch (e) {
            console.log(e);
        }
    }

    closePersonalPanel() {
        this.showPersonalInfoPanel = false;

    }
    closeContactPanel() {
        this.showContactInfoPanel = false;
    }
    closeJobPanel() {
        this.showJobInfoPanel = false;
    }
    closeBizPanel() {
        this.showBizInfoPanel = false;
    }
    closeLocationPanel() {
        this.showLocationInfoPanel = false;
    }
    closeRegisterStatePanel() {
        this.showRegisterStateInfoPanel = false;
    }
    closeDocumentPanel() {
        this.showDocumentInfoPanel = false;
    }
    showAddWorkerPanel(workStation) {
        try {
            this.specifiedJobCategory1List = [];
            workStation.workStationJobs.forEach(element => {
                this.specifiedJobCategory1List.push({ label: element.jobCategory1.name, value: element.jobCategory1 });
            });
            this.displayAddWorkerDialog = true;
        }
        catch (e) {
            console.log(e);
        }
    }
    showChangeWsOwnerPanel(workStation) {
        try {
            this.selectedWs_UserList = [];
            this.selectedWSOwnerID = this.selectedWorkStation.owner.id;
            this._dService.userListById(workStation.id)
                .subscribe(response => {
                    this.selectedWs_UserList = <User[]>response;
                    this.displayChangleWorkstationOwner = true;
                }
                    , error => {
                        this.showPersonalInfoPanel = false;
                        let obj: User[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                    }
                );
        }
        catch (e) {
            console.log(e);
        }
    }
    onSubmiChangeWSOwnerForm() {
        try {
            let _workStations = [...this.workStations];
            let workStation: WorkStation = new WorkStation();
            workStation.id = this.selectedWorkStation.id;
            workStation.owner = new User()
            workStation.owner.id = this.selectedWSOwnerID;
            this.loading = true;
            this._dService.changeOwner(workStation)
                .subscribe(response => {
                    let ws = <WorkStation>response;
                    let _index = this.findWorkStationIndex(ws);
                    _workStations[_index] = ws;
                    this.workStations = _workStations;
                    this.displayChangleWorkstationOwner = false;
                    this.loading = false;

                }
                    , error => {
                        this.displayChangleWorkstationOwner = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    }
                );
        }
        catch (e) {
            console.log(e);
        }

    }
    showEditWorker(worker) {
        try {
            this.displayEditWorkerDialog = true;
            this.selectedWorker = worker;
            this.specifiedJobCategory1List = [];
            this.selectedWorkStation.workStationJobs.forEach(element => {
                this.specifiedJobCategory1List.push({ label: element.jobCategory1.name, value: element.jobCategory1 });
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    showPersonalPanelData(workStation) {
        try {
            this.savedWSPaginatorFirst = this.wsPaginatorFirst;
            this.wsSortOrder = this.dataTable.sortOrder;
            this.wsSortField = this.dataTable.sortField;
            this.selectedWorkStation = new WorkStation();
            let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
            if (needToLoaded) {
                this.showPersonalInfoPanel = true;
                this.showPersonalInfoPanel_Loading = true;
                let __workStations = [...this.workStations];
                this._dService.lookupById(workStation.id)
                    .subscribe(response => {
                        this.showPersonalInfoPanel = true;
                        this.showPersonalInfoPanel_Loading = false;
                        this.selectedWorkStation = <WorkStation>response;
                        workStation = <WorkStation>response;
                        this.workStation = workStation;
                        let _index = this.findWorkStationIndex(this.workStation);
                        this.workerDataLoadedMap.set(this.workStation.id, false);
                        __workStations[_index] = this.workStation;
                        this.workStations = __workStations;

                    }
                        , error => {
                            this.showPersonalInfoPanel = false;
                            this.showPersonalInfoPanel_Loading = false;
                            let obj: WorkStation = error.error;
                            let err: BackendMessage = obj.error;
                            this.parseError(error.status, err);
                        }
                    );
            }
            else {
                let _index = this.findWorkStationIndex(workStation);
                workStation = this.workStations[_index];
                this.cloneToSelectedWorkStation(workStation);
                this.showPersonalInfoPanel = true;
                this.showPersonalInfoPanel_Loading = false;
            }
            this.editMode = false;
        }
        catch (e) {
            console.log(e);
        }


    }
    showLocationData(workStation: WorkStation) {
        this.savedWSPaginatorFirst = this.wsPaginatorFirst;
        this.wsSortOrder = this.dataTable.sortOrder;
        this.wsSortField = this.dataTable.sortField;
        this.workStation = workStation;
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            this.showLocationInfoPanel = true;
            this.showLocationInfoPanel_Loading = true;
            let __workStations = [...this.workStations];
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.showLocationInfoPanel = true;
                    this.showLocationInfoPanel_Loading = false;
                    this.selectedWorkStation = <WorkStation>response;
                    workStation = <WorkStation>response;
                    this.workStation = workStation;
                    let _index = this.findWorkStationIndex(this.workStation);
                    this.workerDataLoadedMap.set(this.workStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                    this.selectedProvinceID = workStation.area.region.city.township.province.id;
                    this.selectedTownshipID = workStation.area.region.city.township.id;
                    this.selectedCityID = workStation.area.region.city.id;
                    if (workStation.area != null)
                        this.selectedRegionID = workStation.area.region.id;
                    this.initTownshipList();
                    this.initCityList();
                    this.initRegionList();
                    this.loadAreaList();
                    // this.setCurrentPage();
                }
                    , error => {
                        this.showWorkStationList = false;
                        this.showLocationInfoPanel_Loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showLocationInfoPanel = true;
            this.showLocationInfoPanel_Loading = false;

        }
        this.editMode = false;
    }
    showDocumentDialog(workStation: WorkStation) {
        this.workStation = workStation;
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            this.showDocumentInfoPanel = true;
            this.showDocumentInfoPanel_Loading = true;
            let __workStations = [...this.workStations];
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.showDocumentInfoPanel = true;
                    this.showDocumentInfoPanel_Loading = false;
                    this.selectedWorkStation = <WorkStation>response;
                    workStation = <WorkStation>response;
                    this.workStation = workStation;
                    console.log(this.workStation);
                    let _index = this.findWorkStationIndex(this.workStation);
                    this.workerDataLoadedMap.set(this.workStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                }
                    , error => {
                        this.showWorkStationList = false;
                        this.showDocumentInfoPanel_Loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        //this.loading = false;
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showDocumentInfoPanel = true;
            this.showDocumentInfoPanel_Loading = false;

        }
        this.editMode = false;
    }
    showRegisterStateData(workStation: WorkStation) {
        this.workStation = workStation;
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            this.showRegisterStateInfoPanel = true;
            this.showRegisterStateInfoPanel_Loading = true;
            let __workStations = [...this.workStations];
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.showRegisterStateInfoPanel = true;
                    this.showRegisterStateInfoPanel_Loading = false;
                    this.selectedWorkStation = <WorkStation>response;
                    workStation = <WorkStation>response;
                    this.workStation = workStation;
                    let _index = this.findWorkStationIndex(this.workStation);
                    this.workerDataLoadedMap.set(this.workStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                }
                    , error => {
                        this.showWorkStationList = false;
                        this.showRegisterStateInfoPanel_Loading = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                    }
                );
        }
        else {
            this.cloneToSelectedWorkStation(workStation);
            this.showRegisterStateInfoPanel = true;
            this.showRegisterStateInfoPanel_Loading = false;


        }
        this.editMode = false;
    }
    showJobCategoryDialogToAdd() {
        this.newWorkerToJobsMap = true;
        this.workerToJobMap = new WorkerToJobsMap();
        this.displayJobCategoryDialog = true;
        this.panelWorkStation = new WorkStation();
        this.panelWorkStation.id = this.selectedWorkStation.id;
        this.panelWorkStation.title = this.selectedWorkStation.title;
        this.panelWorkStation.workType = this.selectedWorkStation.workType;

        this.selectedJobCategory2ID = 0;
        this.selectedJobCategory3ID = 0;

        this.initJobCategory2List();
        this.initJobCategory3List();


    }
    showWorkStationInfo(workStation: WorkStation) {

        this.savedWSPaginatorFirst = this.wsPaginatorFirst;
        this.wsSortOrder = this.dataTable.sortOrder;
        this.wsSortField = this.dataTable.sortField;
        this.workStation = workStation;
        let needToLoaded = this.workerDataLoadedMap.get(workStation.id);
        if (needToLoaded) {
            this.showWorkStationList = true;
            this.displayWorkStationDetailDialog_Loading = true;
            let __workStations = [...this.workStations];
            this._dService.lookupById(workStation.id)
                .subscribe(response => {
                    this.workStation = <WorkStation>response;
                    this.showWorkStationInfoAction(this.workStation);
                    let _index = this.findWorkStationIndex(this.workStation);
                    this.workerDataLoadedMap.set(this.workStation.id, false);
                    __workStations[_index] = this.workStation;
                    this.workStations = __workStations;
                    this.displayWorkStationDetailDialog_Loading = false;
                }
                    , error => {
                        this.showWorkStationList = false;
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.displayWorkStationDetailDialog_Loading = false;
                    }
                );
        }
        else {
            this.displayWorkStationDetailDialog_Loading = false;
            this.showWorkStationInfoAction(workStation);
        }


    }
    showWorkStationInfoAction(workStation: WorkStation) {
        this.showWorkStationList = true;
        this.displayWorkStationDetailDialog = true;
    }
    delete(workStation: WorkStation) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                //this.loading = true;
                this._dService.deleteWorkStation(workStation)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkStationIndex(workStation);
                        this.workStations = this.workStations.filter((val, i) => i != index);
                        this.displayDialog = false;
                        this.displayWorkStationDetailDialog = false;
                        this.displayMgmPanel = true;
                    },
                        error => {
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }
    deleteWorker(worker: Worker) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                // this.loading = true;                
                this._workerService.deleteWorker(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let index = this.findWorkerIndex(worker);
                        this.selectedWorkStation.workers = this.selectedWorkStation.workers.filter((val, i) => i != index);
                    },
                        error => {
                            this.loading = false;
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }
    public findWorkStationIndex(ws: WorkStation) {
        for (let i = 0; i < this.workStations.length; i++) {
            let element: WorkStation = this.workStations[i];
            if (element.id == ws.id)
                return i;
        }
    }
    public findWorkerIndex(wr: Worker) {
        for (let i = 0; i < this.selectedWorkStation.workers.length; i++) {
            let element: Worker = this.selectedWorkStation.workers[i];
            if (element.id == wr.id)
                return i;
        }
    }

    CloneWorkerToJobMap(wp: WorkerToJobsMap) {
        let workerToJobMap = new WorkerToJobsMap();
        workerToJobMap.id = wp.id;
        workerToJobMap.jobCategory3 = new JobCategory3();
        workerToJobMap.jobCategory3.id = wp.jobCategory3.id;
        workerToJobMap.jobCategory3.name = wp.jobCategory3.name;
        this.selectedJobCategory3 = wp.jobCategory3;
        this.selectedJobCategory3ID = wp.jobCategory3.id;
        return workerToJobMap;
    }

    showPhoneDialogToAdd() {
        this.workStationPhone = new WorkStationPhone();
        this.workStationPhone.phoneType.name = this.filterPhoneTypeList[0].label;
        this.workStationPhone.phoneType.id = this.filterPhoneTypeList[0].value;
        this.panelWorkStation = new WorkStation();
        this.panelWorkStation.id = this.selectedWorkStation.id;
        this.panelWorkStation.title = this.selectedWorkStation.title;
        this.panelWorkStation.workType = this.selectedWorkStation.workType;
        this.panelWorkStation.workStationPhones = [];
        this.displayPhoneDialog = true;
    }
    onShowImage(event) {
        this.displayCatalogImageDialog = true;
        this.selectedImageCatalog = new Object();
        this.selectedImageCatalog.source = event;

    }
    selectCatalogImage(catalogImage: any) {
        this.selectedImageCatalog = catalogImage;
        this.displayCatalogImageDialog = true;
    }
    deleteCatalogImage(catalogImage: any) {
        let __workStations = [...this.workStations];

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._dService.deleteCatalog(this.selectedWorkStation)
                    .subscribe(response => {
                        let index = this.findWorkStationIndex(this.selectedWorkStation);
                        __workStations[index] = <WorkStation>response;
                        this.workStations = __workStations;
                        this.showBizInfoPanel = false;
                        this.hmsgs = [];
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
                    },
                        error => {
                            this.showBizInfoPanel = false;
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
            }
        });
    }
    doShowWorkStationStat() {
        this.displayMgmPanel = false;
        this.displayDialog = false;
        this.showOnMapFlag = false;

        this.clearFilter();

    }
    onRtvWorkStationList(response: any) {
        let __workStations = [];
        this.workStations = [];
        let workstations = response;
        this.wsMarkerList = [];
        workstations.forEach(element => {
            let wsMarker: marker = {
                lat: element.lat,
                lng: element.longg,
                label: element.title,
                draggable: false
            }
            this.wsMarkerList.push(wsMarker);
            element.registerTime = new Date(element.registerTime);
            __workStations.push(element);
            this.workerDataLoadedMap.set(element.id, true);
        });
        this.workStations = __workStations;
    }
    doShowOnMap() {
        if (this.workStations.length == 0)
            this.justRefreshWorkStationList();
        this.showOnMapFlag = true;
        this.displayDialog = false;
        this.displayWorkStationDetailDialog = false;
        this.displayMgmPanel = false;
    }

    markerDragEnd(m: marker, $event: MouseEvent) {
        console.log('dragEnd', m, $event);
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


}
interface marker {
    lat;
    lng;
    label?: string;
    draggable;
}

