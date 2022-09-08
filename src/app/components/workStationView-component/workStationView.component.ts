import { WorkerStationDocument } from './../../entities/workerStationDocument.class';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core'
import { WorkStation } from '../../entities/workStation.class'
import { WorkStationPhone } from '../../entities/workStationPhone.class'
import { JobCategory1 } from '../../entities/JobCategory1.class'
import { WorkTypeEnum } from '../../enums/workType.enum'
import { WorkStationJob } from '../../entities/workStationJob.class'
import { SharedValues } from '../../services/shared-values.service'
import { environment } from '../../../environments/environment';

@Component({
    moduleId: module.id,
    selector: 'workStationViewComponent',
    templateUrl: './workStationView.template.html',
    styleUrls: ['../../../assets/css/dashboard.css','workStationView.component.css']
})
export class WorkStationView implements OnInit {
    @Input() workStation: WorkStation = null;
    @Input() loading = false;
    @Output() onDisplayCatalogImageDialog = new EventEmitter<any>();
    @Output() onDisplayDocumentImageDialog = new EventEmitter<any>();
    selectedDocumentImage:WorkerStationDocument;
    workStationJobs: WorkStationJob[] = []
    workStationPhoneList: WorkStationPhone[] = [];
    workStationDocuments: WorkerStationDocument[] = [];
    selectedWorkStationCatalogImgs: any[];
    zoom: number;
    selectedImageCatalog: string;
    displayCatalogImageDialog: boolean = false;
    showWorkStationList: boolean = false;
    displayMgmPanel: boolean = false;
    showStorePanel = false;
    showCompanyPanel = false;
    selectedJobCategory1: JobCategory1 = null;
    displayMap: boolean = false;
    baseImagePath: string;
    constructor(
        public shared: SharedValues
    ) {
        this.baseImagePath = environment.fileServerUrl;
        
    }
    ngOnInit() {
     
    }
    ngOnChanges() {
        this.do();
    }
    ngAfterViewInit() {
    }
    do() {
        try {
            if (this.workStation != null) {
                this.workStationJobs = this.workStation.workStationJobs;
                this.showWorkStationList = true;
                this.zoom = 14;
                this.displayMgmPanel = false;
                if (this.workStation.workType != undefined) {
                    if (this.workStation.workType.id == WorkTypeEnum.company) {
                        this.showStorePanel = false;
                        this.showCompanyPanel = true;
                    }
                    else if (this.workStation.workType.id == WorkTypeEnum.store) {
                        this.showStorePanel = true;
                        this.showCompanyPanel = false;

                    }
                }
                this.workStationPhoneList = this.workStation.workStationPhones;
                this.selectedWorkStationCatalogImgs = [];
                if (this.workStation.workStationCatalogs != undefined) {
                    this.workStation.workStationCatalogs.forEach(element => {
                        let imgPath = this.baseImagePath + "/" + element.photo;                        
                        this.selectedWorkStationCatalogImgs.push({ source: imgPath, thumbnail: imgPath, title: element.info });
                    });
                }
                
                this.workStation.workStationDocuments.forEach(element=>{
                    element.photo = this.baseImagePath+"/"+element.photo;
                    this.workStationDocuments.push(element);
                });
                 
            }
            console.log(this.workStation);
        }
        catch (e) {
            console.log(e);
        }
    }
    selectCatalogImage(catalogImage: any) {
        this.selectedImageCatalog = catalogImage;
        this.onDisplayCatalogImageDialog.emit(this.selectedImageCatalog);      
        this.displayCatalogImageDialog = true;
    }
    selectDocumentImage(img:any){
        this.selectedDocumentImage = img;
        this.onDisplayDocumentImageDialog.emit(this.selectedDocumentImage);      
    }
    showMap() {
        this.displayMap = true;
    }
}
