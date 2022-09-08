import { Constant } from './../../shared/constants.class';
import { Component, Input, OnInit, ViewChild } from '@angular/core'
import { Router, ActivatedRoute, Params } from '@angular/router';
import { GeoService } from '../../services/geo.service'
import { SharedValues } from '../../services/shared-values.service'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { TreeModule, TreeNode } from 'primeng/primeng';
import { Tree } from 'primeng/primeng';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms'
import { GeoEntity } from '../../entities/geo.class'
import { Province } from '../../entities/province.class'
import { TownShip } from '../../entities/township.class'
import { City } from '../../entities/city.class'
import { Region } from '../../entities/region.class'
import { Area } from '../../entities/area.class'
import { Observable,of} from 'rxjs'

@Component({
    moduleId: module.id,
    selector: 'geoComponent',
    templateUrl: './geo.template.html',
    providers: [GeoService]
})

export class GeoComponent implements OnInit {
    activeLabel: string = this.shared.menuItem2SubItem1Label;
    showErrorMsg: boolean = false;
    errorMsg: string[] = [];
    errorCntrler: HandleErrorMsg;
    hmsgs: GrowlMessage[] = [];
    showErrorMsgInPanel: boolean = false;
    @ViewChild('expandingTree')
    expandingTree: Tree;
    geoTree: TreeNode[];
    provinces: Province[] = [];
    townships: TownShip[] = [];
    cities: City[] = [];
    regions: Region[] = [];
    areas: Area[] = [];
    selectedNode: TreeNode;
    selectedNodeType = "";
    selectedNodID = 0;
    selectedNodeName = "";
    selectedNodeLat: number;
    selectedNodeLong: number;
    selectedNodeActive: boolean;
    selectedParentNodeID = 0;

    //--------------------------------
    newDisplayDialog: boolean;
    editDisplayDialog: boolean;
    newGeoEntity: GeoEntity = new GeoEntity();
    newProvinceNode: boolean = false;
    editProvinceNode: boolean = false;
    newTownshipNode: boolean = false;
    editTownshipNode: boolean = false;
    newCityNode: boolean = false;
    editCityNode: boolean = false;
    newRegionNode: boolean = false;
    editRegionNode: boolean = false;
    newAreaNode: boolean = false;
    editAreaNode: boolean = false;
    newNode: boolean;
    panelHeaderLabel: string;
    newForm: FormGroup;
    editForm: FormGroup;
    editEntityForm: FormGroup;

    isLoading: boolean = false;
    parentNode: TreeNode;
    editEntityDialog: boolean = false;
    selectedEntity: GeoEntity = new GeoEntity();
    selectedProvinceindex: number;
    selectedTownshipindex: number;
    selectedCityindex: number;
    selectedRegionindex: number;
    selectedAreaindex: number;

    constructor(private _router: Router, private _activatedRouter: ActivatedRoute,
        private _NodeService: GeoService, private _fb: FormBuilder,
        public shared: SharedValues,
        private confirmationService: ConfirmationService) {
        this.errorCntrler = new HandleErrorMsg(_router)
    }
    ngOnInit() {
        this.newForm = this._fb.group({
            newJobGeoName: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
            long: [''],
            lat: [''],
            active: [false]
        });
        this.editForm = this._fb.group({
            name: [this.selectedNodeName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
            long: [this.selectedNodeLong],
            lat: [this.selectedNodeLat],
            active: [this.selectedNodeActive]
        });

        this.editEntityForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(30)])],
            long: [this.selectedNodeLong],
            lat: [this.selectedNodeLat],
            active: [this.selectedNodeActive]
        });
        this.initGeoTree();

    }


    initGeoTree() {
        this.selectedNodeType = "root";
        this.selectedNodeName = this.shared.iranLabel;
        this.selectedNodID = 0;
        this.isLoading = true;
        this.provinces = [];
        let provinceList = this.getLazyData(this.selectedNodID, this.selectedNodeType).subscribe(result => {
            this.geoTree = [{
                label: this.selectedNodeName,
                children: result
            }];
            this.selectedNode = this.geoTree[0];
            this.geoTree[0].expanded = true;
            this.selectedNodeType = "";
        }, error => {
            this.showErrorMsg = true;
            let obj: any = error.error;
            let err: any = obj[0].error;
            this.parseError(error.status, err);
            this.isLoading = false;
        });

    }


    rtvProvinceList() {
        let provinceNodes: TreeNode[] = [];
        let _provinces = [...this.provinces];
        this._NodeService.geProvinceList().subscribe(response => {
            this.isLoading = false;
            _provinces = <Province[]>response;
            this.provinces = _provinces;
            let provinceArray: Province[] = [];
            provinceArray = <Province[]>response;
            provinceArray.forEach(pr => {

                let prNode: TreeNode = {
                    "label": pr.name,
                    "data": 'Province@' + pr.id + "@0",
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                }

                provinceNodes.push(prNode);
            });
            return provinceNodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: Province[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            return provinceNodes;
        });
        return provinceNodes;

    }

    rtvTownshipList(provinceID: number): TreeNode[] {
        let townshipNodes: TreeNode[] = [];


        this._NodeService.geTownshipList(provinceID).subscribe(response => {
            let _townships = <TownShip[]>response;
            this.townships = [];
            _townships.forEach(tw => {
                let prNode: TreeNode = {
                    "label": tw.name,
                    "data": 'Township@' + tw.id + "@" + provinceID,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                }

                townshipNodes.push(prNode);
                tw.province = new Province();
                tw.province.id = provinceID;
                this.townships.push(tw);
            });
            return townshipNodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: TownShip[] = error.error;
            let errObject: TownShip = obj[0];
            let err: BackendMessage = errObject.error;
            this.parseError(error.status, err);
            return townshipNodes;
        });
        return townshipNodes;
    }

    rtvCityList(townshipID: number): TreeNode[] {
        let cityNodes: TreeNode[] = [];

        this._NodeService.geCityList(townshipID).subscribe(response => {
            this.cities = [];
            let cityArray: City[] = [];
            cityArray = <City[]>response;
            cityArray.forEach(city => {
                let prNode: TreeNode = {
                    "label": city.name,
                    "data": 'City@' + city.id + "@" + townshipID + "@" + city.centerLat + "@" + city.centerLong + "@" + city.active,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }],
                }
                cityNodes.push(prNode);
                city.township = new TownShip();
                city.township.id = townshipID;
                this.cities.push(city);

            });
            return cityNodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: City[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            return cityNodes;
        });
        return cityNodes;
    }

    rtvRegionList(cityID: number): TreeNode[] {
        let regionNodes: TreeNode[] = [];

        this._NodeService.geRegionList(cityID).subscribe(response => {
            this.regions = [];
            let regionArray: Region[] = [];
            regionArray = <Region[]>response;
            regionArray.forEach(region => {
                let prNode = {
                    "label": region.name,
                    "data": 'Region@' + region.id + "@" + cityID,
                    "icon": "fa-folder",
                    "children": [{
                    }],
                }
                regionNodes.push(prNode);
                region.city = new City();
                region.city.id = cityID;
                this.regions.push(region);
            });
            return regionNodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: Region[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            return regionNodes;
        });
        return regionNodes;

    }
    rtvAreaList(regionID: number): TreeNode[] {
        let areaNodes: TreeNode[] = [];

        this._NodeService.geAreaList(regionID).subscribe(response => {
            this.areas = [];
            let areaArray: Area[] = [];
            areaArray = <Area[]>response;
            areaArray.forEach(area => {
                let prNode = {
                    "label": area.name,
                    "data": 'Area@' + area.id + "@" + regionID + "@" + area.centerLat + "@" + area.centerLong,
                    "icon": "fa-folder",
                    "leaf": true
                }
                areaNodes.push(prNode);
                area.region = new Region();
                area.region.id = regionID;
                this.areas.push(area);
            });
            return areaNodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: Area[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            return areaNodes;
        });
        return areaNodes;

    }

    nodeSelect(event: any) {
        this.selectedNodeType = "";
        this.showErrorMsg = false;

        if (event.node) {
            this.selectedNodeName = event.node.label;
            if (event.node.data != undefined) {
                let data: string[] = event.node.data.split('@');
                this.selectedNodeType = data[0];
                this.selectedNodID = Number(data[1]);
                this.selectedParentNodeID = Number(data[2]);
                this.isLoading = true;

                if (this.selectedNodeType != "Area") {

                    if (this.selectedNodeType == "City") {
                        this.selectedNodeLat = Number(data[3]);
                        this.selectedNodeLong = Number(data[4]);
                        this.selectedNodeActive = Boolean(data[5]);
                    }

                    let result = this.getLazyData(this.selectedNodID, this.selectedNodeType).subscribe(result => {
                        event.node.children = result;
                        this.isLoading = false;
                    }, error => {
                        this.showErrorMsg = true;
                        let err: any = error[0].error;
                        this.parseError(error.status, err);
                        this.isLoading = false;
                    })
                }
                else {
                    this.selectedNodeLat = Number(data[3]);
                    this.selectedNodeLong = Number(data[4]);
                }
                this.isLoading = false;
            }
        }
    }
    nodeExpand(event: any) {
        this.showErrorMsg = false;
        if (event.node) {
            this.selectedNodeName = event.node.label;

            if (event.node.data != undefined) {
                this.isLoading = true;
                let data: string[] = event.node.data.split('@');
                let type = data[0];
                let id = Number(data[1]);

                if (type != "Area") {
                    if (type == "City") {
                        this.selectedNodeLat = Number(data[3]);
                        this.selectedNodeLong = Number(data[4]);
                        this.selectedNodeActive = Boolean(data[5]);
                    }
                    let result = this.getLazyData(id, type).subscribe(result => {
                        event.node.children = result;
                        this.isLoading = false;
                    }, error => {
                        this.showErrorMsg = true;
                        let obj: any = error.error;
                        let err: any = obj[0].error;
                        this.parseError(error.status, err);
                        this.isLoading = false;
                    })
                }
                else {
                    this.selectedNodeLat = Number(data[3]);
                    this.selectedNodeLong = Number(data[4]);
                }
                this.isLoading = false;

            }

        }
    }
    getLazyData(selectedID: number, type: string) {
        if (type == "root") {
            return of(this.rtvProvinceList());
        }
        else if (type == "Province") {
            return of(this.rtvTownshipList(selectedID));
        }
        else if (type == "Township") {
            return of(this.rtvCityList(selectedID));
        }
        else if (type == "City") {
            return of(this.rtvRegionList(selectedID));
        }
        else if (type == "Region") {
            return of(this.rtvAreaList(selectedID));
        }
    }

    showProvinceEntity(pr: Province) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.selectedEntity.id = pr.id;
        this.selectedEntity.name = pr.name;
        this.editEntityDialog = true;
        this.editProvinceNode = true;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editProvinceLabel;
        this.selectedProvinceindex = this.findSelectedProvinceIndex(pr);
    }
    findSelectedProvinceIndex(pr: Province): number {
        return this.provinces.indexOf(pr);
    }
    showTownshipEntity(tw: TownShip) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.selectedEntity.id = tw.id;
        this.selectedEntity.name = tw.name;
        if (tw.province == null || tw.province == undefined)
            tw.province = new Province();

        this.selectedEntity.parentID = tw.province.id;
        this.editEntityDialog = true;
        this.editProvinceNode = false;
        this.editTownshipNode = true;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editTownshipLabel;
        this.selectedTownshipindex = this.findSelectedTownshipIndex(tw);
    }
    findSelectedTownshipIndex(tw: TownShip): number {
        return this.townships.indexOf(tw);
    }
    showCityEntity(city: City) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.selectedEntity.id = city.id;
        this.selectedEntity.name = city.name;
        this.selectedEntity.parentID = city.township.id;
        this.selectedEntity.lat = city.centerLat;
        this.selectedEntity.long = city.centerLong;
        this.selectedEntity.active = city.active;
        this.editEntityDialog = true;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editCityNode = true;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editCityLabel;
        this.selectedCityindex = this.findSelectedCityIndex(city);
    }
    findSelectedCityIndex(city: City): number {
        return this.cities.indexOf(city);
    }
    showRegionEntity(region: Region) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.selectedEntity.id = region.id;
        this.selectedEntity.name = region.name;
        this.selectedEntity.parentID = region.city.id;
        this.editEntityDialog = true;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editAreaNode = false;
        this.editRegionNode = true;
        this.panelHeaderLabel = this.shared.editRegionLabel
        this.selectedRegionindex = this.findSelectedRegionIndex(region);
    }
    findSelectedRegionIndex(region: Region): number {
        return this.regions.indexOf(region);
    }

    showAreaEntity(area: Area) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.selectedEntity.id = area.id;
        this.selectedEntity.name = area.name;
        this.selectedEntity.parentID = area.region.id;
        this.selectedEntity.lat = area.centerLat;
        this.selectedEntity.long = area.centerLong;
        this.editEntityDialog = true;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = true;
        this.panelHeaderLabel = this.shared.editAreaLabel
        this.selectedAreaindex = this.findSelectedAreaIndex(area);
    }
    findSelectedAreaIndex(area: Area): number {
        return this.areas.indexOf(area);
    }

    showAddProvincePanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.newDisplayDialog = true;
        this.newProvinceNode = true;
        this.newTownshipNode = false;
        this.newCityNode = false;
        this.newRegionNode = false;
        this.newAreaNode = false;
        this.panelHeaderLabel = this.shared.addProvinceLabel;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditProvincePanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.newProvinceNode = false;
        this.editProvinceNode = true;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editProvinceLabel;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    showEditProvince(pr: Province) {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.newProvinceNode = false;
        this.editProvinceNode = true;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editProvinceLabel;
        this.selectedNodeName = pr.name;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }


    showAddTownshipPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.newDisplayDialog = true;
        this.newTownshipNode = true;
        this.newProvinceNode = false;
        this.newCityNode = false;
        this.newRegionNode = false;
        this.newAreaNode = false;
        this.panelHeaderLabel = this.shared.addTownshipLabel;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditTownshipPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.newTownshipNode = false;
        this.editTownshipNode = true;
        this.editProvinceNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.panelHeaderLabel = this.shared.editTownshipLabel;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    showAddCityPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.newDisplayDialog = true;
        this.newCityNode = true;
        this.newProvinceNode = false;
        this.newTownshipNode = false;
        this.newRegionNode = false;
        this.newAreaNode = false;
        this.panelHeaderLabel = this.shared.addCityLabel;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditCityPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.newCityNode = false;
        this.panelHeaderLabel = this.shared.editCityLabel;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editRegionNode = false;
        this.editAreaNode = false;
        this.editCityNode = true;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    showAddRegionPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.newDisplayDialog = true;
        this.newRegionNode = true;
        this.newProvinceNode = false;
        this.newTownshipNode = false;
        this.newCityNode = false;
        this.newAreaNode = false;
        this.panelHeaderLabel = this.shared.addRegionLabel;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditRegionPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.newRegionNode = false;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.newAreaNode = false;
        this.editAreaNode = false;
        this.editRegionNode = true;
        this.panelHeaderLabel = this.shared.editRegionLabel;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    showAddAreaPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.newDisplayDialog = true;
        this.newAreaNode = true;
        this.newRegionNode = false;
        this.newProvinceNode = false;
        this.newTownshipNode = false;
        this.newCityNode = false;
        this.panelHeaderLabel = this.shared.addAreaLabel;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditAreaPanel() {
        this.showErrorMsg = false;
        this.showErrorMsgInPanel = false;
        this.editDisplayDialog = true;
        this.editProvinceNode = false;
        this.editTownshipNode = false;
        this.editCityNode = false;
        this.editRegionNode = false;
        this.editAreaNode = true;
        this.panelHeaderLabel = this.shared.editRegionLabel;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    register() {
        if (this.newProvinceNode) {
            let _provinces = [...this.provinces];
            let obj: GeoEntity = this.newGeoEntity;
            let pr: Province = new Province();
            pr.id = obj.id;
            pr.name = obj.name;
            this._NodeService.addProvince(pr).subscribe(result => {
                let pr:Province = <Province>result;
                let node: TreeNode = {
                    "label": pr.name,
                    "data": 'Province@' + pr.id + "@" + 0,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                }
                this.geoTree[0].children.push(node);
                _provinces.push(pr);
                this.provinces = _provinces;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewProvinceMsg });
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: Province = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newTownshipNode) {
            let obj: GeoEntity = this.newGeoEntity;
            let tw: TownShip = new TownShip();
            let _townships = [...this.townships];

            tw.id = obj.id;
            tw.name = obj.name;
            tw.province.id = this.selectedNodID;
            this._NodeService.addTownship(tw).subscribe(result => {
                let town:TownShip = <TownShip>result;
                let node: TreeNode = {
                    "label": town.name,
                    "data": 'Township@' + town.id + "@" + this.selectedNodID,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                };
                this.selectedNode.children.push(node);
                _townships.push(town);
                this.townships = _townships;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewTownshipMsg });
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: TownShip = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newCityNode) {
            let obj: GeoEntity = this.newGeoEntity;
            if (obj.lat < Constant.minLatitude && obj.lat > Constant.maxLatitude) {
                this.hmsgs = [];
                this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLatMsg });
                return;
            }
            if (obj.long < Constant.minLongtitude && obj.long > Constant.maxLongtitude) {
                this.hmsgs = [];
                this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLongMsg });
                return;
            }
            let city: City = new City();
            city.id = obj.id;
            city.name = obj.name;
            city.township.id = this.selectedNodID;
            city.centerLat = obj.lat;
            city.centerLong = obj.long;
            city.active = obj.active;
            let _cities = [...this.cities];

            this._NodeService.addCity(city).subscribe(result => {
                let cy:City = <City>result;
                let node: TreeNode = {
                    "label": cy.name,
                    "data": 'City@' + cy.id + "@" + this.selectedNodID + "@" +
                    city.centerLat + "@" + city.centerLong + "@" + city.active,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                };
                this.selectedNode.children.push(node);
                _cities.push(cy);
                this.cities = _cities;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewCityMsg });
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: City = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newRegionNode) {
            let obj: GeoEntity = this.newGeoEntity;
            let region: Region = new Region();
            region.id = obj.id;
            region.name = obj.name;
            region.city.id = this.selectedNodID;
            let _regions = [...this.regions];

            this._NodeService.addRegion(region).subscribe(result => {
                let rg:Region = <Region>result;
                let node: TreeNode = {
                    "label": rg.name,
                    "data": 'Region@' + rg.id + "@" + this.selectedNodID,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]

                };
                this.selectedNode.children.push(node);
                _regions.push(rg);
                this.regions = _regions;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewRegionMsg });
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: Region = error.error;
                let err: BackendMessage = obj[0].error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newAreaNode) {
            let obj: GeoEntity = this.newGeoEntity;

            let area: Area = new Area();
            area.id = obj.id;
            area.name = obj.name;
            area.region.id = this.selectedNodID;
            area.centerLat = obj.lat;
            area.centerLong = obj.long;

            let _areas = [...this.areas];
            this._NodeService.addArea(area).subscribe(result => {
                let ar:Area = <Area>result;
                let node: TreeNode = {
                    "label": ar.name,
                    "data": 'Area@' + ar.id + "@" + this.selectedNodID + "@" + area.centerLat + "@" + area.centerLong,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder"

                };
                this.selectedNode.children.push(node);
                _areas.push(ar);
                this.areas = _areas;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewAreaMsg });
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: Area = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }


    }
    update() {
        if (this.editProvinceNode) {
            let _provinces = [...this.provinces];
            let pr: Province = new Province();
            pr.id = this.selectedNodID;
            pr.name = this.selectedNodeName;
            this._NodeService.updateProvince(pr).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "Province@" + this.selectedNodID + "@0";
                let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, pr.id);
                _provinces[provinceNodeIndex].name = this.selectedNodeName;
                this.provinces = _provinces;

            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            })
        }
        else if (this.editTownshipNode) {
            let _townships = [...this.townships];
            let township: TownShip = new TownShip();
            township.id = this.selectedNodID;
            township.name = this.selectedNodeName;
            township.province.id = this.selectedParentNodeID;
            this._NodeService.updateTownship(township).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "Township@" + this.selectedNodID + "@" + this.selectedParentNodeID;
                let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, township.province.id);
                let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, township.id);
                _townships[index].name = this.selectedNodeName;
                this.townships = _townships;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editCityNode) {
            let _cities = [...this.cities];
            let city: City = new City();
            city.id = this.selectedNodID;
            city.name = this.selectedNodeName;
            city.township.id = this.selectedParentNodeID;
            city.centerLat = this.selectedNodeLat;
            city.centerLong = this.selectedNodeLong;
            city.active = this.selectedNodeActive;

            let provinceID = this.findTownshipParent(city.township.id);

            this._NodeService.updateCity(city).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "City@" + this.selectedNodID + "@" + this.selectedParentNodeID + "@" + this.selectedNodeLat + "@" + this.selectedNodeLong + "@" + this.selectedNodeActive;
                let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, city.township.id);
                let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, city.id);
                _cities[index].name = this.selectedNodeName;
                this.cities = _cities;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editRegionNode) {
            let _regions = [...this.regions];
            let region: Region = new Region();
            region.id = this.selectedNodID;
            region.name = this.selectedNodeName;
            region.city.id = this.selectedParentNodeID;
            let townshipID = this.findCityParent(region.city.id);
            let provinceID = this.findTownshipParent(townshipID);
            this._NodeService.updateRegion(region).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "Region@" + this.selectedNodID + "@" + this.selectedParentNodeID;
                let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, region.city.id);
                let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, region.id);
                _regions[index].name = this.selectedNodeName;
                this.regions = _regions;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editAreaNode) {
            let _areas = [...this.areas];
            let area: Area = new Area();

            area.id = this.selectedNodID;
            area.name = this.selectedNodeName;
            area.region.id = this.selectedParentNodeID;
            area.centerLat = this.selectedNodeLat;
            area.centerLong = this.selectedNodeLong;
            let cityID = this.findRegionParent(area.region.id);
            let townshipID = this.findCityParent(cityID);
            let provinceID = this.findTownshipParent(townshipID);
            this._NodeService.updateArea(area).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "Area@" + this.selectedNodID + "@" + this.selectedParentNodeID + "@" + this.selectedNodeLat + "@" + this.selectedNodeLong;
                let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, cityID);
                let regionNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, area.region.id);
                let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children, area.id);
                _areas[index].name = this.selectedNodeName;;
                this.areas = _areas;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
    }
    delete() {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                if (this.selectedNodeType == "Province") {
                    let pr: Province = new Province();
                    pr.id = this.selectedNodID;
                    pr.name = this.selectedNodeName;
                    this._NodeService.deleteProvince(pr).subscribe(result => {
                        let index = this.findSelectedNodeIndex(this.geoTree[0].children, pr.id);
                        this.geoTree[0].children.splice(index, 1);
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeProvinceMsg });
                        this.selectedNodeName = '';
                    }, error => {
                        this.showErrorMsg = true;
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                    });
                }
                else if (this.selectedNodeType == "Township") {
                    let township: TownShip = new TownShip();
                    township.id = this.selectedNodID;
                    township.name = this.selectedNodeName;
                    township.province.id = this.selectedParentNodeID;
                    this._NodeService.deleteTownship(township).subscribe(result => {
                        let parentNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, this.selectedParentNodeID);
                        let index = this.findSelectedNodeIndex(this.geoTree[0].children[parentNodeIndex].children, township.id);
                        this.geoTree[0].children[parentNodeIndex].children.splice(index, 1);
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeTownshipMsg });
                        this.selectedNodeName = '';
                    }, error => {
                        this.showErrorMsg = true;
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                    });
                }
                else if (this.selectedNodeType == "City") {
                    let city: City = new City();
                    city.id = this.selectedNodID;
                    city.name = this.selectedNodeName;
                    city.township.id = this.selectedParentNodeID;

                    this._NodeService.deleteCity(city).subscribe(result => {
                        let townshipNode = this.selectedNode.parent;
                        let townshipNodeData = townshipNode.data.split('@');
                        let provinceNode = townshipNode.parent;
                        let provinceNodeData = provinceNode.data.split('@');
                        let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceNodeData[1]);
                        let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipNodeData[1]);
                        let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, city.id);
                        this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children.splice(index, 1);
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeCityMsg });
                        this.selectedNodeName = '';
                    }, error => {
                        this.showErrorMsg = true;
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                    });
                }
                else if (this.selectedNodeType == "Region") {
                    let region: Region = new Region();
                    region.id = this.selectedNodID;
                    region.name = this.selectedNodeName;
                    region.city.id = this.selectedParentNodeID;

                    this._NodeService.deleteRegion(region).subscribe(result => {
                        let cityNode = this.selectedNode.parent;
                        let cityNodeData = cityNode.data.split('@');
                        let townshipNode = cityNode.parent;
                        let townshipNodeData = townshipNode.data.split('@');
                        let provinceNode = townshipNode.parent;
                        let provinceNodeData = provinceNode.data.split('@');
                        let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceNodeData[1]);
                        let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipNodeData[1]);
                        let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, cityNodeData[1]);
                        let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, region.id);
                        this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children.splice(index, 1);
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeRegionMsg });
                        this.selectedNodeName = '';
                    }, error => {
                        this.showErrorMsg = true;
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                    });
                }
                else if (this.selectedNodeType == "Area") {
                    let area: Area = new Area();
                    area.id = this.selectedNodID;
                    area.name = this.selectedNodeName;
                    area.region.id = this.selectedParentNodeID;
                    this._NodeService.deleteArea(area).subscribe(result => {

                        let regionNode = this.selectedNode.parent;

                        let regionNodeData = regionNode.data.split('@');

                        let cityNode = regionNode.parent;
                        let cityNodeData = cityNode.data.split('@');

                        let townshipNode = cityNode.parent;
                        let townshipNodeData = townshipNode.data.split('@');

                        let provinceNode = townshipNode.parent;
                        let provinceNodeData = provinceNode.data.split('@');

                        let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceNodeData[1]);
                        let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipNodeData[1]);
                        let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, cityNodeData[1]);
                        let regionNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, regionNodeData[1]);
                        let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children, area.id);
                        this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children.splice(index, 1);
                        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeAreaMsg });
                        this.selectedNodeName = '';
                    }, error => {
                        this.showErrorMsg = true;
                        let err: BackendMessage = error.error;
                        this.parseError(error.status, err);
                    });
                }
            }

        });

    }
    updateEntity() {
        try {
            if (this.editProvinceNode) {
                let pr = new Province();
                pr.id = this.selectedEntity.id;
                pr.name = this.selectedEntity.name;
                this.isLoading = true;
                let _provinces = [...this.provinces];
                this._NodeService.updateProvince(pr).subscribe(result => {
                    this.editDisplayDialog = false;
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, pr.id);
                    this.geoTree[0].children[provinceNodeIndex].data = "Province@" + pr.id + "@0";
                    this.geoTree[0].children[provinceNodeIndex].label = pr.name;
                    _provinces[this.selectedProvinceindex] = pr;
                    this.provinces = _provinces;
                    this.isLoading = false;
                }, error => {
                    this.showErrorMsgInPanel = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.isLoading = false;
                });
            }
            else if (this.editTownshipNode) {
                let tw = new TownShip();
                tw.id = this.selectedEntity.id;
                tw.name = this.selectedEntity.name;
                tw.province.id = this.selectedEntity.parentID;
                this.isLoading = true;
                let _townships = [...this.townships];

                this._NodeService.updateTownship(tw).subscribe(result => {
                    this.editDisplayDialog = false;
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, tw.province.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, tw.id);
                    this.geoTree[0].children[provinceNodeIndex].children[index].label = tw.name;
                    _townships[this.selectedTownshipindex] = tw;
                    this.townships = _townships;
                    this.isLoading = false;
                    this.editEntityDialog = false;
                }, error => {
                    this.showErrorMsgInPanel = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.isLoading = false;
                });
            }
            else if (this.editCityNode) {
                let city = new City();
                city.id = this.selectedEntity.id;
                city.name = this.selectedEntity.name;
                city.township.id = this.selectedEntity.parentID;
                city.centerLat = Number(this.selectedEntity.lat);
                city.centerLong = Number(this.selectedEntity.long);
                city.active = this.selectedEntity.active;
                if (this.selectedEntity.lat< Constant.minLatitude && this.selectedEntity.lat > Constant.maxLatitude) {
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLatMsg });
                    this.editEntityDialog = false;
                    return;
                }
                if (this.selectedEntity.long < Constant.minLongtitude && this.selectedEntity.long > Constant.maxLongtitude) {
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLongMsg });
                    this.editEntityDialog = false;
                    return;
                }

                let provinceID = this.findTownshipParent(city.township.id);
                this.isLoading = true;
                let _cities = [...this.cities];

                this._NodeService.updateCity(city).subscribe(result => {
                    this.editDisplayDialog = false;
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, city.township.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, city.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[index].label = city.name;
                    _cities[this.selectedCityindex] = city;
                    this.cities = _cities;
                    this.isLoading = false;
                    this.editEntityDialog = false;
                }, error => {
                    this.showErrorMsgInPanel = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.isLoading = false;
                });
            }
            else if (this.editRegionNode) {
                let region = new Region();
                region.id = this.selectedEntity.id;
                region.name = this.selectedEntity.name;
                region.city.id = this.selectedEntity.parentID;
                let townshipID = this.findCityParent(region.city.id);
                let provinceID = this.findTownshipParent(townshipID);
                this.isLoading = true;
                let _regions = [...this.regions];

                this._NodeService.updateRegion(region).subscribe(result => {
                    this.editDisplayDialog = false;
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                    let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, region.city.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, region.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[index].label = region.name;
                    _regions[this.selectedRegionindex] = region;
                    this.regions = _regions;
                    this.isLoading = false;
                    this.editEntityDialog = false;
                }, error => {
                    this.showErrorMsgInPanel = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.isLoading = false;
                });
            }
            else if (this.editAreaNode) {
                let area = new Area();

                area.id = this.selectedEntity.id;
                area.name = this.selectedEntity.name;
                area.region.id = this.selectedEntity.parentID;
                area.centerLat = this.selectedEntity.lat;
                area.centerLong = this.selectedEntity.long;

                if (this.selectedEntity.lat < Constant.minLatitude && this.selectedEntity.lat > Constant.maxLatitude) {
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLatMsg });
                    this.editEntityDialog = false;
                    return;
                }
                
                if (this.selectedEntity.long < Constant.minLongtitude && this.selectedEntity.long > Constant.maxLongtitude) {
                    this.hmsgs = [];
                    this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.invalidLongMsg });
                    this.editEntityDialog = false;
                    return;
                }
                let cityID = this.findRegionParent(area.region.id);
                let townshipID = this.findCityParent(cityID);
                let provinceID = this.findTownshipParent(townshipID);
                this.isLoading = true;
                let _areas = [...this.areas];
                this._NodeService.updateArea(area).subscribe(result => {
                    this.editDisplayDialog = false;
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                    let cityNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, cityID);
                    let regionNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, area.region.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children, area.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children[index].label = area.name;
                    _areas[this.selectedAreaindex] = area;
                    this.areas = _areas;
                    this.isLoading = false;
                    this.editEntityDialog = false;
                }, error => {
                    this.showErrorMsgInPanel = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                    this.isLoading = false;
                });
            }
            this.editEntityDialog = false;
        }
        catch (e) {
            console.log(e);
        }

    }


    deleteProvince(pr: Province) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteProvince(pr).subscribe(result => {
                    let nodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, pr.id);
                    let ix = this.findSelectedProvinceIndex(pr);
                    this.provinces = this.provinces.filter((val, i) => i != ix);
                    this.geoTree[0].children.splice(nodeIndex, 1);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeProvinceMsg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }

    deleteTownship(township: TownShip) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteTownship(township).subscribe(result => {
                    let parentNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, township.province.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[parentNodeIndex].children, township.id);
                    let ix = this.findSelectedTownshipIndex(township);
                    this.townships = this.townships.filter((val, i) => i != ix);
                    this.geoTree[0].children[parentNodeIndex].children.splice(index, 1);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeTownshipMsg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }
    deleteCity(city: City) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteCity(city).subscribe(result => {
                    let provinceID = this.findTownshipParent(city.township.id);
                    let provinceNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, city.township.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, city.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children.splice(index, 1);
                    let ix = this.findSelectedCityIndex(city);
                    this.cities = this.cities.filter((val, i) => i != ix);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeCityMsg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }

    deleteRegion(region: Region) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteRegion(region).subscribe(result => {
                    let townshipID = this.findCityParent(region.city.id);
                    let provinceID = this.findTownshipParent(townshipID);
                    let provinceNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                    let cityNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, region.city.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, region.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children.splice(index, 1);
                    let ix = this.findSelectedRegionIndex(region);
                    this.regions = this.regions.filter((val, i) => i != ix);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeRegionMsg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }

    deleteArea(area: Area) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteArea(area).subscribe(result => {
                    let cityID = this.findRegionParent(area.region.id);
                    let townshipID = this.findCityParent(cityID);
                    let provinceID = this.findTownshipParent(townshipID);
                    let provinceNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children, provinceID);
                    let townshipNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children, townshipID);
                    let cityNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children, cityID);
                    let regionNodeIndex =
                        this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children, area.region.id);
                    let index = this.findSelectedNodeIndex(this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children[regionNodeIndex].children, area.id);
                    this.geoTree[0].children[provinceNodeIndex].children[townshipNodeIndex].children[cityNodeIndex].children.splice(index, 1);
                    let ix = this.findSelectedAreaIndex(area);
                    this.areas = this.areas.filter((val, i) => i != ix);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeAreaMsg });
                    this.selectedNodeName = '';
                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }

    findSelectedNodeIndex(list: TreeNode[], id: number): number {

        for (let z = 0; z < list.length; z++) {
            let element = list[z];
            let data = element.data.split('@');

            let ix = Number(data[1]);

            if (ix == id)
                return z;
        }
        return 0;
    }

    findTownshipParent(id: number): number {
        for (let i = 0; i < this.townships.length; i++) {
            let tw = this.townships[i];
            if (tw.id == id)
                return tw.province.id;
        }
        return 0;
    }

    findCityParent(id: number): number {
        for (let i = 0; i < this.cities.length; i++) {
            let city = this.cities[i];
            if (city.id == id)
                return city.township.id;
        }
        return 0;
    }
    findRegionParent(id: number): number {
        for (let i = 0; i < this.regions.length; i++) {
            let region = this.regions[i];
            if (region.id == id)
                return region.city.id;
        }
        return 0;
    }
    parseError(status: any, error: any) {
        this.hmsgs = [];
        this.errorCntrler.gMessage = [];

        let err: BackendMessage = error;
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;

        errorMessages.forEach(element => {
            this.hmsgs.push(element);
        });

    }

}