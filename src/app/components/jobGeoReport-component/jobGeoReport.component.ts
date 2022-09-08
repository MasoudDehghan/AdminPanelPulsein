import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { TreeNode } from 'primeng/api';
import { SelectItem, Tree } from 'primeng/primeng';
import { Area } from '../../entities/area.class';
import { AreaView } from '../../entities/areaView.class';
import { City } from '../../entities/city.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { JobCategory2 } from '../../entities/JobCategory2.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { BackendMessage } from '../../entities/Msg.class';
import { Province } from '../../entities/province.class';
import { Region } from '../../entities/region.class';
import { TownShip } from '../../entities/township.class';
import { WorkStation } from '../../entities/workStation.class';
import { WorkStationSearch } from '../../entities/WorkStationSearch.class';
import { GeoService } from '../../services/geo.service';
import { JobCateogryService } from '../../services/jobCategory.service';
import { JobGeoReportService } from '../../services/jobGeo.service';
import { SharedValues } from '../../services/shared-values.service';
import { StatisticsService } from '../../services/statistics.service';
import { WorkerStationMgmService } from '../../services/workerStationMgm.service';
import { Constant } from '../../shared/constants.class';
import { HandleErrorMsg } from '../../shared/handleError.class';

@Component({
    moduleId: module.id,
    selector: 'jobGeoComponent',
    templateUrl: './JobGeoReport.template.html',
    providers: [JobGeoReportService, WorkerStationMgmService, StatisticsService, JobCateogryService, GeoService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class JobGeoReportComponent implements OnInit {

    errorCntrler: HandleErrorMsg;
    gMessage: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    displayDialog: boolean;
    displayWorkstationInfo: boolean = false;
    workStations: WorkStation[] = [];
    selectedWorkstation: WorkStation = null;
    errorMsg: string[] = [];
    errorMsgInPanel: string[] = [];
    hmsgs: GrowlMessage[] = [];
    form: FormGroup;
    loading: boolean = false;
    showTree: boolean = false;
    //-----------------------------------------

    activeLabel: string = this.shared.menuItem9SubItem1Label;
    workstationHeader: string;

    @ViewChild('expandingTree')
    expandingTree: Tree;
    geoTree: TreeNode[] = [];
    sampleTree: TreeNode[] = [];
    regions: Region[] = [];
    areas: Area[] = [];
    selectedNode: TreeNode;
    selectedNodeType = "";
    selectedNodID = 0;
    selectedNodeName = "";
    selectedParentNodeID = 0;
    selectedProvinceID: number = Constant.defaultProvinceID;
    selectedProvince: Province;
    selectedTownshipID: number = Constant.defaultTownshipID;
    selectedTownship: TownShip;
    geReportMsg = this.shared.geReportMsg;
    selectedCity: City = new City();
    selectedRegionID: number = 0;
    selectedJobCategory1: JobCategory1 = new JobCategory1();
    selectedJobCategory2: JobCategory2 = new JobCategory2();
    selectedJobCategory3: JobCategory3 = new JobCategory3();
    selectedJobCategory1ID: number = 0;
    selectedJobCategory2ID: number = 0;
    selectedJobCategory3ID: number = 0;
    provinceList: SelectItem[] = [];
    townshipList: SelectItem[] = [];
    cityList: SelectItem[] = [];
    jobCategory1List: SelectItem[] = [];
    jobCategory2List: SelectItem[] = [];
    jobCategory3List: SelectItem[] = [];
    jobGeoFilterForm: FormGroup;
    regionStatList: Region[] = [];
    areaStatList: AreaView[] = [];
    totalNumberOfWS: number = 0;

    displayDetailPanel: boolean = false;
    constructor(
        private _geoService: GeoService,
        private _dService: WorkerStationMgmService,
        private _jService: JobCateogryService,
        private _wsService: StatisticsService,
        private _fb: FormBuilder,
        public shared: SharedValues) {

    }
    ngOnInit() {
        this.initProvinceList();
        this.initJobCategory1List();
        this.selectedCity = new City();
        this.selectedCity.id = Constant.tehranCityID;
        this.selectedCity.name = this.shared.tehranLabel;
        this.selectedTownshipID = Constant.defaultTownshipID;
        this.initTownshipList();
        this.initCityList();
        this.initGeoTree();
        this.jobGeoFilterForm = this._fb.group({
            province: new FormControl([this.selectedProvince]),
            township: new FormControl([this.selectedTownshipID]),
            city: new FormControl([this.selectedCity]),
            jobCategory1FormCntrl: [this.selectedJobCategory1],
            jobCategory2FormCntrl: [''],
            jobCategory3FormCntrl: ['']
        });
    }
    initGeoTree() {
        this.selectedNodeType = "root";
        this.selectedNodeName = this.shared.geReportMsg;
        this.selectedNodID = 0;
        this.geoTree = [{
            data: { label: this.selectedNodeName },
            children: []
        }];
        this.selectedNode = this.geoTree[0];
        this.geoTree[0].expanded = true;
    }

    initProvinceList() {
        this._geoService.geProvinceList().subscribe(response => {
            let _provinceList: Province[] = <Province[]>response;
            _provinceList.forEach(element => {
                this.provinceList.push({ label: element.name, value: element });
            });
            this.selectedProvince = this.findProvinceByID(Constant.defaultProvinceID);

        }, error => {
            let obj: Province[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
        });

    }
    onProvinceChange(event: any) {
        this.selectedProvince = event.value;
        this.selectedProvinceID = this.selectedProvince.id;
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
            this.selectedTownship = event.value;
            this.selectedTownshipID = this.selectedTownship.id;
            this.initCityList();
        }
        catch (e) {
            console.log(e);
        }
    }
    onJobCategory1Change(event: any) {
        this.selectedJobCategory1 = event.value;
        this.selectedJobCategory2 = new JobCategory2();
        this.selectedJobCategory3 = new JobCategory3();
        this.initJobCategory2List();
        this.initJobCategory3List();
    }
    onJobCategory2Change(event: any) {
        this.selectedJobCategory2 = event.value;
        this.selectedJobCategory3 = new JobCategory3();
        this.initJobCategory3List();
    }
    findProvinceByID(id: number): Province {
        let out: Province = null;
        try {
            this.provinceList.forEach(element => {
                if (element.value.id == id) {
                    out = <Province>(element.value);
                }
            });
            return out;
        }
        catch (e) {
            console.log(e);
        }
    }

    findTownShipByID(id: number): TownShip {
        let out: TownShip = null;
        try {
            this.townshipList.forEach(element => {
                if (element.value.id == id) {
                    out = <TownShip>(element.value);
                }
            });
            return out;
        }
        catch (e) {
            console.log(e);
        }
    }
    initTownshipList() {
        this.townshipList = [];
        if (this.selectedProvinceID == 0)
            return;
        this._geoService.geTownshipList(this.selectedProvinceID)
            .subscribe(response => {
                let list: TownShip[] = <TownShip[]>response;
                list.forEach(element => {
                    this.townshipList.push({ label: element.name, value: element });
                });
                this.selectedTownship = this.findTownShipByID(Constant.defaultTownshipID);
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
        let cityInitialized = false;
        if (this.selectedTownshipID == 0)
            return;
        this._geoService.geCityList(this.selectedTownshipID)
            .subscribe(response => {
                let list: City[] = <City[]>response;
                list.forEach(element => {
                    this.cityList.push({ label: element.name, value: element });
                    if (element.id == Constant.tehranCityID) {
                        cityInitialized = true;
                        this.selectedCity = element;
                        this.selectedCity.centerLat = element.centerLat;
                        this.selectedCity.centerLong = element.centerLong;
                    }
                });
                if (this.cityList.length > 0)
                    this.selectedCity = this.cityList[0].value;
                else
                    this.selectedCity = new City();
            }
                , error => {
                    let obj: City[] = error.error;
                    let err: BackendMessage = obj[0].error;
                    this.parseError(error.status, err);
                }
            );
    }
    initJobCategory1List() {
        this.loading = true;
        this.jobCategory1List.push({ label: this.shared.chooseJC1Msg, value: new JobCategory1() });
        this._jService.geJobCategory1List().subscribe(response => {
            let _jobCategory1List: JobCategory1[] = <JobCategory1[]>response;
            _jobCategory1List.forEach(element => {
                this.jobCategory1List.push({ label: element.name, value: element });
            });
            this.loading = false;
        }, error => {
            let obj: JobCategory1[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }
    initJobCategory2List() {
        this.jobCategory2List = [];
        this.jobCategory2List.push({ label: this.shared.allJC2Label, value: new JobCategory2() });
        if (this.selectedJobCategory1.id != undefined) {
            if (this.selectedJobCategory1.id != 0) {
                this._jService.geJobCategory2List(this.selectedJobCategory1.id)
                    .subscribe(response => {
                        let list: JobCategory2[] = <JobCategory2[]>response;
                        list.forEach(element => {
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
    initJobCategory3List() {
        this.jobCategory3List = [];
        this.jobCategory3List.push({ label: this.shared.allJC3Label, value: new JobCategory3() });
        if (this.selectedJobCategory2.id != undefined) {
            if (this.selectedJobCategory2.id != 0) {
                this._jService.geJobCategory3List(this.selectedJobCategory2.id)
                    .subscribe(response => {
                        let list: JobCategory3[] = <JobCategory3[]>response;
                        list.forEach(element => {
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
    buildWorkStationSearhToCountRegion(): WorkStationSearch {
        let ws: WorkStationSearch = new WorkStationSearch();
        ws.cityId = this.selectedCity.id;
        ws.f_cityId = true;
        ws.jobCategory1Id = this.selectedJobCategory1.id;
        if (ws.jobCategory1Id != 0)
            ws.f_jobCategory1Id = true;

        if (ws.jobCategory1Id == 0) {
            this.hmsgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_InvalidJobcat1Msg });
            return null;
        }

        ws.jobCategory2Id = this.selectedJobCategory2.id;
        if (ws.jobCategory2Id != 0)
            ws.f_jobCategory2Id = true;

        // if (ws.jobCategory2Id == 0) {
        //     this.hmsgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_InvalidJobcat2Msg });
        //     return null;
        // }

        ws.jobCategory3Id = this.selectedJobCategory3.id;
        if (ws.jobCategory3Id != 0)
            ws.f_jobCategory3Id = true;

        // if (ws.jobCategory3Id == 0) {
        //     this.hmsgs.push({ severity: 'error', summary: this.shared.errorLabel, detail: this.shared.InnerCode_InvalidJobcat3Msg });
        //     return null;
        // }

        return ws;
    }


    onSubmitJobGeo() {
        let id = 0;
        let _type = "root";
        this.showTree = false;
        let regionNodes: TreeNode[] = [];
        this.displayWorkstationInfo = false;
        try {
            let ws = this.buildWorkStationSearhToCountRegion();
            if (ws == null)
                return;
            let counter = 0;
            let rList:any[] = [];
            this.geoTree = [];
            this.loading = true;
            this._wsService.wsCountInCity(ws).subscribe(response => {
                this.regionStatList = <Region[]>response;
                this.showTree = true;
                this.loading = false;

                try {
                    this.regionStatList.forEach(region => {
                        let prNode:any = {
                            data: { type: 'Region', areaID: 0, regionID: region.id, cityID: this.selectedCity.id, label: region.name, counter: region.workStationCnt },
                            children: [],
                            leaf : false
                        }
                        rList.push(prNode);
                        counter = counter + region.workStationCnt;
                    });
                }
                catch (e) {
                   console.log(e);
                  }

                this.initGeoTree();
                this.geoTree[0] = {
                    "data": { type: 'root', label: this.selectedCity.name, counter: counter, cityID: this.selectedCity.id, regionID: 0, areaID: 0 },
                    children: rList,
                    expanded: true,
                    leaf: false
                };
                this.totalNumberOfWS = counter;
                this.showDetailList(_type, this.selectedCity.id, 0, 0);
            }, error => {
                let obj: Region[] = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    nodeSelect(event) {
        this.showDetailList(event.node.data.type, event.node.data.cityID, event.node.data.regionID, event.node.data.areaID);
    }
    nodeExpand(event) {
        try {
            if (event.node) {
                let _type = event.node.data.type;
                if (_type == "Region") {
                    let id = event.node.data.regionID;
                    let areaNodes: any[] = [];
                    let ws = this.buildWorkStationSearhToCountRegion();
                    ws.regionId = id;
                    ws.f_regionId = true;
                    this.areaStatList = [];
                    let listArea:any[] = [];
                    this.loading = true;
                    this._wsService.wsCountInRegion(ws).subscribe(response => {
                        this.areaStatList = <AreaView[]>response;
                        this.areaStatList.forEach(area => {
                            let prNode = {
                                "data": { type: 'area', areaID: area.id, regionID: ws.regionId, cityID: this.selectedCity.id, label: area.name, counter: area.workStationCnt },
                                children:[],
                                leaf:true
                            }
                            areaNodes.push(prNode);
                        });
                        const node = event.node;

                        node.children = areaNodes;
                        this.geoTree = [... this.geoTree];
                        this.showDetailList(_type, event.node.data.cityID, event.node.data.regionID, event.node.data.areaID);
                        this.loading = false;
                    }, error => {
                        let obj: AreaView[] = error.error;
                        let err: BackendMessage = obj[0].error;
                        this.parseError(error.status, err);
                        this.loading = false;
                    });
                }
            }

        }
        catch (e) {
            console.log(e);
        }


    }
    showDetailList(_type: string, cityID: number, regionID: number, areaID: number) {
        this.displayDetailPanel = true;
        this.workStations = [];
        this.loading = true;
        let ws: WorkStationSearch = new WorkStationSearch();
        ws.cityId = cityID;
        ws.f_cityId = true;

        if (regionID != 0) {
            ws.regionId = regionID;
            ws.f_regionId = true;
        }
        if (_type == "area") {
            if (areaID != 0) {
                ws.areaId = areaID;
                ws.f_areaId = true;
            }
        }
        ws.jobCategory1Id = this.selectedJobCategory1.id;
        if (ws.jobCategory1Id != 0)
            ws.f_jobCategory1Id = true;

        ws.jobCategory2Id = this.selectedJobCategory2.id;
        if (ws.jobCategory2Id != 0)
            ws.f_jobCategory2Id = true;

        ws.jobCategory3Id = this.selectedJobCategory3.id;
        if (ws.jobCategory3Id != 0)
            ws.f_jobCategory3Id = true;

        this._dService.search(ws).subscribe(response => {
            this.workStations = <WorkStation[]>response;
            this.loading = false;
        }, error => {
            let obj: WorkStation[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.loading = false;
        });
    }


    showWorkStationInfo(workStation: WorkStation) {
        this.loading = true;
        this._dService.lookupById(workStation.id)
            .subscribe(response => {
                this.selectedWorkstation = <WorkStation>response;
                this.workstationHeader = this.shared.showBizInfo;
                this.loading = false;
                this.displayWorkstationInfo = true;

            }
                , error => {
                    let obj: WorkStation = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                    this.loading = false;
                }
            );
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