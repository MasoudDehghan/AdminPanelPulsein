import { chooseTownshipMsg, chooseRegionLabel } from './../shared/global';
import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'

import * as glob from '../shared/global';
import { WorkStation } from '../entities/workStation.class'
import { TownShip } from '../entities/township.class'
import { City } from '../entities/city.class'
import { Region } from '../entities/region.class'
import { Area } from '../entities/area.class'
import { WorkerStationMgmService } from '../services/workerStationMgm.service'
import { HandleErrorMsg } from '../shared/handleError.class'
import { BackendMessage } from '../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { GeoService } from '../services/geo.service'
import { GrowlMessage } from '../entities/growlMessage.class'
import { Constant } from '../shared/constants.class';

@Component({
    moduleId: module.id,
    selector: 'wsLocationInfoComponent',
    templateUrl: './wsLocationInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers: [GeoService, WorkerStationMgmService]
})

export class WorkStationLocationInfoEdit implements OnInit {
    locationEditForm: FormGroup;
    @Input() inputWorkStation: WorkStation;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Input() provinceList: SelectItem[] = [];
    townshipList: SelectItem[] = [];
    cityList: SelectItem[] = [];
    regionList: SelectItem[] = [];
    areaList: SelectItem[] = [];
    @Input() loading = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    workStation: WorkStation = new WorkStation();
    errorCntrler: HandleErrorMsg;
    selectedProvinceID: number = 0;
    selectedProvinceName: string;
    selectedTownshipID: number = 0;
    selectedTownshipName: string = "";
    selectedCity: City = new City();
    selectedCityID: number = 0;
    selectedRegion: Region = new Region();
    selectedRegionID: number = 0;
    selectedArea: Area = new Area();
    selectedAreaID: number = 0;
    latitude: number;
    longitude: number;
    zoom: number = 14;
    areaName: string;
    displayMap: boolean = false;
    saveLabel = glob.saveLabelFa;
    closeLabel = glob.closeLabel;
    successFullChangeMsg = glob.successFullChangeMsg;
    workStationLabelFa = glob.workStationLabelFa;
    workTypeLabelFa = glob.workTypeLabelFa;
    provinceLabel = glob.provinceLabel;
    townshipLabel = glob.townshipLabel;
    changeLabel = glob.changeLabel;
    detailLabel = glob.detailLabel;
    cityLabel = glob.cityLabel;
    regionLabel = glob.regionLabel;
    areaLabel = glob.areaLabel;
    addressLabel = glob.addressLabel;
    addLabel = glob.addLabel;
    postalCodeLabel = glob.postalCodeLabel;
    chooseRegionLabel = glob.chooseRegionLabel;
    chooseAreaMsg = glob.chooseAreaMsg;
    showLocationOnMap = glob.showLocationOnMap;
    msgs: GrowlMessage[] = [];
    constructor(private _router: Router, private _fb: FormBuilder, private cdRef: ChangeDetectorRef,
        private _dService: WorkerStationMgmService, private _geoService: GeoService
    ) {

    }
    ngOnInit() {
        this.locationEditForm = this._fb.group({
            gmapSearchControl: [''],
            location: new FormGroup({
                province: new FormControl([this.selectedProvinceID]),
                township: new FormControl([this.selectedTownshipID]),
                city: new FormControl(['']),
                region: new FormControl([this.selectedRegionID]),
                area: new FormControl(['']),
                address: new FormControl({ value: this.selectedWorkStation.address, disabled: false }),
                postalCode: new FormControl({ value: this.selectedWorkStation.postalCode, disabled: false })
            })
        });
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.townshipList = [];
        this.townshipList.push({ label: glob.chooseTownshipMsg, value: 0 });
        this.cityList = [];
        this.cityList.push({ label: glob.chooseCityMsg, value: null });
        this.regionList = [];
        this.regionList.push({ label: glob.chooseRegionLabel, value: 0 });
        this.areaList = [];
        this.areaList.push({ label: glob.chooseAreaMsg, value: 0 });
    }
    ngOnChanges() {
        this.showLocationDataAction();
    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();
    }
    showMap() {
        this.displayMap = !this.displayMap;
        this.initEditBoxMap();
    }
    onProvinceChange(event: any) {
        this.selectedProvinceID = event.value;
        this.selectedProvinceID = event.value;
        this.selectedTownshipID = 0;
        this.selectedCity = null;
        this.selectedCityID = 0;
        this.selectedRegion = null;
        this.selectedRegionID = 0;
        this.selectedArea = null;
        this.selectedAreaID = 0;
        this.townshipList = [];
        this.cityList = [];
        this.regionList = [];
        this.areaList = [];
        this._geoService.geTownshipList(this.selectedProvinceID)
            .subscribe(response => {
                let list: TownShip[] = <TownShip[]>response;
                list.forEach(element => {
                    this.townshipList.push({ label: element.name, value: element.id });
                });
                this.selectedTownshipID = this.townshipList[0].value;
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
                        if (this.selectedCityID == 0) {
                            this.selectedCity = this.cityList[0].value;
                            this.selectedCityID = this.selectedCity.id;
                        }
                        this.regionList = [];
                        this.regionList.push({ label: this.chooseRegionLabel, value: 0 });

                        this._geoService.geRegionList(this.selectedCityID)
                            .subscribe(response => {
                                let list: Region[] = <Region[]>response;
                                list.forEach(element => {
                                    this.regionList.push({ label: element.name, value: element.id });
                                });
                                this.selectedRegion = this.regionList[0].value;
                                this.selectedRegionID = this.selectedRegion.id;
                                this.initAreaList();

                            }
                                , error => {
                                    let obj: Region[] = error.error;
                                    let err: BackendMessage = obj[0].error;
                                    this.parseError(error.status, err);
                                }
                            );

                    }
                        , error => {
                            let obj: City[] = error.error;
                            let err: BackendMessage = obj[0].error;
                            this.parseError(error.status, err);
                        }
                    );

            }
                , error => {
                    let obj: TownShip[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }

    onTownshipChange(event: any) {
        this.selectedTownshipID = event.value;
        this.initCityList();
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

    initGeoData() {
        this.townshipList = [];

        this._geoService.geTownshipList(this.selectedProvinceID)
            .subscribe(response => {
                let list: TownShip[] = <TownShip[]>response;
                list.forEach(element => {
                    this.townshipList.push({ label: element.name, value: element.id });
                });
                if (this.selectedWorkStation.area) {
                    this.selectedTownshipID = this.selectedWorkStation.area.region.city.township.id;
                    this.selectedTownshipName = this.selectedWorkStation.area.region.city.township.name;
                    this.locationEditForm.get('location.township').setValue(this.selectedTownshipID);
                }
                this.cityList = [];
                this.selectedCity = null;
                this.selectedCityID = 0;
                this.cityList.push({ label: glob.chooseCityMsg, value: null });
                if (this.selectedTownshipID != 0) {
                    this._geoService.geCityList(this.selectedTownshipID)
                        .subscribe(response => {
                            let list: City[] = <City[]>response;
                            list.forEach(element => {
                                this.cityList.push({ label: element.name, value: element });
                            });
                            if (this.selectedWorkStation.area) {
                                this.selectedCity = this.selectedWorkStation.area.region.city;
                                this.selectedCityID = this.selectedWorkStation.area.region.city.id;
                                this.selectedCity.centerLat = this.selectedWorkStation.area.region.city.centerLat;
                                this.selectedCity.centerLong = this.selectedWorkStation.area.region.city.centerLong;
                                this.locationEditForm.get('location.city').setValue(this.selectedCity);
                            }
                            this.regionList = [];
                            this.regionList.push({ label: this.chooseRegionLabel, value: 0 });
                            if (this.selectedCityID != 0) {
                                this._geoService.geRegionList(this.selectedCityID)
                                    .subscribe(response => {
                                        let list: Region[] = <Region[]>response;
                                        list.forEach(element => {
                                            this.regionList.push({ label: element.name, value: element.id });
                                        });
                                        if (this.selectedWorkStation.area) {
                                            this.selectedRegion = this.selectedWorkStation.area.region;
                                            this.selectedRegionID = this.selectedWorkStation.area.region.id;
                                            this.locationEditForm.get('location.region').setValue(this.selectedRegionID);
                                        }
                                        this.loadAreaList();
                                    }
                                        , error => {
                                            let obj: Region[] = error.error;
                                            let err: BackendMessage = obj[0].error;
                                            this.parseError(error.status, err);
                                        }
                                    );
                            }

                        }
                            , error => {
                                let obj: City[] = error.error;
                                let err: BackendMessage = obj[0].error;
                                this.parseError(error.status, err);
                            }
                        );
                }
            }
                , error => {
                    let obj: TownShip[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }
    initTownshipList() {
        this.townshipList = [];

        this._geoService.geTownshipList(this.selectedProvinceID)
            .subscribe(response => {
                let list: TownShip[] = <TownShip[]>response;
                list.forEach(element => {
                    this.townshipList.push({ label: element.name, value: element.id });
                });
                if (this.selectedWorkStation.area) {
                    this.selectedTownshipID = this.selectedWorkStation.area.region.city.township.id;
                    this.selectedTownshipName = this.selectedWorkStation.area.region.city.township.name;
                    this.locationEditForm.get('location.township').setValue(this.selectedTownshipID);
                }
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
        this.selectedCity = null;
        this.selectedCityID = 0;
        this.cityList.push({ label: glob.chooseCityMsg, value: null });
        if (this.selectedTownshipID != 0) {
            this._geoService.geCityList(this.selectedTownshipID)
                .subscribe(response => {
                    let list: City[] = <City[]>response;
                    list.forEach(element => {
                        this.cityList.push({ label: element.name, value: element });
                    });
                    if (this.selectedWorkStation.area) {
                        this.selectedCity = this.selectedWorkStation.area.region.city;
                        this.selectedCityID = this.selectedWorkStation.area.region.city.id;
                        this.selectedCity.centerLat = this.selectedWorkStation.area.region.city.centerLat;
                        this.selectedCity.centerLong = this.selectedWorkStation.area.region.city.centerLong;
                        this.locationEditForm.get('location.city').setValue(this.selectedCity);
                    }
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
        this.regionList.push({ label: this.chooseRegionLabel, value: 0 });
        if (this.selectedCityID != 0) {
            this._geoService.geRegionList(this.selectedCityID)
                .subscribe(response => {
                    let list: Region[] = <Region[]>response;
                    list.forEach(element => {
                        this.regionList.push({ label: element.name, value: element.id });
                    });
                    if (this.selectedWorkStation.area) {
                        this.selectedRegion = this.selectedWorkStation.area.region;
                        this.selectedRegionID = this.selectedWorkStation.area.region.id;
                        this.locationEditForm.get('location.region').setValue(this.selectedRegionID);
                    }
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
        try {
            this.areaList = [];
            this.areaList.push({ label: glob.chooseAreaMsg, value: null });
            if (this.selectedCityID == undefined || this.selectedRegionID == undefined)
                return;
            if (this.selectedCityID !== 0 && this.selectedRegionID == 0) {
                this._geoService.geAreaListByCityID(this.selectedCityID)
                    .subscribe(response => {
                        let list: Area[] = <Area[]>response;
                        list.forEach(element => {
                            this.areaList.push({ label: element.region.name + " - " + element.name, value: element });
                        });
                        if (this.selectedWorkStation.area) {
                            this.selectedArea = this.selectedWorkStation.area;
                            this.selectedAreaID = this.selectedWorkStation.area.id;
                            this.selectedArea = this.selectedWorkStation.area;
                            this.locationEditForm.get('location.area').setValue(this.selectedArea);
                        }
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
                        if (this.selectedWorkStation.area) {
                            this.selectedArea = this.selectedWorkStation.area;
                            this.selectedAreaID = this.selectedWorkStation.area.id;
                            this.selectedArea = this.selectedWorkStation.area;
                            this.locationEditForm.get('location.area').setValue(this.selectedArea);
                        }
                    }
                        , error => {
                            let obj: Area[] = error.error;
                            let err: BackendMessage = obj[0].error;
                            this.parseError(error.status, err);
                        }
                    );
            }
            else if (this.selectedRegionID == 0) {
                this.areaList.push({ label: this.chooseAreaMsg, value: 0 });
            }
        }
        catch (e) {
            console.log(e);
        }
    }
    markerDragEnd(event: any) {
        this.latitude = event.coords.lat;
        this.longitude = event.coords.lng;
    }
    showLocationDataAction() {
        try {
            this.displayMap = false;
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.title = this.inputWorkStation.title;
            this.selectedWorkStation.workType = this.inputWorkStation.workType;
            this.selectedWorkStation.name = this.inputWorkStation.name;
            this.selectedWorkStation.area = this.inputWorkStation.area;
            this.selectedWorkStation.address = this.inputWorkStation.address;
            this.selectedWorkStation.lat = this.inputWorkStation.lat;
            this.selectedWorkStation.longg = this.inputWorkStation.longg;
            this.selectedWorkStation.postalCode = this.inputWorkStation.postalCode;

            if (this.selectedWorkStation.area != null) {
                this.selectedAreaID = this.selectedWorkStation.area.id;
                this.selectedArea = this.selectedWorkStation.area;
                this.selectedRegion = this.selectedWorkStation.area.region;
                this.selectedRegionID = this.selectedWorkStation.area.region.id;
                this.selectedProvinceID = this.selectedWorkStation.area.region.city.township.province.id;
                this.selectedProvinceName = this.selectedWorkStation.area.region.city.township.province.name;
                this.selectedTownshipID = this.selectedWorkStation.area.region.city.township.id;
                this.selectedTownshipName = this.selectedWorkStation.area.region.city.township.name;
                this.selectedCityID = this.selectedWorkStation.area.region.city.id;
                this.initGeoData();

            }
            else
                this.selectedArea = new Area();
            this.latitude = this.selectedWorkStation.lat;
            this.longitude = this.selectedWorkStation.longg;

        }
        catch (e) {
            console.log(e);
        }
    }
    initEditBoxMap() {
        this.zoom = 14;
        if (this.latitude != undefined && this.longitude != undefined &&
            this.latitude != 0 && this.longitude != 0) {
            this.latitude = this.selectedWorkStation.lat;
            this.longitude = this.selectedWorkStation.longg;
            this.cdRef.detectChanges();
        }
    }
    onSubmitLocationform() {
        if (this.editMode) {
            this.selectedWorkStation.area = this.selectedArea;
            this.selectedWorkStation.lat = this.latitude;
            this.selectedWorkStation.longg = this.longitude;
            this.loading = true;
            this._dService.editGeo(this.selectedWorkStation)
                .subscribe(response => {
                    this.loading = false;
                    this.onSave.emit(<WorkStation>response);
                },
                    error => {
                        let obj: WorkStation = error.error;
                        let err: BackendMessage = obj.error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
        }
        else
            this.onClose.emit(false);
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