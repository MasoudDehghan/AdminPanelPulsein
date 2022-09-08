
import { BackendMessage } from '../entities/Msg.class'
import * as glob from '../shared/global';
import { Router } from '@angular/router';
import { InnerMessage } from '../entities/innerMsg.class'
import { GrowlMessage } from '../entities/growlMessage.class'
import { InnerMsgCodeEnum } from '../enums/innerMsgCode.enum'
import {Message} from 'primeng/components/common/api';

export class HandleErrorMsg {

    gMessage: GrowlMessage[] = [];
    iMessage: Message[] = [];
    errorLabel = glob.errorLabel;
    unableToConnect: boolean = false;
    repeatedEntityFound: string[] = [];
    constructor(private _router: Router) {

    }


    handleError(error: any): BackendMessage {
        let errorMsg: BackendMessage = new BackendMessage();
        if (error.status == 500) {
            let err: BackendMessage = <BackendMessage>(error.error);

            //SessionExpired
            if (err.code == 1) {
                alert(glob.sessionExpiredMsg);
                this._router.navigate(['/login']);
            }
            //errCode:2 UnAuthorized
            else if (err.code == 2) {
                this._router.navigate(['/login']);

            }
            //errCode:Internal Server Error
            else if (err.code == 4) {
                console.log(err);
                err.msg.forEach(element => {
                    if (element.code == InnerMsgCodeEnum.InnerCode_EmptyUserName) {
                        element.msg = glob.userNameValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserName) {
                        element.msg = glob.userNameInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedUserName) {
                        element.msg = glob.userNameDuplicatedMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyPassword) {
                        element.msg = glob.passValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPassword) {
                        element.msg = glob.passwordInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyUserRole) {
                        element.msg = glob.roleValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserRole) {
                        element.msg = glob.roleInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EntityNotFound) {
                        element.msg = glob.userNameNotExistedMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyEntityName) {
                        element.msg = glob.EmptyEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyPhoneList) {
                        element.msg = glob.InnerCode_EmptyPhoneListMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_MobileOrTelNumberNotFound) {
                        element.msg = glob.InnerCode_MobileOrTelNumberNotFoundMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFirstName) {
                        element.msg = glob.InnerCode_InvalidFirstNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidLastName) {
                        element.msg = glob.InnerCode_InvalidLastNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTitle) {
                        element.msg = glob.InnerCode_InvalidTitleMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidName) {
                        element.msg = glob.InnerCode_InvalidNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat1) {
                        element.msg = glob.InnerCode_InvalidJobcat1Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat2) {
                        element.msg = glob.InnerCode_InvalidJobcat2Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat3) {
                        element.msg = glob.InnerCode_InvalidJobcat3Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyJobsList) {
                        element.msg = glob.InnerCode_EmptyJobsListMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedWorkStationTitle) {
                        element.msg = glob.InnerCode_RepeatedWorkStationTitleMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOfficeNationalCode) {
                        element.msg = glob.InnerCode_InvalidOfficeNationalCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidInstagram) {
                        element.msg = glob.InnerCode_InvalidInstagramMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedFound) {
                        this.repeatedEntityFound.push(element.msg);
                    }

                    else if (element.code == 0 ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidEntityName ||
                        element.code == InnerMsgCodeEnum.InnerCode_EmptyParent ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidParent ||
                        element.code == InnerMsgCodeEnum.InnerCode_ParentNotFound) {
                        element.msg = glob.InvalidEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedEntityName) {
                        element.msg = glob.RepeatedEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EntityHaveChild) {
                        element.msg = glob.EntityHaveChildMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_UnableToDeleteFile) {
                        element.msg = glob.InnerCode_UnableToDeleteFileMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobPricePercent) {
                        element.msg = glob.InnerCode_InvalidJobPricePercentMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNotificationPercent) {
                        element.msg = glob.InnerCode_InvalidNotificationPercentMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNotificationPrice) {
                        element.msg = glob.InnerCode_InvalidNotificationPriceMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPrice) {
                        element.msg = glob.InnerCode_InvalidPriceMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidMobileNumber ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidPhoneNumber ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidFaxNumber) {
                        element.msg = glob.InnerCode_MobileOrTelNumberNotFoundMsg;
                    }
                    
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidCity) {
                        element.msg = glob.InnerCode_invalidCitylMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidRegion) {
                        element.msg = glob.InnerCode_invalidRegionlMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidArea) {
                        element.msg = glob.InnerCode_invalidAreaMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidEmail) {
                        element.msg = glob.invalidEmailMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWebsite) {
                        element.msg = glob.invalidWebURLMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTitle) {
                        element.msg = glob.InnerCode_InvalidTelegramMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOfficeRegisterNumber) {
                        element.msg = glob.InnerCode_InvalidOfficeRegisterNumberMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidStoreLicenseNumber) {
                        element.msg = glob.InnerCode_InvalidStoreLicenseNumberMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNationalCode) {
                        element.msg = glob.InnerCode_InvalidNationalCodeMsg;
                    }
                    
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPostalCode) {
                        element.msg = glob.InnerCode_InvalidPostalCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWorkType) {
                        element.msg = glob.InnerCode_InvalidWorkTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DuplicateEntity) {
                        element.msg = glob.InnerCode_DuplicateEntityMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidCode) {
                        element.msg = glob.InnerCode_InvalidCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWCode) {
                        element.msg = glob.InnerCode_InvalidWCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPositionType) {
                        element.msg = glob.InnerCode_InvalidPositionTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWorkstation) {
                        element.msg = glob.InnerCode_InvalidWorkstationMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserData) {
                        element.msg = glob.InnerCode_InvalidUserDataMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOwnerId) {
                        element.msg = glob.InnerCode_InvalidOwnerIdMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidBirthYear) {
                        element.msg = glob.InnerCode_InvalidBirthYearMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPhoto) {
                        element.msg = glob.InnerCode_InvalidPhotoMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_ThisUserIsAlreadyWorker) {
                        element.msg = glob.InnerCode_ThisUserIsAlreadyWorkerMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFilterStartDate) {
                        element.msg = glob.InnerCode_InvalidFilterStartDateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFilterStopDate) {
                        element.msg = glob.InnerCode_InvalidFilterStopDateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTime) {
                        element.msg = glob.InnerCode_InvalidTimeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_Relation2BothWrAndWs) {
                        element.msg = glob.InnerCode_Relation2BothWrAndWsMsg;
                    }
 
                    else if (element.code == InnerMsgCodeEnum.InnerCode_NoRelation2WrOrWs) {
                        element.msg = glob.InnerCode_NoRelation2WrOrWsMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidRegisterState) {
                        element.msg = glob.InnerCode_InvalidRegisterStateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidDocumentType) {
                        element.msg = glob.InnerCode_InvalidDocumentTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DuplicateDocumentType) {
                        element.msg = glob.InnerCode_DuplicateDocumentTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidDocumentInfo) {
                        element.msg = glob.InnerCode_InvalidDocumentInfoMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidRequestState) {
                        element.msg = glob.InnerCode_InvalidRequestStateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RequestCancelNotPermited) {
                        element.msg = glob.InnerCode_RequestCancelNotPermitedMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DocumentIsNotDeletable) {
                        element.msg = glob.InnerCode_DocumentIsNotDeletableMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidCreditSerach){
                        element.msg = glob.InnerCode_InvalidCreditSerachMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_EmptyEntityEName){
                        element.msg = glob.InnerCode_EmptyEntityENameMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_DuplicateEntityEName){
                        element.msg = glob.InnerCode_DuplicateEntityENameMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_AlreadyRegistered){
                        element.msg = glob.InnerCode_AlreadyRegisteredMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidAccountantNumber){
                        element.msg = glob.InnerCode_InvalidAccountantNumberMsg;
                    }
                    errorMsg.msg.push(element);
                    this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: element.msg });
                    this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: element.msg });
                    
                });
            }

        }
        else if (error.status == 400) {
            let message: InnerMessage = new InnerMessage();
            message.msg = glob.badRequestMsg;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
            this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });

        }
        else {
            let message: InnerMessage = new InnerMessage();
            message.msg = glob.unableToConnectBackEnd;
            this.unableToConnect = true;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
            this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });

        }
        return errorMsg;
    }

    handleErrorMethod(status, err: BackendMessage): BackendMessage {
        let errorMsg: BackendMessage = new BackendMessage();
        console.log("xxxxxxxxxx",err);
        if (status == 500) {

            //SessionExpired
            if (err.code == 1) {
                alert(glob.sessionExpiredMsg);
                this._router.navigate(['/login']);
            }
            //errCode:2 UnAuthorized
            else if (err.code == 2) {
                this._router.navigate(['/login']);

            }
            //errCode:Internal Server Error
            else if (err.code == 4) {

                err.msg.forEach(element => {
                    console.log(element.code);
                    if (element.code == InnerMsgCodeEnum.InnerCode_EmptyUserName) {
                        element.msg = glob.userNameValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserName) {
                        element.msg = glob.userNameInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedUserName) {
                        element.msg = glob.userNameDuplicatedMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyPassword) {
                        element.msg = glob.passValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPassword) {
                        element.msg = glob.passwordInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyUserRole) {
                        element.msg = glob.roleValidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserRole) {
                        element.msg = glob.roleInvalidMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EntityNotFound) {
                        element.msg = glob.userNameNotExistedMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyEntityName) {
                        element.msg = glob.EmptyEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyPhoneList) {
                        element.msg = glob.InnerCode_EmptyPhoneListMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_MobileOrTelNumberNotFound) {
                        element.msg = glob.InnerCode_MobileOrTelNumberNotFoundMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFirstName) {
                        element.msg = glob.InnerCode_InvalidFirstNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidLastName) {
                        element.msg = glob.InnerCode_InvalidLastNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTitle) {
                        element.msg = glob.InnerCode_InvalidTitleMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidName) {
                        element.msg = glob.InnerCode_InvalidNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat1) {
                        element.msg = glob.InnerCode_InvalidJobcat1Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat2) {
                        element.msg = glob.InnerCode_InvalidJobcat2Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobcat3) {
                        element.msg = glob.InnerCode_InvalidJobcat3Msg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EmptyJobsList) {
                        element.msg = glob.InnerCode_EmptyJobsListMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedWorkStationTitle) {
                        element.msg = glob.InnerCode_RepeatedWorkStationTitleMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidStoreLicenseDate) {
                        element.msg = glob.InnerCode_InvalidStoreLicenseDateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNationalCode) {
                        element.msg = glob.InnerCode_InvalidNationalCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOfficeNationalCode) {
                        element.msg = glob.InnerCode_InvalidOfficeNationalCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidInstagram) {
                        element.msg = glob.InnerCode_InvalidInstagramMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedFound) {
                        this.repeatedEntityFound.push(element.msg);
                    }

                    else if (element.code == 0 ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidEntityName ||
                        element.code == InnerMsgCodeEnum.InnerCode_EmptyParent ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidParent ||
                        element.code == InnerMsgCodeEnum.InnerCode_ParentNotFound) {
                        element.msg = glob.InvalidEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RepeatedEntityName) {
                        element.msg = glob.RepeatedEntityNameMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_EntityHaveChild) {
                        element.msg = glob.EntityHaveChildMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_UnableToDeleteFile) {
                        element.msg = glob.InnerCode_UnableToDeleteFileMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidJobPricePercent) {
                        element.msg = glob.InnerCode_InvalidJobPricePercentMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNotificationPercent) {
                        element.msg = glob.InnerCode_InvalidNotificationPercentMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidNotificationPrice) {
                        element.msg = glob.InnerCode_InvalidNotificationPriceMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPrice) {
                        element.msg = glob.InnerCode_InvalidPriceMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidMobileNumber ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidPhoneNumber ||
                        element.code == InnerMsgCodeEnum.InnerCode_InvalidFaxNumber) {
                        element.msg = glob.InnerCode_MobileOrTelNumberNotFoundMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidEmail) {
                        element.msg = glob.invalidEmailMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWebsite) {
                        element.msg = glob.invalidWebURLMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTitle) {
                        element.msg = glob.InnerCode_InvalidTelegramMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOfficeRegisterNumber) {
                        element.msg = glob.InnerCode_InvalidOfficeRegisterNumberMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidStoreLicenseNumber) {
                        element.msg = glob.InnerCode_InvalidStoreLicenseNumberMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPostalCode) {
                        element.msg = glob.InnerCode_InvalidPostalCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWorkType) {
                        element.msg = glob.InnerCode_InvalidWorkTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DuplicateEntity) {
                        element.msg = glob.InnerCode_DuplicateEntityMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidCode) {
                        element.msg = glob.InnerCode_InvalidCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWCode) {
                        element.msg = glob.InnerCode_InvalidWCodeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPositionType) {
                        element.msg = glob.InnerCode_InvalidPositionTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidWorkstation) {
                        element.msg = glob.InnerCode_InvalidWorkstationMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidUserData) {
                        element.msg = glob.InnerCode_InvalidUserDataMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidOwnerId) {
                        element.msg = glob.InnerCode_InvalidOwnerIdMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidBirthYear) {
                        element.msg = glob.InnerCode_InvalidBirthYearMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidPhoto) {
                        element.msg = glob.InnerCode_InvalidPhotoMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_ThisUserIsAlreadyWorker) {
                        element.msg = glob.InnerCode_ThisUserIsAlreadyWorkerMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFilterStartDate) {
                        element.msg = glob.InnerCode_InvalidFilterStartDateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidFilterStopDate) {
                        element.msg = glob.InnerCode_InvalidFilterStopDateMsg;
                    }
                    
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DocumentIsNotDeletable) {
                        element.msg = glob.InnerCode_DocumentIsNotDeletableMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_UserIsWorkStationOwner) {
                        element.msg = glob.InnerCode_UserIsWorkStationOwnerMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_UserIsWorker) {
                        element.msg = glob.InnerCode_UserIsWorkerMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_WsHaveSomeWorkers) {
                        element.msg = glob.InnerCode_WsHaveSomeWorkersMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTransaction_LowCredit) {
                        element.msg = glob.InnerCode_InvalidTransaction_LowCreditMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidTime) {
                        element.msg = glob.InnerCode_InvalidTimeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_Relation2BothWrAndWs) {
                        element.msg = glob.InnerCode_Relation2BothWrAndWsMsg;
                    }
 
                    else if (element.code == InnerMsgCodeEnum.InnerCode_NoRelation2WrOrWs) {
                        element.msg = glob.InnerCode_NoRelation2WrOrWsMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidRegisterState) {
                        element.msg = glob.InnerCode_InvalidRegisterStateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidDocumentType) {
                        element.msg = glob.InnerCode_InvalidDocumentTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_DuplicateDocumentType) {
                        element.msg = glob.InnerCode_DuplicateDocumentTypeMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidDocumentInfo) {
                        element.msg = glob.InnerCode_InvalidDocumentInfoMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_InvalidRequestState) {
                        element.msg = glob.InnerCode_InvalidRequestStateMsg;
                    }
                    else if (element.code == InnerMsgCodeEnum.InnerCode_RequestCancelNotPermited) {
                        element.msg = glob.InnerCode_RequestCancelNotPermitedMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_EmptyEntityEName){
                        element.msg = glob.InnerCode_EmptyEntityENameMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_DuplicateEntityEName){
                        element.msg = glob.InnerCode_DuplicateEntityENameMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountPercent){
                        element.msg = glob.InnerCode_InvalidDiscountPercentMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountMaxCredit){
                        element.msg = glob.InnerCode_InvalidDiscountMaxCreditMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountTotalCnt){
                        element.msg = glob.InnerCode_InvalidDiscountTotalCntMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountDescription){
                        element.msg = glob.InnerCode_InvalidDiscountDescriptionMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidCommissionOnIvoiceItems){
                        element.msg = glob.InnerCode_InvalidCommissionOnIvoiceItemsMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidCommissionOnTransfer){
                        element.msg = glob.InnerCode_InvalidCommissionOnTransferMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidCommissionOnWage){
                        element.msg = glob.InnerCode_InvalidCommissionOnWageMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidSnoozeState){
                        element.msg = glob.InnerCode_InvalidSnoozeStateMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_RequestStateIsClosed){
                        element.msg = glob.InnerCode_RequestStateIsClosedMsgMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_AlreadyRegistered){
                        element.msg = glob.InnerCode_AlreadyRegisteredMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidAccountantNumber){
                        element.msg = glob.InnerCode_InvalidAccountantNumberMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountType){
                        element.msg = glob.InnerCode_InvalidDiscountTypeMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidDiscountSourceType){
                        element.msg = glob.InnerCode_InvalidDiscountSourceTypeMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_Cat3HaveAlreadyGeneralDescount){
                        element.msg = glob.InnerCode_Cat3HaveAlreadyGeneralDescountMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_Cat3HaveAlreadyFirstDescount){
                        element.msg = glob.InnerCode_Cat3HaveAlreadyFirstDescountMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidImage){
                        element.msg = glob.imageNotSent;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_EmptyCityList){
                        element.msg = glob.InnerCode_EmptyCityListMsg;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidCommisionOffset){
                        element.msg = glob.InnerCode_InvalidCommisionOffset;
                    }
                    else if(element.code == InnerMsgCodeEnum.InnerCode_InvalidRegisterTime){
                        element.msg = glob.InnerCode_InvalidRegisterTime;
                    }
                    
                    errorMsg.msg.push(element);
                    this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: element.msg });
                    this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: element.msg });

                });
            }

        }
        else if (status == 400) {
            let message: InnerMessage = new InnerMessage();
            message.msg = glob.badRequestMsg;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
            this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });

        }
        else {
            let message: InnerMessage = new InnerMessage();
            message.msg = glob.unableToConnectBackEnd;
            this.unableToConnect = true;
            errorMsg.msg.push(message);
            this.gMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });
            this.iMessage.push({ severity: 'error', summary: this.errorLabel, detail: message.msg });

        }
        return errorMsg;
    }
}