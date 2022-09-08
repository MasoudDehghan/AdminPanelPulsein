import { WorkerToServiceCityMap } from './../../entities/workerToServiceCityMap.class';
import { environment } from './../../../environments/environment';
import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { Worker } from '../../entities/worker.class'
import { WorkerStationCatalog } from '../../entities/workerStationCatalog.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerToJobsMap } from '../../entities/workerToJobsMap.class'
import { WorkerPhone } from '../../entities/workerPhone.class'
import { WorkerDocument } from '../../entities/workerDocument.class'
import { BackendMessage } from '../../entities/Msg.class';
import { WorkerMgmService } from '../../services/workerMgm.service'
import { HandleErrorMsg } from '../../shared/handleError.class';
import { Router } from '@angular/router';
import { GrowlMessage } from '../../entities/growlMessage.class';

@Component({
    moduleId: module.id,
    selector: 'workerViewComponent',
    templateUrl: './workerView.template.html',
    providers:[WorkerMgmService],
    styleUrls: ['../../../assets/css/dashboard.css']
})
export class WorkerView implements OnInit {
    @Input() workerID: number;
    @Output() onShowImage = new EventEmitter<string>();
    worker: Worker = null;
    workerToJobMapList: WorkerToJobsMap[] = [];
    workerPhoneList: WorkerPhone[] = [];
    workerToServiceCityMaps: WorkerToServiceCityMap[] = [];
    workerDocuments: WorkerDocument[] = [];
    selectedWorkweCatalogImgs: any[];
    zoom: number;
    loading: boolean;
    selectedImageCatalog: WorkerStationCatalog;
    displayCatalogImageDialog: boolean = false;
    baseImagePath = environment.fileServerUrl;
    errorCntrler: HandleErrorMsg;
    msgs: GrowlMessage[] = [];

    constructor(
        private _router: Router,
        public shared: SharedValues,
        private _workerService: WorkerMgmService
    ) {

    }
    ngOnInit() {
        this.errorCntrler = new HandleErrorMsg(this._router);

        this.loading = true;
        this._workerService.lookupById(this.workerID)
            .subscribe(response => {
                this.loading = false;

                this.worker = <Worker>response;

                this.init();

            }
                , error => {
                    this.loading = false;
                    let obj: Worker = error.error;
                    let err: BackendMessage = obj.error;
                    this.parseError(error.status, err);
                }
            );
    }

    init() {
        this.workerToJobMapList = this.worker.workerToJobsMaps;
        this.workerPhoneList = this.worker.workerPhones;
        this.workerToServiceCityMaps = this.worker.workerToServiceCityMaps;
        this.worker.workerDocuments.forEach(doc => {
            doc.photo = this.baseImagePath + "/" + doc.photo;
            this.workerDocuments.push(doc);
        });
    }
    selectImage(document: WorkerDocument) {
        this.onShowImage.emit(document.photo)
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
