import { environment } from './../../../environments/environment';
import { Component, Input, Output, OnInit, EventEmitter, ViewChild } from '@angular/core'
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { BackendMessage } from '../../entities/Msg.class'
import { SelectItem } from 'primeng/primeng';
import { Router } from '@angular/router';
import { Worker } from '../../entities/worker.class'
import { WorkerDocument } from '../../entities/workerDocument.class'
import { DocumentType } from '../../entities/DocumentType.class'
import { ConfirmationService } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class'
import { SharedValues } from '../../services/shared-values.service'
import { WorkerMgmService } from '../../services/workerMgm.service'
import { Table } from 'primeng/table';



@Component({
    moduleId: module.id,
    selector: 'editWorkerDocumentComponent',
    templateUrl: './editWrDocument.template.html',
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class EditWorkerDocumentComponent implements OnInit {
    @Input() inputWorkerID: number;
    @Input() documentTypeList: SelectItem[] = [];
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<Worker>();
    @Output() onShowImage = new EventEmitter<string>();
    @ViewChild('table') myTable: Table;

    inputWorker: Worker;
    selectedWorker: Worker = new Worker();

    loading: boolean = false;
    inLoading: boolean = false;
    errorCntrler: HandleErrorMsg;
    editedDocumentInfo:string;
    selectedDocuments: WorkerDocument;
    selectedDocumentInfo: string;
    selectedDocumentType: DocumentType;
    workerDocuments: WorkerDocument[] = [];
    workerDocumentsClone: WorkerDocument[] = [];
    toBeEditedWorkerDocument:WorkerDocument;
    savedEvent:any;
    msgs: GrowlMessage[] = [];
    form: FormGroup;

    uploadedFiles: any[] = [];
    baseImagePath = environment.fileServerUrl;
    uploadURL: string;
    uploadedImageName: string = "";
    constructor(private _router: Router,
        private _fb: FormBuilder, 
        private _workerService: WorkerMgmService,
        private confirmationService: ConfirmationService,
        public shared: SharedValues
    ) {

    }
    ngOnInit() {


        let token: String = sessionStorage.getItem('token');
        this.uploadURL = environment.apiUrl+"/upload/img/" + token;
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.uploadedFiles = [];
        this.form = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            type: ['']
        });

        this.refreshWorkerData();

    }
    refreshWorkerData(){
        this.loading = true;
        this._workerService.lookupById(this.inputWorkerID)
            .subscribe(response => {
                this.loading = false;

                this.inputWorker = <Worker>response;

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
        try {
            this.uploadedImageName = "";
            this.uploadedFiles = [];
            this.selectedWorker = new Worker();
            this.selectedWorker.id = this.inputWorker.id;
            this.selectedWorker.workerDocuments = this.inputWorker.workerDocuments;
            this.workerDocuments = this.selectedWorker.workerDocuments;
            this.workerDocumentsClone = this.cloneWorkerDocuments(this.workerDocuments);            
            this.loading = false;
        }
        catch (e) {
            console.log(e);
        }
    }

    addDocument() {
        try {
            if (this.uploadedImageName == "") {
                this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.noImageForDoc });
                throw new Error(this.shared.noImageForDoc);
            }


            let wd: WorkerDocument = new WorkerDocument();
            wd.info = this.selectedDocumentInfo;
            wd.documentType = this.selectedDocumentType;
            wd.photo = this.uploadedImageName;

            let worker: Worker = new Worker();
            worker.id = this.selectedWorker.id;
            worker.workerDocuments = [];
            worker.workerDocuments.push(wd);
            this.loading = true;
            this._workerService.addDocument(worker)
                .subscribe(response => {
                    let wr: Worker = <Worker>response;
                    this.loading = false;
                    let _workerDocuments = [...this.workerDocuments];
                    let i = wr.workerDocuments.length - 1;
                    wd.id = wr.workerDocuments[i].id;
                    wd.photo = wr.workerDocuments[i].photo;
                    _workerDocuments.push(wd);
                    this.workerDocuments = _workerDocuments;
                    this.workerDocumentsClone = this.cloneWorkerDocuments(this.workerDocuments);      
                    this.uploadedFiles = [];      
                    this.onSave.emit(<Worker>response);
                },
                    error => {
                        this.loading = false;
                        this.errorCntrler.gMessage = [];
                        let err: BackendMessage = this.errorCntrler.handleError(error);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.msgs = [];
                        errorMessages.forEach(element => {
                            this.msgs.push(element);
                        });
                    });

        }
        catch (e) {
            console.log(e.status);
        }
    }

    removeDocument(wd: WorkerDocument) {
        let worker: Worker = new Worker();
        worker.id = this.selectedWorker.id;
        worker.workerDocuments = [];
        worker.workerDocuments.push(wd);
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                // this.loading = true;                
                this._workerService.deleteDocument(worker)
                    .subscribe(response => {
                        //this.loading = false;
                        let selectedWorkerDocument = this.workerDocuments.find(x => x == wd);
                        let index = this.workerDocuments.indexOf(selectedWorkerDocument, 0);
                        this.workerDocuments = this.workerDocuments.filter((val, i) => i != index);
                        this.workerDocumentsClone = this.cloneWorkerDocuments(this.workerDocuments);
                        this.onSave.emit(<Worker>response);
                    },
                        error => {
                            //this.loading = false;
                            console.log(error);
                            let obj: Worker = error.error;
                            let err: BackendMessage = obj.error;
                            this.parseError(error.status, err);
                        });
            }
        });

    }



    onSubmit() {
        try {
            this.addDocument();


        }
        catch (e) {
            console.log(e);
        }
    }
    closePanel() {
        this.onClose.emit(false);

    }
    onUpload(event: any) {
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    searchWorkerDocumentInList(wd: WorkerDocument): boolean {
        let out = false;
        try {
            this.workerDocuments.forEach(element => {
                if (Number(element.id) == Number(wd.id)) {
                    out = true;
                }
            });
            return out;
        }
        catch (e) {
            return false;
        }
    }
    searchWorkerDocumentIndex(wd: WorkerDocument): number {
        let out = false;
        try {
            for(let i=0;i<this.workerDocuments.length;i++){
                let element = this.workerDocuments[i];
                if (Number(element.id) == Number(wd.id)) {
                    return i;
                }
            }

            return -1;
        }
        catch (e) {
            return -1;
        }
    }
    findWorkerDocumentInListByID(id: number): WorkerDocument {
        let out = false;
        try {
            this.workerDocuments.forEach(element => {
                if (Number(element.id) == Number(id)) {
                    return element;
                }
            });
            return null;
        }
        catch (e) {
            return null;
        }
    }
    findWorkerDocumentByID(docs: WorkerDocument[], id: number): WorkerDocument {
        let out: WorkerDocument = null;

        try {
            docs.forEach(element => {
                let doc: WorkerDocument = <WorkerDocument>element;
                if (Number(doc.id) == Number(id)) {
                    out = doc;
                }
            });
            return out;
        }
        catch (e) {
            return null;
        }
    }
    selectImage(document: WorkerDocument) {
        let selectedImagePath = this.baseImagePath + "/" + document.photo;
        this.onShowImage.emit(selectedImagePath)
    }

    onEditComplete(event) {
        let field = event.field;
        let infoEdited = false;
        let dtEdited = false;
        let doc = <WorkerDocument>event.data;

        let editedDoc:WorkerDocument = this.findWorkerDocumentByID(this.workerDocumentsClone,doc.id);
        if(field == 'info' && editedDoc.info !== doc.info)
            infoEdited = true;
        if(field == 'documentType' && editedDoc.documentType.id !== doc.documentType.id)
            dtEdited = true;
            
        if(!infoEdited && !dtEdited){
            this.msgs.push({ severity: 'warning', summary: '', detail: this.shared.noChangeMsg });
            return;
        }

        let editDoc: WorkerDocument = new WorkerDocument();
        editDoc.id = doc.id;
        editDoc.info = doc.info;
        editDoc.documentType = doc.documentType;
        this.editWorkerDocument(editDoc,editedDoc);

    }
    // onBlurInput(evt){
    //     //console.log(this.savedEvent);
    //     this.onEditComplete(this.savedEvent);
    // }
    // onBlurType(event){
    //     this.onEditComplete(this.savedEvent);
    // }
    onEditInit(event){
        this.toBeEditedWorkerDocument = <WorkerDocument>event.data;
        this.savedEvent = event;
    }
    onEditCancel(event){
        let doc = <WorkerDocument>event.data;
        let beforeEditDoc:WorkerDocument = this.findWorkerDocumentByID(this.workerDocumentsClone,doc.id);
        let index = this.searchWorkerDocumentIndex(doc);
        if(index != -1){
            this.workerDocuments[index].info = beforeEditDoc.info;
            this.workerDocuments[index].documentType = beforeEditDoc.documentType;
        }

    }
    

    editWorkerDocument(editDoc: WorkerDocument,beforeEditDoc:WorkerDocument) {
        this.inLoading = true;
        this.msgs = [];
        let index = this.searchWorkerDocumentIndex(editDoc);
        this._workerService.editDocument(editDoc).subscribe(response => {
            this.inLoading = false;
            this.msgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        }, error => {
            this.inLoading = false;
            if(index != -1){
                this.workerDocuments[index].info = beforeEditDoc.info;
                this.workerDocuments[index].documentType = beforeEditDoc.documentType;
            }
            this.errorCntrler.gMessage = [];
            let err: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, error.error.error);
            let errorMessages = this.errorCntrler.gMessage;
            this.msgs = [];
            errorMessages.forEach(element => {
                this.msgs.push(element);
            });
        });
    }

    cloneWorkerDocuments(arr: WorkerDocument[]): WorkerDocument[] {
        const result: WorkerDocument[] = [];
        if (!arr) 
          return result;
        if(arr == undefined)
            return result;          
        if(arr == null)
            return result;          
        if(arr.length == 0)
            return result;
        const arrayLength = arr.length;
        for (let i = 0; i <= arrayLength; i++) {
          const item = arr[i];
          if (item) {
            const doc = new WorkerDocument();
            doc.id = item.id;
            doc.info = item.info;
            doc.documentType = new DocumentType();
            doc.documentType.id = item.documentType.id;
            doc.documentType.name = item.documentType.name;

            result.push(doc);
          }
        }
        return result;
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