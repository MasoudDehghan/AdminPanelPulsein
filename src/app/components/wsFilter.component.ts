import { BasicData } from './../entities/basicData.class';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { SelectItem } from 'primeng/primeng';
import { environment } from '../../environments/environment';
import { Area } from '../entities/area.class';
import { City } from '../entities/city.class';
import { GrowlMessage } from '../entities/growlMessage.class';
import { JobCategory1 } from '../entities/JobCategory1.class';
import { BackendMessage } from '../entities/Msg.class';
import { Region } from '../entities/region.class';
import { TownShip } from '../entities/township.class';
import { User } from '../entities/user.class';
import { WorkerStationCatalog } from '../entities/workerStationCatalog.class';
import { WorkStation } from '../entities/workStation.class';
import { WorkStationSearch } from '../entities/WorkStationSearch.class';
import { WorkType } from '../entities/WorkType.class';
import { WorkStationSearchResult } from '../entities/wsSearchResult.class';
import { WorkTypeEnum } from '../enums/workType.enum';
import { GeoService } from '../services/geo.service';
import { SharedValues } from '../services/shared-values.service';
import { WorkerStationMgmService } from '../services/workerStationMgm.service';
import * as glob from '../shared/global';
import { HandleErrorMsg } from '../shared/handleError.class';


@Component({
    moduleId: module.id,
    selector: 'wsFilterComponent',
    templateUrl: './wsFilter.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService,GeoService]
})

export class WorkStationFilter implements OnInit {
    filterForm: FormGroup;
    selectedWorkStation: WorkStation = new WorkStation();
    selectedFilter: WorkStationSearch = new WorkStationSearch();
    @Input() jobCategory1Map: Map<number, JobCategory1> = new Map<number, JobCategory1>();    
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSearch = new EventEmitter<WorkStationSearchResult>();
    jobDataLabel = glob.jobDataLabel;
    showStorePanel = false;
    showCompanyPanel = false;
    workStation: WorkStation = new WorkStation();
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;
    selectedWorkStationCatalogImgs: any[];
    WorkerStationCatalogList: WorkerStationCatalog[] = [];
    uploadedFiles: any[] = [];
    baseImagePath = environment.fileServerUrl;


    selectedProvinceID: number = 0;
    selectedTownshipID: number = 0;
    selectedTownshipName: string = "";

    selectedCityID: number = 0;

    selectedRegionID: number = 0;

    selectedAreaID: number = 0;
    latitude: number;
    longitude: number;
    zoom: number;
    areaName: string;
    msgs: GrowlMessage[] = [];

    townshipList: SelectItem[] = [];
    cityList: SelectItem[] = [];
    regionList: SelectItem[] = [];
    areaList: SelectItem[] = [];
    @Input() selectedCode: string = null;
    @Input() selectedJobCategory1: JobCategory1 = null;
    @Input() selectedWorkStationTitle: string = "";
    @Input() selectedWorkType: WorkType = new WorkType();
    @Input() selectedWorkStationWorkerTelNumber: string = "";
    @Input() selectedOfficeRegisterNumber: string = "";
    @Input() selectedOfficeNationalCode: string = "";
    @Input() selectedStoreLicenseNumber: string = "";

    @Input() selectedCity: City = new City();
    @Input() selectedRegion: Region = new Region();
    @Input() selectedArea: Area = new Area();
    @Input() selectedWorkStationRegisteredBy: User = null;
    @Input() selectedWorkStationVerifiedBy: User = null;
    @Input() selectedVerfied: number = undefined;

    basicData: BasicData;

    constructor(private _router: Router, private _fb: FormBuilder,
        private _dService: WorkerStationMgmService,
        private _geoService: GeoService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {
        this.filterForm = this._fb.group({
            title: [''],
            code: [''],
            workStationType: [''],
            jobCategory1FormCntrl: [''],
            keywordFormCntrl: [''],
            phoneNumber: [''],
            location: new FormGroup({
                province: new FormControl(''),
                township: new FormControl(''),
                city: new FormControl(''),
                region: new FormControl(['']),
                area: new FormControl([''])
            }),

            officeNationalCode: [''],
            officeRegisterCode: [''],
            storeLicenseNumber: [''],
            registerById: [''],
            verifyById: [''],
            verified: ['']
        });

        this.errorCntrler = new HandleErrorMsg(this._router);
        this.basicData = JSON.parse(localStorage.getItem('basicData'));
        this.initTownshipList();
        this.initCityList();
        this.initRegionList();
        this.initAreaList();
        this.selectedFilter = new WorkStationSearch();
        if (this.selectedRegion != null)
            this.selectedRegionID = this.selectedRegion.id;

    }
    onSubmitFilterform() {
        try {

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
            if (this.selectedWorkStationTitle !=null){
                if (this.selectedWorkStationTitle != "") {
                    this.selectedFilter.title = this.selectedWorkStationTitle;
                    this.selectedFilter.f_title = true;
                }
             }
            if (this.selectedWorkType != null) {
                if (this.selectedWorkType.id != 0) {
                    this.selectedFilter.workTypeId = this.selectedWorkType.id;
                    this.selectedFilter.f_workTypeId = true;
                }
                if (this.selectedWorkType.id == WorkTypeEnum.company) {
                    if (this.selectedOfficeNationalCode != "") {
                        this.selectedFilter.officeNationalCode = this.selectedOfficeNationalCode;
                        this.selectedFilter.f_officeNationalCode = true;
                    }
                    if (this.selectedOfficeRegisterNumber != "") {
                        this.selectedFilter.officeRegisterNumber = this.selectedOfficeRegisterNumber;
                        this.selectedFilter.f_officeRegisterNumber = true;
                    }
                }
                if (this.selectedWorkType.id == WorkTypeEnum.store) {
                    if (this.selectedStoreLicenseNumber != "") {
                        this.selectedFilter.storeLicenseNumber = this.selectedStoreLicenseNumber;
                        this.selectedFilter.f_storeLicenseNumber = true;
                    }
                }
            }
            if (this.selectedWorkStationWorkerTelNumber != "") {
                this.selectedFilter.phoneNumber = this.selectedWorkStationWorkerTelNumber;
                this.selectedFilter.f_phoneNumber = true;
            }
            if (this.selectedCityID != 0) {
                this.selectedFilter.cityId = this.selectedCityID;
                this.selectedFilter.f_cityId = true;
            }
            if (this.selectedRegionID != 0) {
                this.selectedFilter.regionId = this.selectedRegionID;
                this.selectedFilter.f_regionId = true;
            }
            if (this.selectedAreaID != 0) {
                this.selectedFilter.areaId = this.selectedAreaID;
                this.selectedFilter.f_areaId = true;
            }

            if (this.selectedWorkStationRegisteredBy != null) {
                if (this.selectedWorkStationRegisteredBy.id != 0) {
                    this.selectedFilter.registerById = this.selectedWorkStationRegisteredBy.id;
                    this.selectedFilter.f_registerById = true;
                }
            }
            if (this.selectedWorkStationVerifiedBy != null) {
                if (this.selectedWorkStationVerifiedBy.id != 0) {
                    this.selectedFilter.verifyById = this.selectedWorkStationVerifiedBy.id;
                    this.selectedFilter.f_verifyById = true;
                }
            }
            if (this.selectedVerfied != undefined) {
                if (this.selectedVerfied == 0) {
                    this.selectedFilter.verified = 2;
                    this.selectedFilter.f_verified = true;
                }
                if (this.selectedVerfied == 1) {
                    this.selectedFilter.verified = 1;
                    this.selectedFilter.f_verified = true;
                }
            }
            this.loading = true;

            this._dService.search(this.selectedFilter).subscribe(response => {
                let out: WorkStationSearchResult = new WorkStationSearchResult();
                out.workstations = [];
                let workstations = <WorkStation[]>response;
                workstations.forEach(element => {
                    element.registerTime = new Date(element.registerTimeS);
                    out.workstations.push(element);
                });
                out.workStationSearch = this.selectedFilter;
                out.selectedCode = this.selectedCode;
                out.selectedJobCategory1 = this.selectedJobCategory1;

                out.selectedWorkStationTitle = this.selectedWorkStationTitle;
                out.selectedWorkType = this.selectedWorkType;
                out.selectedWorkStationWorkerTelNumber = this.selectedWorkStationWorkerTelNumber;
                out.selectedOfficeRegisterNumber = this.selectedOfficeRegisterNumber;
                out.selectedOfficeNationalCode = this.selectedOfficeNationalCode;
                out.selectedStoreLicenseNumber = this.selectedStoreLicenseNumber;
                out.selectedCity = this.selectedCity;
                out.selectedRegion = this.selectedRegion;
                out.selectedArea = this.selectedArea;
                out.selectedWorkStationRegisteredBy = this.selectedWorkStationRegisteredBy;
                out.selectedWorkStationVerifiedBy = this.selectedWorkStationVerifiedBy;
                out.selectedVerfied = this.selectedVerfied;
                this.onSearch.emit(out);
                this.loading = false;
            }, error => {
                let obj: WorkStation[] = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
                this.loading = false;
            });

        }
        catch (e) {
            console.log(e);
        }
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
        if (this.selectedCity.centerLat != 0 && this.selectedCity.centerLong != 0) {
            this.latitude = this.selectedCity.centerLat;
            this.longitude = this.selectedCity.centerLong;
        }
        this.initRegionList();
        this.initAreaList();
    }
    onRegionChange(event: any) {
        this.selectedRegionID = event.value;
        this.initAreaList();
    }
    onAreaChange(event: any) {
        if (this.selectedArea != null) {
            this.selectedAreaID = this.selectedArea.id;
            this.areaName = this.selectedArea.name;
            this.latitude = this.selectedArea.centerLat;
            this.longitude = this.selectedArea.centerLong;
        }
    }
    onJobCategory1Change(event: any) {
        this.selectedJobCategory1 = event.value;
    }
    onWorkTypeChange(event: any) {

        if (event.value.id == WorkTypeEnum.real) {
            this.showStorePanel = false;
            this.showCompanyPanel = false;

        }
        else if (event.value.id == WorkTypeEnum.company) {
            this.showStorePanel = false;
            this.showCompanyPanel = true;

        }
        else if (event.value.id == WorkTypeEnum.store) {
            this.showStorePanel = true;
            this.showCompanyPanel = false;

        }


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
        this.regionList.push({ label: this.shared.allRegionLabel, value: 0 });
        if (this.selectedCityID != 0) {
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