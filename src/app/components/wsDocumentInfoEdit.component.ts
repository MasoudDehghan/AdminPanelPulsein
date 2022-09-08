import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ConfirmationService, SelectItem } from 'primeng/primeng';
import { DocumentType } from '../entities/DocumentType.class';
import { GrowlMessage } from '../entities/growlMessage.class';
import { BackendMessage } from '../entities/Msg.class';
import { WorkerStationDocument } from '../entities/workerStationDocument.class';
import { WorkStation } from '../entities/workStation.class';
import { SharedValues } from '../services/shared-values.service';
import { WorkerStationMgmService } from '../services/workerStationMgm.service';
import { HandleErrorMsg } from '../shared/handleError.class';
import { environment } from './../../environments/environment';




@Component({
    moduleId: module.id,
    selector: 'wsDocumentInfoComponent',
    templateUrl: './wsDocumentInfoEdit.template.html',
    styleUrls: ['../../assets/css/dashboard.css'],
    providers:[WorkerStationMgmService]
})

export class WorkStationDocumentInfoEdit implements OnInit {
    form: FormGroup;
    @Input() inputWorkStation: WorkStation;
    @Input() documentTypeList: SelectItem[] = [];
    @Input() loading: boolean = false;
    selectedWorkStation: WorkStation = new WorkStation();
    @Input() editMode: boolean = false;
    @Output() onClose = new EventEmitter<boolean>();
    @Output() onSave = new EventEmitter<WorkStation>();
    @Output() onShowImage = new EventEmitter<string>();


    workStation: WorkStation = new WorkStation();
    workStationDocuments: WorkerStationDocument[] = [];
    workStationDocumentsClone: WorkerStationDocument[] = [];
    selectedDocumentInfo: string;
    selectedDocumentType: DocumentType;
    errorCntrler: HandleErrorMsg;
    uploadedFiles: any[] = [];
    baseImagePath = environment.fileServerUrl;
    uploadURL: string;
    uploadedImageName: string;
    msgs: GrowlMessage[] = [];
    toBeEditedDocument:WorkerStationDocument;
    inLoading:boolean = false;
    constructor(private _router: Router, private _fb: FormBuilder, private confirmationService: ConfirmationService,
        private cdRef: ChangeDetectorRef, private _dService: WorkerStationMgmService,
        public shared: SharedValues) {

    }
    ngOnInit() {
        let token: String = sessionStorage.getItem('token');
        this.uploadURL = environment.apiUrl+"/upload/img/" + token;
        this.errorCntrler = new HandleErrorMsg(this._router);
        this.form = this._fb.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(2)])],
            type: ['']
        });

    }
    ngOnChanges() {
        this.init();
    }
    ngAfterViewInit() {
        this.cdRef.detectChanges();

    }
    init() {
        try {
            this.selectedWorkStation = new WorkStation();
            this.selectedWorkStation.id = this.inputWorkStation.id;
            this.selectedWorkStation.workStationDocuments = this.inputWorkStation.workStationDocuments;
            this.workStationDocuments = this.selectedWorkStation.workStationDocuments;
            this.workStationDocumentsClone = this.cloneDocuments(this.workStationDocuments);            

            this.loading = false;
                }

        catch (e) {
            console.log(e);
        }
    }
    onEditComplete(event) {
        let field = event.field;
        let infoEdited = false;
        let dtEdited = false;
        let doc = <WorkerStationDocument>event.data;

        let editedDoc:WorkerStationDocument = this.findDocumentByID(this.workStationDocumentsClone,doc.id);
        if(field == 'info' && editedDoc.info !== doc.info)
            infoEdited = true;
        if(field == 'documentType' && editedDoc.documentType.id !== doc.documentType.id)
            dtEdited = true;
            
        if(!infoEdited && !dtEdited){
            this.msgs.push({ severity: 'warning', summary: '', detail: this.shared.noChangeMsg });
            return;
        }

        let editDoc: WorkerStationDocument = new WorkerStationDocument();
        editDoc.id = doc.id;
        editDoc.info = doc.info;
        editDoc.documentType = doc.documentType;
        this.editDocument(editDoc,editedDoc);

    }
    findDocumentByID(docs: WorkerStationDocument[], id: number): WorkerStationDocument {
        let out: WorkerStationDocument = null;

        try {
            docs.forEach(element => {
                let doc: WorkerStationDocument = <WorkerStationDocument>element;
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
    searchDocumentIndex(wd: WorkerStationDocument): number {
        let out = false;
        try {
            for(let i=0;i<this.workStationDocuments.length;i++){
                let element = this.workStationDocuments[i];
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
    editDocument(editDoc: WorkerStationDocument,beforeEditDoc:WorkerStationDocument) {
        this.inLoading = true;
        this.msgs = [];
        let index = this.searchDocumentIndex(editDoc);
        this._dService.editDocument(editDoc).subscribe(response => {
            this.inLoading = false;
            this.msgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
        }, error => {
            this.inLoading = false;
            if(index != -1){
                this.workStationDocuments[index].info = beforeEditDoc.info;
                this.workStationDocuments[index].documentType = beforeEditDoc.documentType;
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

    cloneDocuments(arr: WorkerStationDocument[]): WorkerStationDocument[] {
        const result: WorkerStationDocument[] = [];
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
            const doc = new WorkerStationDocument();
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
    onEditInit(event){
        this.toBeEditedDocument = <WorkerStationDocument>event.data;
    }
    onEditCancel(event){
        let doc = <WorkerStationDocument>event.data;
        let beforeEditDoc:WorkerStationDocument = this.findDocumentByID(this.workStationDocumentsClone,doc.id);
        let index = this.searchDocumentIndex(doc);
        if(index != -1){
            this.workStationDocuments[index].info = beforeEditDoc.info;
            this.workStationDocuments[index].documentType = beforeEditDoc.documentType;
        }

    }
    
    addDocument() {
        try {
            if (this.uploadedImageName == "") {
                this.msgs.push({ severity: 'warn', summary: '', detail: this.shared.noImageForDoc });
                throw new Error(this.shared.noImageForDoc);
            }


            let wd: WorkerStationDocument = new WorkerStationDocument();
            wd.info = this.selectedDocumentInfo;
            wd.documentType = this.selectedDocumentType;
            wd.photo = this.uploadedImageName;

            let workstation: WorkStation = new WorkStation();
            workstation.id = this.selectedWorkStation.id;
            workstation.workStationDocuments = [];
            workstation.workStationDocuments.push(wd);
            this.loading = true;
            this._dService.addDocument(workstation)
                .subscribe(response => {
                    let ws: WorkStation = <WorkStation>response;
                    this.loading = false;
                    let _workStationDocuments = [...this.workStationDocuments];
                    _workStationDocuments = ws.workStationDocuments
                    this.workStationDocuments = _workStationDocuments;
                    this.workStationDocumentsClone = this.cloneDocuments(this.workStationDocuments);

                    this.uploadedFiles = [];
                    this.onSave.emit(ws);
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

    removeDocument(wd: WorkerStationDocument) {
        let workStation: WorkStation = new WorkStation();
        workStation.id = this.selectedWorkStation.id;
        workStation.workStationDocuments = [];
        workStation.workStationDocuments.push(wd);
        console.log(workStation);
        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                // this.loading = true;                
                this._dService.deleteDocument(workStation)
                    .subscribe(response => {
                        //this.loading = false;
                        let selectedWorkStationDocument = this.workStationDocuments.find(x => x == wd);
                        let index = this.workStationDocuments.indexOf(selectedWorkStationDocument, 0);
                        this.workStationDocuments = this.workStationDocuments.filter((val, i) => i != index);
                        this.workStationDocumentsClone = this.cloneDocuments(this.workStationDocuments);

                        this.onSave.emit(<WorkStation>response);
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
            this.addDocument();
        }
        catch (e) {
            console.log(e);
        }

    }
 
    onUpload(event: any) {
        let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
        this.uploadedImageName = responseMsg.msg[0].msg;
        for (let file of event.files) {
            this.uploadedFiles.push(file);
        }
    }
    selectImage(document: WorkerStationDocument) {
        let selectedImagePath = this.baseImagePath + "/" + document.photo;
        this.onShowImage.emit(selectedImagePath)
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