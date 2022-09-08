import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { DocumentTypeService } from '../../services/docTypes.service'
import { SharedValues } from '../../services/shared-values.service'
import { ConfirmationService } from 'primeng/primeng';
import { FormGroup, FormBuilder, Validators } from '@angular/forms'
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { DocumentType } from '../../entities/DocumentType.class'

@Component({
    moduleId: module.id,
    selector: 'docTypesComponent',
    templateUrl: './docTypes.template.html',
    providers: [DocumentTypeService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class DocumentTypeMgmComponent implements OnInit {
    docTypes: DocumentType[] = [];
    documentType: DocumentType = new DocumentType();
    selectedDocumentType: DocumentType;
    newDocumentType: boolean;
    showDocTypeList: boolean = false;

    errorCntrler: HandleErrorMsg;
    hmsgs: GrowlMessage[] = [];
    innerPannelGMessage: GrowlMessage[] = [];
    displayDialog: boolean;
    showErrorMsg: boolean = false;
    errorMsg: string[] = [];
    showErrorMsgInPanel: boolean = false;
    errorMsgInPanel: string[] = [];

    form: FormGroup;
    loading: boolean = false;

    activeLabel: string = this.shared.menuItem2SubItem4Label;

    onRowSelected: boolean = false;
    editedDocumentType: DocumentType;
    constructor(private _router: Router, 
        private _dService: DocumentTypeService,
        private confirmationService: ConfirmationService,
        private _fb: FormBuilder, public shared: SharedValues) {
        this.errorCntrler = new HandleErrorMsg(_router);
    }
    ngOnInit() {
        this.form = this._fb.group({
            name: [this.documentType.name, Validators.compose([Validators.required, Validators.minLength(5), Validators.maxLength(50)])],
            requiredForStore: [this.documentType.related2StoreWs],
            requiredForReal: [this.documentType.related2RealWs],
            requiredForLegal: [this.documentType.related2LegalWs],
            requiredForWorker: [this.documentType.related2Wr],
            duplicateAllowed:[this.documentType.duplicateAllowed],
            required:[this.documentType.required],
            show2Client:[this.documentType.show2Client]
        });

        this.rtvDocTypeList();
    }

    rtvDocTypeList() {
        this.loading = true;
        this._dService.getDocumentTypesList()
            .subscribe(response => {
                this.showDocTypeList = true;
                this.docTypes = <DocumentType[]>response;
                this.loading = false;
            }
            , error => {
                this.showErrorMsg = true;
                this.showDocTypeList = false;
                this.hmsgs = [];
                this.errorCntrler.gMessage = [];
                let obj: DocumentType[] = error.error;
                let err: BackendMessage = obj[0].error;
                let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                let errorMessages = this.errorCntrler.gMessage;
                errorMessages.forEach(element => {
                    this.hmsgs.push(element);
                });
                this.loading = false;
            }
            );
    }



    onRowSelect(event: any) {
        this.newDocumentType = false;
        this.documentType = this.cloneDocumentType(event.data);
        this.displayDialog = true;
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.form.controls['name'].clearAsyncValidators();
        this.form.controls['name'].clearValidators();
        this.onRowSelected = true;
    }
    edit(doct: DocumentType) {
        this.documentType = this.cloneDocumentType(doct);
        this.editedDocumentType = this.cloneDocumentType(doct);
        this.newDocumentType = false;
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.markAsUntouched();
        this.onRowSelected = false;
    }
    cloneDocumentType(docType: DocumentType): DocumentType {
        let doct = new DocumentType();
        doct.id = docType.id;
        doct.name = docType.name;
        doct.related2LegalWs = docType.related2LegalWs;
        doct.related2RealWs = docType.related2RealWs;
        doct.related2StoreWs = docType.related2StoreWs;
        doct.related2Wr = docType.related2Wr;
        doct.duplicateAllowed = docType.duplicateAllowed;
        doct.required = docType.required;
        doct.show2Client = docType.show2Client;
        return doct;
    }

    showDialogToAdd() {
        this.newDocumentType = true;
        this.documentType = new DocumentType();
        this.innerPannelGMessage = [];
        this.showErrorMsgInPanel = false;
        this.displayDialog = true;
        this.form.clearValidators();
        this.form.reset();
    }

    save() {
        console.log("dsds");
        this.loading = true;
        let dts = [...this.docTypes];
        if (this.newDocumentType) {
            this._dService.addDocumentType(this.documentType)
                .subscribe(response => {
                    this.documentType = <DocumentType>response;
                    dts.push(this.documentType);
                    this.docTypes = dts;
                    this.documentType = null;
                    this.displayDialog = false;
                    this.loading = false;
                },
                error => {
                    this.showErrorMsgInPanel = true;
                    this.innerPannelGMessage = [];
                    this.errorCntrler.gMessage = [];
                    let obj: DocumentType = error.error;
                    let err: BackendMessage = obj.error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.innerPannelGMessage = this.errorCntrler.gMessage;
                    this.loading = false;
                });
        }
        else {

            this._dService.updateDocumentType(this.documentType)
                .subscribe(response => {
                    if(this.onRowSelected)
                        dts[this.findSelectedDocTypeIndex()] = this.documentType;
                    else
                        dts[this.findDocTypeIndex(this.editedDocumentType)] = this.documentType;
                    this.docTypes = dts;
                    this.displayDialog = false;
                    this.loading = false;
                },
                error => {
                    this.showErrorMsgInPanel = true;
                    this.innerPannelGMessage = [];
                    this.errorCntrler.gMessage = [];
                    let err: BackendMessage = error.error;
                    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                    let errorMessages = this.errorCntrler.gMessage;
                    this.innerPannelGMessage = this.errorCntrler.gMessage;
                    this.loading = false;
                });
        }

    }

    delete(documentType: DocumentType) {

        this.confirmationService.confirm({
            message: this.shared.confirmText,
            accept: () => {
                this.loading = true;
                this._dService.deleteDocumentType(documentType)
                    .subscribe(response => {
                        this.loading = false;
                        let index = this.findDocTypeIndex(documentType);
                        this.docTypes = this.docTypes.filter((val, i) => i != index);
                        this.displayDialog = false;
                    },
                    error => {
                        this.innerPannelGMessage = [];
                        this.errorCntrler.gMessage = [];

                        let err: BackendMessage = error.error;
                        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
                        let errorMessages = this.errorCntrler.gMessage;
                        this.innerPannelGMessage = this.errorCntrler.gMessage;
                        this.loading = false;
                        this.showErrorMsg = true;

                    });
            }
        });

    }

    findDocTypeIndex(doct: DocumentType): number {
        for (let i = 0; i < this.docTypes.length; i++) {
            if (doct.id == this.docTypes[i].id)
                return i;
        }
        return -1;
    }
    findSelectedDocTypeIndex(): number {
        return this.docTypes.indexOf(this.selectedDocumentType);
    }


}