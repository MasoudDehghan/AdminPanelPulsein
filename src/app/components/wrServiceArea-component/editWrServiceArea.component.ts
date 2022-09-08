import { City } from './../../entities/city.class';
import { WorkerToServiceCityMap } from './../../entities/workerToServiceCityMap.class';
import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { BackendMessage } from '../../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Worker } from '../../entities/worker.class'
import { ConfirmDialogModule, ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'


@Component({
    moduleId: module.id,
    selector: 'editWorkerServiceAreaComponent',
    templateUrl: './editWrServiceArea.template.html',
    styleUrls: ['../../../assets/css/dashboard.css', 'editWrServiceArea.css'],
    providers: [WorkerMgmService]
})

export class EditWorkerServiceAreaComponent implements OnInit {
    @Input() inputWorkerID: number;
    @Input() cityList: SelectItem[] = [];
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();

    inputWorker: Worker;
    selectedWorker: Worker = new Worker();
    selectedCities: City[] = [];
    loading: boolean = false;
    errorCntrler: HandleErrorMsg;

    selectedWorkerToServiceCityMap: WorkerToServiceCityMap;
    workerToServiceCityMaps: WorkerToServiceCityMap[] = [];
    msgs: GrowlMessage[] = [];
    form: FormGroup;


    constructor(private _router: Router,
        private _fb: FormBuilder,
        private _workerService: WorkerMgmService,
        private confirmationService: ConfirmationService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {

        this.errorCntrler = new HandleErrorMsg(this._router);
        this.form = this._fb.group({
            city: ['']
        });

        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

                this.init();
                this.cityList = this.cityList.filter((val, i) => i != 0);
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
        try {
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.selectedWorker.workerToServiceCityMaps = this.inputWorker.workerToServiceCityMaps;

            this.workerToServiceCityMaps = this.inputWorker.workerToServiceCityMaps;
            console.log(this.workerToServiceCityMaps);
            this.loading = false;
        }
        catch (e) {
            console.log(e);
        }
    }

    addArea() {
        try {
            let errorFlag = false;
            let _workerToServiceCityMaps = [...this.workerToServiceCityMaps];
            let wsm: WorkerToServiceCityMap[] = [];
            this.selectedCities.forEach(element => {
                let x: WorkerToServiceCityMap = new WorkerToServiceCityMap();
                x.id = element.id;
                x.city = new City();
                x.city.id = element.id;
                x.city.name = element.name;
                if (this.searchServiceCityInList(x)) {
                    this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.repeatedRegionMsg });
                    errorFlag = true;
                    throw new Error(this.shared.repeatedRegionMsg);
                }
                wsm.push(x);
            });
            if (!errorFlag) {
                let worker: Worker = new Worker();
                worker.id = this.selectedWorker.id;
                worker.workerToServiceCityMaps = [];
                worker.workerToServiceCityMaps = wsm;

                this._workerService.addServiceArea(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        this.selectedCities.forEach(element => {
                            let x: WorkerToServiceCityMap = new WorkerToServiceCityMap();
                            x.city = new City();
                            x.city.id = element.id;
                            x.city.name = element.name;
                            _workerToServiceCityMaps.push(x);
                        });
                        this.workerToServiceCityMaps = _workerToServiceCityMaps;
                        this.onSave.emit(<Worker>response);
                    },
                        error => {
                            //this.loading = false;
                            this.errorCntrler.gMessage = [];
                            let err: BackendMessage = this.errorCntrler.handleError(error);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.msgs = [];
                            errorMessages.forEach(element => {
                                this.msgs.push(element);
                            });
                        });
            }
        }
        catch (e) {
            console.log(e.status);
        }
    }

    removeServiceArea(wm: WorkerToServiceCityMap) {
        let worker: Worker = new Worker();
        worker.id = this.selectedWorker.id;
        worker.workerToServiceCityMaps = [];
        worker.workerToServiceCityMaps.push(wm);

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                // this.loading = true;                
                this._workerService.deleteServiceArea(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let selectedServiceCityMap = this.workerToServiceCityMaps.find(x => x == wm);
                        let index = this.workerToServiceCityMaps.indexOf(selectedServiceCityMap, 0);
                        this.workerToServiceCityMaps = this.workerToServiceCityMaps.filter((val, i) => i != index);
                        this.onSave.emit(<Worker>response);

                    },
                        error => {
                            //this.loading = false;
                            this.errorCntrler.gMessage = [];
                            let err: BackendMessage = this.errorCntrler.handleError(error);
                            let errorMessages = this.errorCntrler.gMessage;
                            this.msgs = [];
                            errorMessages.forEach(element => {
                                this.msgs.push(element);
                            });
                        });
            }
        });

    }



    onSubmit() {
        try {
            this.addArea();
        }
        catch (e) {
            console.log(e);
        }
    }
    closePanel() {
        this.onClose.emit(false);

    }

    searchServiceCityInList(wm: WorkerToServiceCityMap): boolean {
        let out = false;
        try {
            this.workerToServiceCityMaps.forEach(element => {
                if (Number(element.city.id) == Number(wm.city.id)) {
                    out = true;
                }
            });
            return out;
        }
        catch (e) {
            return false;
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