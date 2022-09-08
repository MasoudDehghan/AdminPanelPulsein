import { commisionLabel } from './../../shared/global';
import { BasicData } from 'app/entities/basicData.class';
import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, Tree, TreeNode } from 'primeng/primeng';
import { of } from 'rxjs';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory } from '../../entities/JobCategory.class';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { JobCategory2 } from '../../entities/JobCategory2.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { BackendMessage } from '../../entities/Msg.class';
import { JobCateogryService } from '../../services/jobCategory.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { environment } from './../../../environments/environment';
import { UserRoleEnum } from './../../enums/userRole.enum';
import { C3PriceItem } from './../../pEntites/c3PriceItem.class';
import { SeoData } from './../../pEntites/seoData.class';
import { SeoService } from './../../services/seo.service';
import { C3Price } from 'app/pEntites/c3Price.class';
import { Cat3ToCityMap } from 'app/entities/cat3ToCityMap.class';
import { TypeInfo } from 'app/entities/typeInfo.class';
import { City } from 'app/entities/city.class';



@Component({
    moduleId: module.id,
    selector: 'jobCategory',
    templateUrl: './jobCategory.template.html',
    styleUrls: ['../../../assets/css/dashboard.css'],
    providers: [JobCateogryService, SeoService]

})


export class JobCategoryComponent {
    activeLabel: string = this.shared.menuItem2SubItem3Label;
    uploadedFiles: any[] = [];
    uploadURL: string;
    uploadedImageName: string;
    baseImagePath: string;
    showUploadIcon: boolean = false;
    showRemoveIcon: boolean = false;
    showErrorMsg: boolean = false;
    errorMsg: string[] = [];
    errorCntrler: HandleErrorMsg;

    hmsgs: GrowlMessage[] = [];
    innerPannelhmsgs: GrowlMessage[] = [];
    showErrorMsgInPanel: boolean = false;
    @ViewChild('expandingTree')
    expandingTree: Tree;
    jobcTree: TreeNode[];
    jobc1List: JobCategory1[] = [];
    jobc2List: JobCategory2[] = [];
    jobc3List: JobCategory3[] = [];
    selectedNode: TreeNode;
    selectedNodeType = "";
    selectedNodID = 0;
    selectedNodeName = "";
    selectedNodeLatinName = "";
    selectedNodePriority: number = 0;
    selectedNodeEmergencyEnable: boolean = false;
    selectedNodeNowToStartPeriod: number = 0;
    selectedNodeInvoiceRequired: boolean = false;
    selectedNodeDestinationAddressRequired = false;
    selectedNodeIcon = "";
    selectedParentNodeID = 0;
    // selectedNodeCommInItems = 0;
    // selectedNodeCommWage = 0;
    // selectedNodeCommTransfer = 0;
    selectedNodeItems_30_like: number = 0;
    selectedNodeItems_30_dislike: number = 0;
    selectedNodeItems_60_like: number = 0;
    selectedNodeItems_60_dislike: number = 0;
    selectedNodeItems_base_like: number = 0;
    selectedNodeItems_base_dislike: number = 0;
    selectedNodeWage_30_like: number = 0;
    selectedNodeWage_30_dislike: number = 0;
    selectedNodeWage_60_like: number = 0;
    selectedNodeWage_60_dislike: number = 0;
    selectedNodeWage_base_like: number = 0;
    selectedNodeWage_base_dislike: number = 0;
    selectedNodeTransfer_30_like: number = 0;
    selectedNodeTransfer_30_dislike: number = 0;
    selectedNodeTransfer_60_like: number = 0;
    selectedNodeTransfer_60_dislike: number = 0;
    selectedNodeTransfer_base_like: number = 0;
    selectedNodeTransfer_base_dislike: number = 0;
    newForm: FormGroup;
    editForm: FormGroup;
    editEntityForm: FormGroup;
    editCommForm: FormGroup;
    editPriceForm: FormGroup;
    addPriceItem: FormGroup;
    newActiveCityForm: FormGroup;
    isLoading: boolean = false;
    newDisplayDialog: boolean = false;
    editDisplayDialog: boolean = false;
    editEntityDialog: boolean = false;
    showEditCommDialog: boolean = false;
    showEditPriceDialog: boolean = false;
    showEditActiveCityDialog = false;
    selectedJobCategoty3: JobCategory3;
    newJC1Node = false;
    newJC2Node = false;
    newJC3Node = false;
    editJC1Node = false;
    editJC2Node = false;
    editJC3Node = false;

    newJobCategory: JobCategory = new JobCategory();
    selectedJobCategory: JobCategory = new JobCategory();

    selectedJC1index: number;
    selectedJC2index: number;
    selectedJC3index: number;
    panelHeaderLabel: string;
    editCommCapable: boolean = false;
    editPriceCapable: boolean = false;

    selectedJC3_Price_Name: string;
    selectedJC3_Price_Desc: string;
    selectedJC3_Price_List: C3PriceItem[];
    inLoading: boolean = false;
    toBeEditedPriceItem: C3PriceItem;
    toBeEditedACItyItem: Cat3ToCityMap;
    priceItemsClone: C3PriceItem[];
    activeCityItemsClone: Cat3ToCityMap[];
    savedEvent: any;
    newPriceItem_text: string = '';
    newPriceItem_price: number = 0;

    basicData: BasicData;
    selectedJC3_ActiveCity_List: Cat3ToCityMap[];
    newActiveCity: TypeInfo;
    newCommisionOffset: number;
    constructor(private _router: Router,
        public shared: SharedValues,
        private _NodeService: JobCateogryService,
        private seoService: SeoService,
        private _fb: FormBuilder,
        private confirmationService: ConfirmationService) {
        this.errorCntrler = new HandleErrorMsg(_router)
    }
    ngOnInit() {
        this.basicData = JSON.parse(localStorage.getItem('basicData'));

        this.newForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
            ename: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
            priority: [],
            emergencyEnable: [],
            nowToStartPeriod: [],
            invoiceRequired: [],
            destinationAddressRequired: []
        });
        this.editForm = this._fb.group({
            name: [this.selectedNodeName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
            ename: [this.selectedNodeLatinName, Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
            priority: [this.selectedNodePriority],
            emergencyEnable: [this.selectedNodeEmergencyEnable],
            nowToStartPeriod: [this.selectedNodeNowToStartPeriod],
            invoiceRequired: [this.selectedNodeInvoiceRequired],
            destinationAddressRequired: [this.selectedNodeDestinationAddressRequired]
        });

        this.editEntityForm = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(50)])],
            ename: ['', Validators.compose([Validators.required, Validators.minLength(2), Validators.maxLength(100)])],
            priority: [],
            emergencyEnable: [],
            nowToStartPeriod: [],
            invoiceRequired: [],
            destinationAddressRequired: []
        });

        this.editCommForm = this._fb.group({
            items_30_like: ['', Validators.required],
            items_30_dislike: ['', Validators.required],
            items_60_like: ['', Validators.required],
            items_60_dislike: ['', Validators.required],
            items_base_like: ['', Validators.required],
            items_base_dislike: ['', Validators.required],
            wage_30_like: ['', Validators.required],
            wage_30_dislike: ['', Validators.required],
            wage_60_like: ['', Validators.required],
            wage_60_dislike: ['', Validators.required],
            wage_base_like: ['', Validators.required],
            wage_base_dislike: ['', Validators.required],
            transfer_30_like: ['', Validators.required],
            transfer_30_dislike: ['', Validators.required],
            transfer_60_like: ['', Validators.required],
            transfer_60_dislike: ['', Validators.required],
            transfer_base_like: ['', Validators.required],
            transfer_base_dislike: ['', Validators.required]
        });
        this.editPriceForm = this._fb.group({
            title: [''],
            description: ['']
        });
        this.addPriceItem = this._fb.group({
            text: [''],
            price: ['']
        });
        this.newActiveCityForm = this._fb.group({
            activeCity: [''],
            coffset: ['',Validators.compose([Validators.required,Validators.min(-10),Validators.max(10)])]
        });

        this.initJobCTree();
        this.uploadURL = environment.apiUrl + "/upload/img/" + sessionStorage.getItem('token');
        this.baseImagePath = environment.fileServerUrl;
        this.uploadedFiles = [];
        let loggedInRole = Number(sessionStorage.getItem("roleId"));
        if (loggedInRole == UserRoleEnum.SysAdmin || loggedInRole == UserRoleEnum.Operator_H) {
            this.editCommCapable = true;
            this.editPriceCapable = true;
        }

    }

    initJobCTree() {
        this.selectedNodeType = "";
        this.selectedNodeName = this.shared.menuItem2SubItem3Label;
        this.selectedNodePriority = 0;
        this.selectedNodeEmergencyEnable = false;
        this.selectedNodeNowToStartPeriod = 0;
        this.selectedNodeInvoiceRequired = false;
        this.selectedNodeDestinationAddressRequired = false;
        this.selectedNodID = 0;
        this.isLoading = true;
        this.jobc1List = [];
        let jobc1List = this.getLazyData(this.selectedNodID, "root").subscribe(result => {
            this.jobcTree = <JobCategory1[]>result;
        }, error => {
            this.showErrorMsg = true;
            let obj: any = error.error;
            let err: any = obj[0].error;
            this.parseError(error.status, err);
            this.isLoading = false;
        });

    }

    showJobCategory1List() {
        this.selectedNodeType = "";
        this.selectedNodeName = this.shared.menuItem2SubItem3Label;
        this.selectedNodID = 0;
    }

    getLazyData(selectedID: number, type: string) {
        if (type == "root") {
            return of(this.rtvJobC1List());
        }
        else if (type == "JobCategory1") {
            return of(this.rtvJobC2List(selectedID));
        }
        else if (type == "JobCategory2") {
            return of(this.rtvJobC3List(selectedID));
        }

    }
    rtvJobC1List() {
        let jobC1Nodes: TreeNode[] = [];
        this.isLoading = true;
        this._NodeService.geJobCategory1List().subscribe(response => {
            this.jobc1List = <JobCategory1[]>response;
            let jobc1Array: JobCategory1[] = [];
            jobc1Array = <JobCategory1[]>response;
            jobc1Array.forEach(jc => {
                let jc1Node: TreeNode = {
                    "label": jc.name,
                    "data": 'JobCategory1@' + jc.id + "@0" + "@" + jc.ename,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                };


                jobC1Nodes.push(jc1Node);
                this.isLoading = false;
            });
            return jobC1Nodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: JobCategory1[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.isLoading = false;
            return jobC1Nodes;
        });
        return jobC1Nodes;
    }

    rtvJobC2List(jobC1ID: number): TreeNode[] {
        let jobC2Nodes: TreeNode[] = [];
        this.isLoading = true;
        this._NodeService.geJobCategory2List(jobC1ID).subscribe(response => {
            this.jobc2List = <JobCategory2[]>response;
            let jobc2Array: JobCategory2[] = [];
            jobc2Array = <JobCategory2[]>response;
            jobc2Array.forEach(jc => {
                let jNode: TreeNode = {
                    "label": jc.name,
                    "data": 'JobCategory2@' + jc.id + "@" + jobC1ID + "@" + jc.ename,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                }

                jobC2Nodes.push(jNode);
                this.isLoading = false;
            });
            return jobC2Nodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: JobCategory2[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.isLoading = false;
            return jobC2Nodes;
        });
        return jobC2Nodes;
    }
    rtvJobC3List(jobC2ID: number): TreeNode[] {
        let jobC3Nodes: TreeNode[] = [];
        this.isLoading = true;
        this._NodeService.geJobCategory3List(jobC2ID).subscribe(response => {
            this.jobc3List = <JobCategory3[]>response;
            let jobc3Array: JobCategory3[] = [];
            jobc3Array = <JobCategory3[]>response;
            jobc3Array.forEach(jc => {
                let jNode: TreeNode = {
                    "label": jc.name,
                    "data": '',
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder"
                }
                jNode.data = this.buildJC3NodeData(jc.id, jobC2ID, jc.priority, jc);
                jobC3Nodes.push(jNode);
                this.isLoading = false;
            });
            return jobC3Nodes;
        }, error => {
            this.showErrorMsg = true;
            let obj: JobCategory3[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
            this.isLoading = false;
            return jobC3Nodes;
        });
        return jobC3Nodes;
    }

    nodeSelect(event: any) {
        this.selectedNodeType = "";
        this.showErrorMsg = false;
        this.hmsgs = [];
        if (event.node) {
            this.selectedNodeName = event.node.label;

            if (event.node.data != undefined) {
                let data: string[] = event.node.data.split('@');
                let i = 0;
                this.selectedNodeType = data[i];
                this.selectedNodID = Number(data[++i]);
                this.selectedParentNodeID = Number(data[++i]);
                if (this.selectedNodeType == 'JobCategory1') {
                    let jc1 = this.jobc1List[this.findSelectedJC1(this.selectedNodID)];
                    this.selectedNodeIcon = jc1.icon;
                }
                else if (this.selectedNodeType == 'JobCategory2') {
                    let jc2 = this.jobc2List[this.findSelectedJC2(this.selectedNodID)];
                    this.selectedNodeIcon = jc2.icon;
                }
                else if (this.selectedNodeType == 'JobCategory3') {
                    this.initJC3SelectedParams(data, i);
                    let jc3 = this.jobc3List[this.findSelectedJC3(this.selectedNodID)];
                    this.selectedNodeIcon = jc3.icon;
                    this.selectedNodePriority = jc3.priority;
                    this.selectedNodeEmergencyEnable = jc3.emergencyEnable
                    this.selectedNodeNowToStartPeriod = jc3.nowToStartPeriod
                    this.selectedNodeInvoiceRequired = jc3.invoiceRequired;
                    this.selectedNodeDestinationAddressRequired = jc3.destinationAddressRequired;
                    this.selectedNodeLatinName = jc3.ename;
                    this.selectedJobCategoty3 = jc3;
                }

                this.isLoading = true;
                if (this.selectedNodeType != "JobCategory3") {
                    let result = this.getLazyData(this.selectedNodID, this.selectedNodeType).subscribe(result => {
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
                this.isLoading = false;
            }
        }
    }
    initJC3SelectedParams(data: string[], i: number) {
        this.selectedNodePriority = Number(data[++i]);
        this.selectedNodeLatinName = data[++i];
        this.selectedNodeEmergencyEnable = Boolean(data[++i]);
        this.selectedNodeNowToStartPeriod = Number(data[++i]);
        this.selectedNodeInvoiceRequired = Boolean(data[++i]);
        this.selectedNodeDestinationAddressRequired = Boolean(data[++i]);
        this.selectedNodeItems_30_like = Number(data[++i]);
        this.selectedNodeItems_30_dislike = Number(data[++i]);
        this.selectedNodeItems_60_like = Number(data[++i]);
        this.selectedNodeItems_60_dislike = Number(data[++i]);
        this.selectedNodeItems_base_like = Number(data[++i]);
        this.selectedNodeItems_base_dislike = Number(data[++i]);
        this.selectedNodeWage_30_like = Number(data[++i]);
        this.selectedNodeWage_30_dislike = Number(data[++i]);
        this.selectedNodeWage_60_like = Number(data[++i]);
        this.selectedNodeWage_60_dislike = Number(data[++i]);
        this.selectedNodeWage_base_like = Number(data[++i]);
        this.selectedNodeWage_base_dislike = Number(data[++i]);
        this.selectedNodeTransfer_30_like = Number(data[++i]);
        this.selectedNodeTransfer_30_dislike = Number(data[++i]);
        this.selectedNodeTransfer_60_like = Number(data[++i]);
        this.selectedNodeTransfer_60_dislike = Number(data[++i]);
        this.selectedNodeTransfer_base_like = Number(data[++i]);
        this.selectedNodeTransfer_base_dislike = Number(data[++i]);
    }
    nodeExpand(event: any) {
        this.showErrorMsg = false;
        this.hmsgs = [];
        if (event.node) {
            this.selectedNodeName = event.node.label;

            if (event.node.data != undefined) {
                this.isLoading = true;
                let data: string[] = event.node.data.split('@');
                let i = 0;
                let type = data[i];
                let id = Number(data[++i]);
                if (type != "JobCategory3") {
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

                    this.initJC3SelectedParams(data, i);
                }
                this.isLoading = false;

            }

        }
    }

    showAddJobCategory1Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.newJobCategory = new JobCategory();
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.newDisplayDialog = true;
        this.newJC1Node = true;
        this.newJC2Node = false;
        this.newJC3Node = false;
        this.panelHeaderLabel = this.shared.addJC1Label;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showAddJobCategory2Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.newJobCategory = new JobCategory();
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.newDisplayDialog = true;
        this.newJC1Node = false;
        this.newJC2Node = true;
        this.newJC3Node = false;
        this.panelHeaderLabel = this.shared.addJC2Label;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showAddJobCategory3Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.newJobCategory = new JobCategory();
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.newDisplayDialog = true;
        this.newJC1Node = false;
        this.newJC2Node = false;
        this.newJC3Node = true;
        this.panelHeaderLabel = this.shared.addJC3Label;
        this.newForm.clearValidators();
        this.newForm.markAsUntouched();
    }

    showEditJobCategory1Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.showUploadIcon = false;
        this.editDisplayDialog = true;
        this.editJC1Node = true;
        this.editJC2Node = false;
        this.editJC3Node = false;
        this.panelHeaderLabel = this.shared.editJC1Label;
        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;

        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }
    showEditJobCategory2Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.showUploadIcon = false;
        this.editDisplayDialog = true;
        this.editJC1Node = false;
        this.editJC2Node = true;
        this.editJC3Node = false;
        this.panelHeaderLabel = this.shared.editJC2Label;
        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;

        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }
    showEditJobCategory3Panel() {
        this.showErrorMsg = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.uploadedFiles = [];
        this.uploadedImageName = "";
        this.showUploadIcon = false;
        this.editDisplayDialog = true;
        this.editJC1Node = false;
        this.editJC2Node = false;
        this.editJC3Node = true;
        this.panelHeaderLabel = this.shared.editJC3Label;
        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;
        this.editForm.clearValidators();
        this.editForm.markAsUntouched();
    }

    showEditCommissionPanelx() {
        this.editCommForm.clearValidators();
        this.editCommForm.markAsUntouched();
        this.editCommForm.reset();
        this.showEditCommDialog = true;
        this.panelHeaderLabel = this.shared.editCommissionLabel + " " + this.selectedJobCategoty3.name;
    }
    showEditCommissionPanel(jc: JobCategory3) {
        this.editCommForm.clearValidators();
        this.editCommForm.markAsUntouched();
        this.editCommForm.reset();
        this.showEditCommDialog = true;
        this.selectedJobCategoty3 = jc;
        this.panelHeaderLabel = this.shared.editCommissionLabel + " " + jc.name;
    }
    showEditPricePanelx() {
        let id = this.selectedJobCategoty3.id;
        this.isLoading = true;
        this.seoService.getList(id).subscribe(res => {
            let data = <SeoData>res;
            if (data.priceInfo) {
                this.selectedJC3_Price_Name = data.priceInfo.title;
                this.selectedJC3_Price_Desc = data.priceInfo.description;
                this.selectedJC3_Price_List = data.priceInfo.items;
                this.priceItemsClone = this.clonePriceItems(this.selectedJC3_Price_List);
            }
            else {
                this.selectedJC3_Price_Name = "";
                this.selectedJC3_Price_Desc = "";
                this.selectedJC3_Price_List = [];
            }

            this.newPriceItem_price = 0;
            this.newPriceItem_text = '';
            this.editPriceForm.clearValidators();
            this.editPriceForm.markAsUntouched();
            this.editPriceForm.reset();
            this.showEditPriceDialog = true;
            this.panelHeaderLabel = this.shared.editPriceLabel + " " + this.selectedJobCategoty3.name;
            this.isLoading = false;
        }, error => {
            this.showErrorMsg = true;
            let err: BackendMessage = error.error;
            this.parseError(error.status, err);
        })

    }
    clonePriceItems(arr: C3PriceItem[]): C3PriceItem[] {
        const result: C3PriceItem[] = [];
        if (!arr)
            return result;
        if (arr == undefined)
            return result;
        if (arr == null)
            return result;
        if (arr.length == 0)
            return result;
        const arrayLength = arr.length;
        for (let i = 0; i <= arrayLength; i++) {
            const item = arr[i];
            if (item) {
                const pr = new C3PriceItem();
                pr.text = item.text;
                pr.price = item.price;
                result.push(pr);
            }
        }
        return result;
    }
    cloneActiveCityItems(arr: Cat3ToCityMap[]): Cat3ToCityMap[] {
        const result: Cat3ToCityMap[] = [];
        if (!arr)
            return result;
        if (arr == undefined)
            return result;
        if (arr == null)
            return result;
        if (arr.length == 0)
            return result;
        const arrayLength = arr.length;
        for (let i = 0; i <= arrayLength; i++) {
            const item = arr[i];
            if (item) {
                const pr = new Cat3ToCityMap();
                pr.id = item.id;
                pr.city = new City();
                pr.city.id = item.city.id;
                pr.city.name = item.city.name;
                pr.comissionOffset = item.comissionOffset;
                result.push(pr);
            }
        }
        return result;
    }
    showEditPricePanel(jc: JobCategory3) {
        this.selectedJobCategoty3 = jc;
        let id = this.selectedJobCategoty3.id;
        this.isLoading = true;
        this.seoService.getList(id).subscribe(res => {
            let data = <SeoData>res;
            if (data.priceInfo) {
                this.selectedJC3_Price_Name = data.priceInfo.title;
                this.selectedJC3_Price_Desc = data.priceInfo.description;
                this.selectedJC3_Price_List = data.priceInfo.items;
                this.priceItemsClone = this.clonePriceItems(this.selectedJC3_Price_List);
            }
            else {
                this.selectedJC3_Price_Name = "";
                this.selectedJC3_Price_Desc = "";
                this.selectedJC3_Price_List = [];
            }

            this.editPriceForm.clearValidators();
            this.editPriceForm.markAsUntouched();
            this.editPriceForm.reset();
            this.showEditPriceDialog = true;
            this.panelHeaderLabel = this.shared.editPriceLabel + " " + this.selectedJobCategoty3.name;
            this.isLoading = false;
        }, error => {
            this.showErrorMsg = true;
            let err: BackendMessage = error.error;
            this.parseError(error.status, err);
        })
    }
    removePriceItem(pr: C3PriceItem) {
        let selectedPriceItem = this.selectedJC3_Price_List.find(x => x.text == pr.text);
        let index = this.selectedJC3_Price_List.indexOf(selectedPriceItem, 0);
        this.selectedJC3_Price_List = this.selectedJC3_Price_List.filter((val, i) => i != index);
    }
    removeActiveCity(pr: Cat3ToCityMap) {
        let selectedActiveCity = this.selectedJC3_ActiveCity_List.find(x => x.id == pr.id);

        let jc3 = new JobCategory3();
        jc3.id = this.selectedJobCategoty3.id;
        jc3.activeCities = [];
        jc3.activeCities.push(selectedActiveCity);

        this.inLoading = true;
        this._NodeService.deleteActiveCity(jc3).subscribe(response => {
            this.inLoading = false;
            let index = this.selectedJC3_ActiveCity_List.indexOf(selectedActiveCity, 0);
            this.selectedJC3_ActiveCity_List = this.selectedJC3_ActiveCity_List.filter((val, i) => i != index);
            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        }, error => {
            this.inLoading = false;
            this.errorCntrler.gMessage = [];
            let err: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, error.error.error);
            let errorMessages = this.errorCntrler.gMessage;
            this.hmsgs = [];
            errorMessages.forEach(element => {
                this.hmsgs.push(element);
            });
        });

    }
    showJC3EditActiveCitiesPanel() {

        this.newActiveCityForm.clearValidators();
        this.newActiveCityForm.markAsUntouched();
        this.newActiveCityForm.reset();
        this.selectedJC3_ActiveCity_List = this.selectedJobCategoty3.activeCities;
        this.activeCityItemsClone = this.cloneActiveCityItems(this.selectedJC3_ActiveCity_List);
        this.showEditActiveCityDialog = true;
        this.panelHeaderLabel = this.shared.editActiveCityLabel + " " + this.selectedJobCategoty3.name;
    }

    showJC3EditActiveCitiesPanelc(jc:JobCategory3) {

        this.newActiveCityForm.clearValidators();
        this.newActiveCityForm.markAsUntouched();
        this.newActiveCityForm.reset();
        this.selectedJobCategoty3 = jc;
        this.selectedJC3_ActiveCity_List = this.selectedJobCategoty3.activeCities;
        this.activeCityItemsClone = this.cloneActiveCityItems(this.selectedJC3_ActiveCity_List);
        this.showEditActiveCityDialog = true;
        this.panelHeaderLabel = this.shared.editActiveCityLabel + " " + this.selectedJobCategoty3.name;
    }
    delete() {
        try {
            this.confirmationService.confirm({
                message: this.shared.confirmText,
                accept: () => {
                    if (this.selectedNodeType == "JobCategory1") {
                        let jc1: JobCategory1 = new JobCategory1();
                        jc1.id = this.selectedNodID;
                        jc1.name = this.selectedNodeName;
                        this._NodeService.deleteJobCategory1(jc1).subscribe(result => {
                            let index = this.findSelectedNodeIndex(this.jobcTree, jc1.id);
                            this.jobcTree.splice(index, 1);
                            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC1Msg });
                            this.showJobCategory1List();
                        }, error => {
                            this.showErrorMsg = true;
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);

                        });
                    }
                    else if (this.selectedNodeType == "JobCategory2") {
                        let jc2: JobCategory2 = new JobCategory2();
                        jc2.id = this.selectedNodID;
                        jc2.name = this.selectedNodeName;
                        jc2.jobCategory1.id = this.selectedParentNodeID;
                        this._NodeService.deleteJobCategory2(jc2).subscribe(result => {
                            let parentNodeIndex = this.findSelectedNodeIndex(this.jobcTree, this.selectedParentNodeID);
                            let index = this.findSelectedNodeIndex(this.jobcTree[parentNodeIndex].children, jc2.id);
                            this.jobcTree[parentNodeIndex].children.splice(index, 1);
                            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC1Msg });
                        }, error => {
                            this.showErrorMsg = true;
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
                    }
                    else if (this.selectedNodeType == "JobCategory3") {
                        let jc3: JobCategory3 = new JobCategory3();
                        jc3.id = this.selectedNodID;
                        jc3.name = this.selectedNodeName;
                        jc3.priority = this.selectedNodePriority;
                        jc3.jobCategory2.id = this.selectedParentNodeID;

                        this._NodeService.deleteJobCategory3(jc3).subscribe(result => {
                            let jc2Node = this.selectedNode.parent;
                            let jc2NodeData = jc2Node.data.split('@');
                            let jc1Node = jc2Node.parent;
                            let jc1NodeData = jc1Node.data.split('@');
                            let jc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jc1NodeData[1]);
                            let jc2NodeIndex = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children, jc2NodeData[1]);
                            let index = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children, jc3.id);
                            this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children.splice(index, 1);
                            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC3Msg });
                            this.selectedNodeName = '';
                            this.selectedNodeType = 'JobCategory2';
                        }, error => {
                            this.showErrorMsg = true;
                            let err: BackendMessage = error.error;
                            this.parseError(error.status, err);
                        });
                    }

                }

            });
        }
        catch (e) {
            console.log(e);
        }

    }

    register(value: any) {
        if (this.newJC1Node) {
            let _jobc1List = [...this.jobc1List];

            let obj: JobCategory = this.newJobCategory;
            let jc1: JobCategory1 = new JobCategory1();
            jc1.id = obj.id;
            jc1.name = obj.name;
            jc1.ename = obj.ename;
            jc1.icon = this.uploadedImageName;
            this.isLoading = true;
            //Add Icon 
            this._NodeService.addJobCategory1(jc1).subscribe(result => {
                let jcx1 = <JobCategory1>result;
                let node: TreeNode = {
                    "label": jcx1.name,
                    "data": 'JobCategory1@' + jcx1.id + "@" + 0 + "@" + jcx1.ename,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                }
                this.jobcTree.push(node);
                _jobc1List.push(jcx1);
                this.jobc1List = _jobc1List;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewJC1Msg });
                this.isLoading = false;
                this.showJobCategory1List();
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory1 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newJC2Node) {
            let _jobc2List = [...this.jobc2List];

            let obj: JobCategory = this.newJobCategory;
            let jc2: JobCategory2 = new JobCategory2();
            jc2.id = obj.id;
            jc2.name = obj.name;
            jc2.ename = obj.ename;
            jc2.jobCategory1.id = this.selectedNodID;
            jc2.icon = this.uploadedImageName;
            this.isLoading = true;
            //Add Icon
            this._NodeService.addJobCategory2(jc2).subscribe(result => {
                let jcx2 = <JobCategory2>result;
                let node: TreeNode = {
                    "label": jcx2.name,
                    "data": 'jobCategory2@' + jcx2.id + "@" + this.selectedNodID + "@" + jcx2.ename,
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder",
                    "children": [{
                    }]
                };
                this.selectedNode.children.push(node);
                _jobc2List.push(jcx2);
                this.jobc2List = _jobc2List;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewJC2Msg });
                this.isLoading = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory2 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.newJC3Node) {

            let _jobc3List = [...this.jobc3List];

            let obj: JobCategory = this.newJobCategory;
            let jc3: JobCategory3 = new JobCategory3();
            jc3.id = obj.id;
            jc3.name = obj.name;
            jc3.ename = obj.ename;
            jc3.jobCategory2.id = this.selectedNodID;
            jc3.icon = this.uploadedImageName;
            if (obj.priority == undefined)
                jc3.priority = 1;
            else
                jc3.priority = obj.priority;
            jc3.invoiceRequired = obj.invoiceRequired;
            jc3.nowToStartPeriod = obj.nowToStartPeriod;
            jc3.emergencyEnable = obj.emergencyEnable;
            jc3.destinationAddressRequired = obj.destinationAddressRequired;
            this.isLoading = true;
            //Add Icon
            this._NodeService.addJobCategory3(jc3).subscribe(result => {
                let jcx3 = <JobCategory3>result;
                let node: TreeNode = {
                    "label": jcx3.name,
                    "data": '',
                    "expandedIcon": "fa-folder-open",
                    "collapsedIcon": "fa-folder"
                };
                node.data = this.buildJC3NodeData(jcx3.id, this.selectedNodID, jcx3.priority, jcx3);
                this.selectedNode.children.push(node);
                _jobc3List.push(jcx3);
                this.jobc3List = _jobc3List;
                this.newDisplayDialog = false;
                this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.addNewJC3Msg });
                this.isLoading = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory3 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
    }
    showChangeIcon() {
        this.showUploadIcon = true;
    }
    removeIcon() {
        if (this.editJC1Node) {
            let _jobc1List = [...this.jobc1List];

            let jc1: JobCategory1 = new JobCategory1();
            jc1.id = this.selectedNodID;
            jc1.name = this.selectedNodeName;
            jc1.icon = this.selectedNodeIcon;
            this._NodeService.removeJobCategory1Icon(jc1).subscribe(result => {
                let jcx1: JobCategory1 = <JobCategory1>result;
                this.editDisplayDialog = false;
                this.editEntityDialog = false;
                if (this.selectedNode != null) {
                    this.selectedNode.label = this.selectedNodeName;
                    this.selectedNode.data = "JobCategory1@" + this.selectedNodID + "@0" + "@" + jcx1.ename;
                }
                this.selectedNodeIcon = jcx1.icon;
                _jobc1List[this.findSelectedJC1(jc1.id)].icon = jcx1.icon;
                this.jobc1List = _jobc1List;

                this.showJobCategory1List();
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory1 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            })
        }
        else if (this.editJC2Node) {
            let _jobc2List = [...this.jobc2List];

            let jc2: JobCategory2 = new JobCategory2();
            jc2.id = this.selectedNodID;
            jc2.name = this.selectedNodeName;
            jc2.icon = this.selectedNodeIcon;
            this._NodeService.removeJobCategory2Icon(jc2).subscribe(result => {
                let jcx2: JobCategory2 = <JobCategory2>result;

                this.editDisplayDialog = false;
                this.editEntityDialog = false;
                if (this.selectedNode != null) {
                    this.selectedNode.label = this.selectedNodeName;
                    this.selectedNode.data = "JobCategory2@" + this.selectedNodID + "@0" + "@" + jcx2.ename;
                }
                this.selectedNodeIcon = jcx2.icon;
                _jobc2List[this.findSelectedJC2(jc2.id)].icon = jcx2.icon;
                this.jobc2List = _jobc2List;

            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory2 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            })
        }
        else if (this.editJC3Node) {
            let _jobc3List = [...this.jobc3List];

            let jc3: JobCategory3 = new JobCategory3();
            jc3.id = this.selectedNodID;
            jc3.name = this.selectedNodeName;
            jc3.icon = this.selectedNodeIcon;
            jc3.priority = this.selectedNodePriority;
            this._NodeService.removeJobCategory3Icon(jc3).subscribe(result => {
                let jcx3: JobCategory3 = <JobCategory3>result;
                this.editDisplayDialog = false;
                this.editEntityDialog = false;
                if (this.selectedNode != null) {
                    this.selectedNode.label = this.selectedNodeName;
                    this.selectedNode.data = this.buildJC3NodeData(this.selectedNodID, 0, this.selectedNodePriority, jc3);
                }
                this.selectedNodeIcon = jcx3.icon;
                _jobc3List[this.findSelectedJC3(jc3.id)].icon = jcx3.icon;
                this.jobc3List = _jobc3List;
            }, error => {
                this.showErrorMsgInPanel = true;
                let obj: JobCategory3 = error.error;
                let err: BackendMessage = obj.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            })
        }
    }

    buildJC3NodeData(nodeID: number, parentNodeID: number, nodeProiority: number, jc3: JobCategory3) {
        return "JobCategory3@" + nodeID + "@" + parentNodeID +
            "@" + nodeProiority + "@" + jc3.ename + "@" +
            jc3.emergencyEnable + "@" + jc3.nowToStartPeriod + "@" + jc3.invoiceRequired + "@" +
            jc3.destinationAddressRequired + "@" +
            jc3.commission.items_30_like + "@" + jc3.commission.items_30_dislike + "@" +
            jc3.commission.items_60_like + "@" + jc3.commission.items_60_dislike + "@" +
            jc3.commission.items_base_like + "@" + jc3.commission.items_base_dislike + "@" +
            jc3.commission.wage_30_like + "@" + jc3.commission.wage_30_dislike + "@" +
            jc3.commission.wage_60_like + "@" + jc3.commission.wage_60_dislike + "@" +
            jc3.commission.wage_base_like + "@" + jc3.commission.wage_base_dislike + "@" +
            jc3.commission.transfer_30_like + "@" + jc3.commission.transfer_30_dislike + "@" +
            jc3.commission.transfer_60_like + "@" + jc3.commission.transfer_60_dislike + "@" +
            jc3.commission.transfer_base_like + "@" + jc3.commission.transfer_base_dislike;
    }
    update() {
        if (this.editJC1Node) {
            let _jobc1List = [...this.jobc1List];
            let jc1: JobCategory1 = new JobCategory1();
            jc1.id = this.selectedNodID;
            jc1.name = this.selectedNodeName;
            jc1.ename = this.selectedNodeLatinName;
            jc1.icon = this.selectedNodeIcon;
            this._NodeService.updateJobCategory1(jc1).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "JobCategory1@" + this.selectedNodID + "@0" + "@" + jc1.ename;
                _jobc1List[this.findSelectedJC1(jc1.id)] = jc1;
                this.jobc1List = _jobc1List;
                this.showJobCategory1List();
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            })
        }
        else if (this.editJC2Node) {
            let _jobc2List = [...this.jobc2List];
            let jc2: JobCategory2 = new JobCategory2();
            jc2.id = this.selectedNodID;
            jc2.name = this.selectedNodeName;
            jc2.ename = this.selectedNodeLatinName;
            jc2.jobCategory1.id = this.selectedParentNodeID;
            jc2.icon = this.selectedNodeIcon;
            this._NodeService.updateJobCategory2(jc2).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = "JobCategory2@" + this.selectedNodID + "@" + this.selectedParentNodeID + "@" + jc2.ename;
                _jobc2List[this.findSelectedJC2(jc2.id)] = jc2;
                this.jobc2List = _jobc2List;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editJC3Node) {
            let _jobc3List = [...this.jobc3List];
            let jc3: JobCategory3 = new JobCategory3();
            jc3.id = this.selectedNodID;
            jc3.name = this.selectedNodeName;
            jc3.ename = this.selectedNodeLatinName;
            jc3.jobCategory2.id = this.selectedParentNodeID;
            jc3.icon = this.selectedNodeIcon;
            jc3.priority = this.selectedNodePriority;
            jc3.invoiceRequired = this.selectedNodeInvoiceRequired;
            jc3.nowToStartPeriod = this.selectedNodeNowToStartPeriod;
            jc3.emergencyEnable = this.selectedNodeEmergencyEnable;
            jc3.destinationAddressRequired = this.selectedNodeDestinationAddressRequired;
            this._NodeService.updateJobCategory3(jc3).subscribe(result => {
                this.editDisplayDialog = false;
                this.selectedNode.label = this.selectedNodeName;
                this.selectedNode.data = this.buildJC3NodeData(this.selectedNodID, this.selectedParentNodeID, this.selectedNodePriority, jc3);
                _jobc3List[this.findSelectedJC3(jc3.id)] = jc3;
                this.jobc3List = _jobc3List;

            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }

    }
    showJobCategory1EditPanel(jc1: JobCategory1) {
        this.showErrorMsg = false;
        this.editEntityDialog = true;
        this.showUploadIcon = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.selectedJobCategory.id = jc1.id;
        this.selectedJobCategory.name = jc1.name;
        this.selectedJobCategory.ename = jc1.ename;
        this.editJC1Node = true;
        this.editJC2Node = false;
        this.editJC3Node = false;;
        this.panelHeaderLabel = this.shared.editJC1Label;
        this.selectedJC1index = this.findSelectedJC1Index(jc1);
        this.selectedNodeIcon = jc1.icon;
        this.selectedNodID = jc1.id;
        this.selectedNodeName = jc1.name;
        this.selectedNodeLatinName = jc1.ename;


        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;
        this.editEntityForm.clearValidators();
        this.editEntityForm.markAsUntouched();


    }
    showJobCategory2EditPanel(jc2: JobCategory2) {
        this.showErrorMsg = false;
        this.editEntityDialog = true;
        this.showUploadIcon = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.selectedJobCategory.id = jc2.id;
        this.selectedJobCategory.name = jc2.name;
        this.selectedJobCategory.parentID = jc2.jobCategory1.id;
        this.selectedJobCategory.ename = jc2.ename;
        this.editJC1Node = false;
        this.editJC2Node = true;
        this.editJC3Node = false;;
        this.panelHeaderLabel = this.shared.editJC2Label;
        this.selectedJC2index = this.findSelectedJC2Index(jc2);
        this.selectedNodeIcon = jc2.icon;
        this.selectedNodID = jc2.id;
        this.selectedNodeName = jc2.name;
        this.selectedNodeLatinName = jc2.ename;
        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;
        this.editEntityForm.clearValidators();
        this.editEntityForm.markAsUntouched();

    }
    showJobCategory3EditPanel(jc3: JobCategory3) {

        this.showErrorMsg = false;
        this.editEntityDialog = true;
        this.showUploadIcon = false;
        this.hmsgs = [];
        this.innerPannelhmsgs = [];
        this.showErrorMsgInPanel = false;
        this.selectedJobCategory.id = jc3.id;
        this.selectedJobCategory.name = jc3.name;
        this.selectedJobCategory.parentID = jc3.jobCategory2.id;
        this.selectedJobCategory.priority = jc3.priority;
        this.selectedJobCategory.ename = jc3.ename;
        this.selectedJobCategory.emergencyEnable = jc3.emergencyEnable;
        this.selectedJobCategory.nowToStartPeriod = jc3.nowToStartPeriod;
        this.selectedJobCategory.invoiceRequired = jc3.invoiceRequired;
        this.selectedJobCategory.destinationAddressRequired = jc3.destinationAddressRequired;
        this.editJC1Node = false;
        this.editJC2Node = false;
        this.editJC3Node = true;
        this.panelHeaderLabel = this.shared.editJC3Label;
        this.selectedJC3index = this.findSelectedJC3Index(jc3);
        this.selectedNodeIcon = jc3.icon;
        this.selectedNodID = jc3.id;
        this.selectedNodeName = jc3.name;
        this.selectedNodeLatinName = jc3.ename;
        this.selectedNodePriority = jc3.priority;
        this.selectedNodeEmergencyEnable = jc3.emergencyEnable;
        this.selectedNodeNowToStartPeriod = jc3.nowToStartPeriod;
        this.selectedNodeInvoiceRequired = jc3.invoiceRequired;
        if (this.selectedNodeIcon == "" || this.selectedNodeIcon.startsWith("EmptyImages"))
            this.showRemoveIcon = false;
        else
            this.showRemoveIcon = true;
        this.editEntityForm.clearValidators();
        this.editEntityForm.markAsUntouched();
    }
    deleteJobCategory1(jc1: JobCategory1) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteJobCategory1(jc1).subscribe(result => {
                    let nodeIndex = this.findSelectedNodeIndex(this.jobcTree, jc1.id);
                    let ix = this.findSelectedJC1Index(jc1);
                    //this.jobc1List.splice(ix, 1);
                    this.jobc1List = this.jobc1List.filter((val, i) => i != ix);
                    this.jobcTree.splice(nodeIndex, 1);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC1Msg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });
    }
    deleteJobCategory2(jc2: JobCategory2) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteJobCategory2(jc2).subscribe(result => {
                    let parentNodeIndex = this.findSelectedNodeIndex(this.jobcTree, jc2.jobCategory1.id);
                    let index = this.findSelectedNodeIndex(this.jobcTree[parentNodeIndex].children, jc2.id);
                    let ix = this.findSelectedJC2Index(jc2);
                    //this.jobc2List.splice(ix, 1);
                    this.jobc2List = this.jobc2List.filter((val, i) => i != ix);
                    this.jobcTree[parentNodeIndex].children.splice(index, 1);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC2Msg });
                    this.selectedNodeName = '';

                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }
    deleteJobCategory3(jc3: JobCategory3) {
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this._NodeService.deleteJobCategory3(jc3).subscribe(result => {
                    let jobc1ID = this.findJobCateogry2Parent(jc3.jobCategory2.id);
                    let jobc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jobc1ID);
                    let jobc2NodeIndex = this.findSelectedNodeIndex(this.jobcTree[jobc1NodeIndex].children, jc3.jobCategory2.id);
                    let index = this.findSelectedNodeIndex(this.jobcTree[jobc1NodeIndex].children[jobc2NodeIndex].children, jc3.id);
                    this.jobcTree[jobc1NodeIndex].children[jobc2NodeIndex].children.splice(index, 1);
                    let ix = this.findSelectedJC3Index(jc3);
                    //this.jobc3List.splice(ix, 1);
                    this.jobc3List = this.jobc3List.filter((val, i) => i != ix);
                    this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.removeJC3Msg });
                    this.selectedNodeName = '';
                    this.selectedNodeType = 'JobCategory2';
                }, error => {
                    this.showErrorMsg = true;
                    let err: BackendMessage = error.error;
                    this.parseError(error.status, err);
                });
            }
        });

    }

    updateEntity() {
        if (this.editJC1Node) {
            let _jobc1List = [...this.jobc1List];
            let jc1 = new JobCategory1();
            jc1.id = this.selectedJobCategory.id;
            jc1.name = this.selectedJobCategory.name;
            jc1.ename = this.selectedJobCategory.ename;
            jc1.icon = this.selectedNodeIcon;
            //Add Icon
            this.isLoading = true;
            this._NodeService.updateJobCategory1(jc1).subscribe(result => {
                let jc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jc1.id);
                this.jobcTree[jc1NodeIndex].data = "jobCategory1@" + jc1.id + "@0";
                this.jobcTree[jc1NodeIndex].label = jc1.name;
                _jobc1List[this.selectedJC1index] = jc1;
                this.jobc1List = _jobc1List;
                this.editEntityDialog = false;
                this.isLoading = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editJC2Node) {
            let _jobc2List = [...this.jobc2List];
            let jc2 = new JobCategory2();
            jc2.id = this.selectedJobCategory.id;
            jc2.name = this.selectedJobCategory.name;
            jc2.ename = this.selectedJobCategory.ename;
            jc2.jobCategory1.id = this.selectedJobCategory.parentID;
            jc2.icon = this.selectedNodeIcon;
            //Add Icon
            this.isLoading = true;
            this._NodeService.updateJobCategory2(jc2).subscribe(result => {
                let jc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jc2.jobCategory1.id);
                let index = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children, jc2.id);
                this.jobcTree[jc1NodeIndex].children[index].label = jc2.name;
                _jobc2List[this.selectedJC2index] = jc2;
                this.jobc2List = _jobc2List;
                this.isLoading = false;
                this.editEntityDialog = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        else if (this.editJC3Node) {
            let _jobc3List = [...this.jobc3List];
            let jc3 = new JobCategory3();
            jc3.id = this.selectedJobCategory.id;
            jc3.name = this.selectedJobCategory.name;
            jc3.ename = this.selectedJobCategory.ename;
            jc3.jobCategory2.id = this.selectedJobCategory.parentID;
            jc3.icon = this.selectedNodeIcon;
            jc3.priority = this.selectedJobCategory.priority;
            jc3.emergencyEnable = this.selectedJobCategory.emergencyEnable;
            jc3.nowToStartPeriod = this.selectedJobCategory.nowToStartPeriod;
            jc3.invoiceRequired = this.selectedJobCategory.invoiceRequired;
            jc3.destinationAddressRequired = this.selectedJobCategory.destinationAddressRequired;
            let jobc1ID = this.findJobCateogry2Parent(jc3.jobCategory2.id);
            this.isLoading = true;
            this._NodeService.updateJobCategory3(jc3).subscribe(result => {
                let jc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jobc1ID);
                let jc2NodeIndex = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children, jc3.jobCategory2.id);
                let index = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children, jc3.id);
                this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children[index].label = jc3.name;
                _jobc3List[this.selectedJC3index] = jc3;
                this.jobc3List = _jobc3List;
                this.isLoading = false;
                this.editEntityDialog = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }

    }
    onSubmitEditform() {
        try {
            if (!this.editCommForm.valid) {
                this.validateAllFormFields(this.editCommForm);
                return;
            }
            let jobc1ID = this.findJobCateogry2Parent(this.selectedJobCategoty3.jobCategory2.id);
            let _jobc3List = [...this.jobc3List];
            this.isLoading = true;
            this._NodeService.editCommission(this.selectedJobCategoty3).subscribe(result => {
                let jc1NodeIndex = this.findSelectedNodeIndex(this.jobcTree, jobc1ID);
                let jc2NodeIndex = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children, this.selectedJobCategoty3.jobCategory2.id);
                let index = this.findSelectedNodeIndex(this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children, this.selectedJobCategoty3.id);
                this.jobcTree[jc1NodeIndex].children[jc2NodeIndex].children[index].label = this.selectedJobCategoty3.name;
                this.selectedJC3index = this.findSelectedJC3Index(this.selectedJobCategoty3);
                _jobc3List[this.selectedJC3index] = this.selectedJobCategoty3;
                this.jobc3List = _jobc3List;
                this.isLoading = false;
                this.showEditCommDialog = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    onSubmitEditPriceform() {
        try {
            if (!this.editPriceForm.valid) {
                this.validateAllFormFields(this.editPriceForm);
                return;
            }
            let data = new SeoData();
            data.priceInfo = new C3Price();
            data.priceInfo.title = this.selectedJC3_Price_Name;
            data.priceInfo.description = this.selectedJC3_Price_Desc;
            data.priceInfo.items = this.selectedJC3_Price_List;
            this.isLoading = true;
            this.seoService.updatePrice(this.selectedJobCategoty3.id, data).subscribe(result => {

                this.isLoading = false;
                this.showEditPriceDialog = false;
            }, error => {
                this.showErrorMsgInPanel = true;
                let err: BackendMessage = error.error;
                this.parseError(error.status, err);
                this.isLoading = false;
            });
        }
        catch (e) {
            console.log(e);
        }
    }
    onSubmitAddPriceItem() {
        this.hmsgs = [];

        if (!this.newPriceItem_text || this.newPriceItem_text == '') {
            this.hmsgs.push({ severity: 'error', summary: '', detail: 'عنوان را وارد کنید' });
            return;
        }
        // if(this.newPriceItem_price == 0){
        //     this.hmsgs.push({ severity: 'error', summary: '', detail: ' قیمت را وارد کنید' });
        //     return;
        // }
        let item = new C3PriceItem();
        item.text = this.newPriceItem_text;
        item.price = this.newPriceItem_price;
        let list = [...this.selectedJC3_Price_List];
        if (this.selectedJC3_Price_List) {
            let existed = this.findPriceItemByText(list, this.newPriceItem_text);
            if (existed) {
                this.hmsgs.push({ severity: 'error', summary: '', detail: 'مورد مشابه وجود دارد' });
                return;
            }
            list.push(item);
        }
        else {
            list = [];
            list.push(item);
        }
        this.selectedJC3_Price_List = list;
    }
    validateAllFormFields(formGroup: FormGroup) {
        Object.keys(formGroup.controls).forEach(field => {
            const control = formGroup.get(field);
            if (control instanceof FormControl) {

                control.markAsTouched({ onlySelf: true });
                control.markAsDirty({ onlySelf: true });

            } else if (control instanceof FormGroup) {
                this.validateAllFormFields(control);
            }
        });
    }
    findJobCateogry2Parent(id: number): number {
        for (let i = 0; i < this.jobc2List.length; i++) {
            let jc2 = this.jobc2List[i];
            if (jc2.id == id)
                return jc2.jobCategory1.id;
        }
        return 0;
    }
    findSelectedJC1Index(jc1: JobCategory1): number {
        return this.jobc1List.indexOf(jc1);
    }
    findSelectedJC2Index(jc2: JobCategory2): number {
        return this.jobc2List.indexOf(jc2);
    }
    findSelectedJC3Index(jc3: JobCategory3): number {
        return this.jobc3List.indexOf(jc3);
    }
    findSelectedJC1(id: number): number {
        for (let z = 0; z < this.jobc1List.length; z++) {
            let element = this.jobc1List[z];
            if (element.id == id)
                return z;
        }
        return 0;
    }
    findSelectedJC2(id: number): number {
        for (let z = 0; z < this.jobc2List.length; z++) {
            let element = this.jobc2List[z];
            if (element.id == id)
                return z;
        }
        return 0;
    }
    findSelectedJC3(id: number): number {
        for (let z = 0; z < this.jobc3List.length; z++) {
            let element = this.jobc3List[z];
            if (element.id == id)
                return z;
        }
        return 0;
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
    onUpload(event: any) {
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        this.selectedNodeIcon = responseMsg.msg[0].msg;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }

        this.hmsgs = [];
        this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.uploadSuccessMsg });
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
    onEditInit(event) {
        this.toBeEditedPriceItem = <C3PriceItem>event.data;
        this.savedEvent = event;
    }
    onEditInitACity(event) {
        this.toBeEditedACItyItem = <Cat3ToCityMap>event.data;
        this.savedEvent = event;
    }
    onEditCancel(event) {
        let pr = <C3PriceItem>event.data;
        let beforeEditPr: C3PriceItem = this.findPriceItemByText(this.selectedJC3_Price_List, pr.text);
        let index = this.searchPriceItemsIndex(pr);
        if (index != -1) {
            this.selectedJC3_Price_List[index].text = beforeEditPr.text;
            this.selectedJC3_Price_List[index].price = beforeEditPr.price;
        }

    }
    onEditCancelACity(event) {
        let pr = <Cat3ToCityMap>event.data;
        let beforeEditPr: Cat3ToCityMap = this.findActiveCityItemByID(this.selectedJC3_ActiveCity_List, pr.id);
        let index = this.searchActiveCityItemsIndex(pr);
        if (index != -1) {
            this.selectedJC3_ActiveCity_List[index].comissionOffset = beforeEditPr.comissionOffset;
        }

    }
    onEditComplete(event) {
        this.hmsgs = [];
        let field = event.field;
        let textEdited = false;
        let priceEdited = false;
        let priceItem = <C3PriceItem>event.data;
        let editedPriceItem: C3PriceItem = this.findPriceItemByText(this.priceItemsClone, priceItem.text);
        if (field == 'text' && editedPriceItem.text !== priceItem.text)
            textEdited = true;
        if (field == 'price' && editedPriceItem.price !== priceItem.price)
            priceEdited = true;

        if (!textEdited && !priceEdited) {
            this.hmsgs.push({ severity: 'warning', summary: '', detail: this.shared.noChangeMsg });
            return;
        }
        if (textEdited && (!priceItem.text || priceItem.text == '')) {
            this.hmsgs.push({ severity: 'error', summary: '', detail: 'عنوان را وارد کنید' });
            return;
        }
        // if(priceEdited && priceItem.price == 0){
        //     this.hmsgs.push({ severity: 'error', summary: '', detail: 'قیمت نمی تواند صفر باشد' });
        //     return;
        // }
        let editItem: C3PriceItem = new C3PriceItem();
        editItem.text = priceItem.text;
        editItem.price = priceItem.price;

        let index = this.searchPriceItemsIndex(editItem);
        if (index != -1) {
            this.selectedJC3_Price_List[index].text = editItem.text;
            this.selectedJC3_Price_List[index].price = editItem.price;
        }
    }
    onEditCompleteACity(event) {
        this.hmsgs = [];
        let field = event.field;
        let cOffsetEdited = false;
        let activeCityItem = <Cat3ToCityMap>event.data;
        let editedCityItem: Cat3ToCityMap = this.findActiveCityItemByID(this.activeCityItemsClone, activeCityItem.id);
        if (field == 'comissionOffset' && activeCityItem.comissionOffset !== editedCityItem.comissionOffset)
            cOffsetEdited = true;


        if (!cOffsetEdited) {
            this.hmsgs.push({ severity: 'warning', summary: '', detail: this.shared.noChangeMsg });
            return;
        }

        if (cOffsetEdited && (activeCityItem.comissionOffset < -10 || activeCityItem.comissionOffset > 10)) {
            this.hmsgs.push({ severity: 'error', summary: '', detail: 'آفست در یازه معتبر نیست' });
            return;
        }
        let editItem: Cat3ToCityMap = new Cat3ToCityMap();
        editItem.id = activeCityItem.id;
        editItem.city = new City();
        editItem.city.id = activeCityItem.city.id;
        editItem.city.name = activeCityItem.city.name;
        editItem.comissionOffset = activeCityItem.comissionOffset;

        let index = this.searchActiveCityItemsIndex(editItem);
        if (index != -1) {
            this.selectedJC3_ActiveCity_List[index].comissionOffset = editItem.comissionOffset;
            this.selectedJC3_ActiveCity_List[index].id = editItem.id;
            this.selectedJC3_ActiveCity_List[index].city.id = editItem.city.id;
            this.selectedJC3_ActiveCity_List[index].city.name = editItem.city.name;
        }
        let jc3 = new JobCategory3();
        jc3.id = this.selectedJobCategoty3.id;
        jc3.activeCities = [];
        jc3.activeCities.push(this.selectedJC3_ActiveCity_List[index]);

        this.inLoading = true;
        this._NodeService.editActiveCity(jc3).subscribe(response => {
            this.inLoading = false;
            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        }, error => {
            this.inLoading = false;
            if (index != -1) {
                this.selectedJC3_ActiveCity_List[index].comissionOffset = this.toBeEditedACItyItem.comissionOffset;
                this.selectedJC3_ActiveCity_List[index].id = this.toBeEditedACItyItem.id;
                this.selectedJC3_ActiveCity_List[index].city.id = this.toBeEditedACItyItem.city.id;
                this.selectedJC3_ActiveCity_List[index].city.name = this.toBeEditedACItyItem.city.name;
            }
            this.errorCntrler.gMessage = [];
            let err: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, error.error.error);
            let errorMessages = this.errorCntrler.gMessage;
            this.hmsgs = [];
            errorMessages.forEach(element => {
                this.hmsgs.push(element);
            });
        });




    }
    findPriceItemByText(list: C3PriceItem[], text: string): C3PriceItem {
        let out: C3PriceItem = null;

        try {
            list.forEach(element => {
                let pr: C3PriceItem = <C3PriceItem>element;
                if (pr.text == text) {
                    out = pr;
                }
            });
            return out;
        }
        catch (e) {
            return null;
        }
    }
    findActiveCityItemByID(list: Cat3ToCityMap[], id: number): Cat3ToCityMap {
        let out: Cat3ToCityMap = null;

        try {
            list.forEach(element => {
                let pr: Cat3ToCityMap = <Cat3ToCityMap>element;
                if (pr.id == id) {
                    out = pr;
                }
            });
            return out;
        }
        catch (e) {
            return null;
        }
    }
    searchPriceItemsIndex(item: C3PriceItem): number {
        try {
            for (let i = 0; i < this.selectedJC3_Price_List.length; i++) {
                let element = this.selectedJC3_Price_List[i];
                if (element.text == item.text) {
                    return i;
                }
            }
            return -1;
        }
        catch (e) {
            return -1;
        }
    }
    searchActiveCityItemsIndex(item: Cat3ToCityMap): number {
        try {
            for (let i = 0; i < this.selectedJC3_ActiveCity_List.length; i++) {
                let element = this.selectedJC3_ActiveCity_List[i];
                if (element.id == item.id) {
                    return i;
                }
            }
            return -1;
        }
        catch (e) {
            return -1;
        }
    }
    onSubmitNewActiveCity() {
        try {
            //onSubmitNewActiveCity
            this.hmsgs = [];
            if (!this.newActiveCity || this.newActiveCity.id == -1) {
                this.hmsgs.push({ severity: 'error', summary: '', detail: 'شهر را وارد کنید' });
                return;
            }
            if (this.newCommisionOffset < -10 || this.newCommisionOffset > 10){
                this.hmsgs.push({ severity: 'error', summary: '', detail: 'آفست باید بین 10 و -10 باشد' });
                return;
            } 
            let newItem: Cat3ToCityMap = new Cat3ToCityMap();
            newItem.city = new City();
            newItem.city.id = this.newActiveCity.id;
            newItem.city.name = this.newActiveCity.name;
            newItem.comissionOffset = this.newCommisionOffset;

            let jc3 = new JobCategory3();
            jc3.id = this.selectedJobCategoty3.id;
            jc3.activeCities = [];
            jc3.activeCities.push(newItem);
            console.log(jc3);
            this.inLoading = true;
            let list = [...this.selectedJC3_ActiveCity_List];
            this._NodeService.addActiveCity(jc3).subscribe(response => {
                list.push(newItem);
                this.selectedJC3_ActiveCity_List = list;
                this.inLoading = false;

            }, error => {
                this.inLoading = false;
                this.errorCntrler.gMessage = [];
                let err: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, error.error.error);
                let errorMessages = this.errorCntrler.gMessage;
                this.hmsgs = [];
                errorMessages.forEach(element => {
                    this.hmsgs.push(element);
                });
            });
        }
        catch (e) {
            console.log(e);
        }
    }
}