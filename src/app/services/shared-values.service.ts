import * as glob from '../shared/global';
import { Injectable } from '@angular/core'
import { Observable, Subject } from 'rxjs';
import { PortalNotification } from 'app/pEntites/portalNotification.class';

@Injectable()
export class SharedValues { 
    public smsSubject = new Subject<PortalNotification>();
    public companyName = glob.companyName;
    public economyNumber = glob.economyNumber;
    public nationalNumber = glob.nationalNumber;
    public postalCode = glob.postalCode
    public companyAddress = glob.companyAddress;
    public companyTel = glob.companyTel;
    public economyCodeLabel = glob.economyCodeLabel;
    public addressLabel2 = glob.addressLabel2;
    public legalPersonLabel = glob.legalPersonLabel;
    public realPersonLabel = glob.realPersonLabel;
    public versionLabel = glob.versionLabel;
    public projectTitle = glob.projectTitle;
    public basicDataErrMsg = glob.basicDataErrMsg;
    public saveLabelFa = glob.saveLabelFa;
    public tehranLabel = glob.tehranLabel;
    public menuItem2Label = glob.menuItem2Label;
    public menuItem3Label = glob.menuItem3Label;
    public menuItem8Label = glob.menuItem8Label;
    public menuItem9Label = glob.menuItem9Label;
    public menuItem6Label = glob.menuItem6Label;
    public menuItem6SubItem1Label = glob.menuItem6SubItem1Label;
    public menuItem3SubItem2Label = glob.menuItem3SubItem2Label;
    public menuItem2SubItem1Label = glob.menuItem2SubItem1Label;
    public menuItem2SubItem2Label = glob.menuItem2SubItem2Label;
    public menuItem2SubItem3Label = glob.menuItem2SubItem3Label;
    public menuItem2SubItem4Label = glob.menuItem2SubItem4Label;
    public menuItem2SubItem5Label = glob.menuItem2SubItem5Label;
    public menuItem3SubItem1Label = glob.menuItem3SubItem1Label;
    public menuItem9SubItem1Label = glob.menuItem9SubItem1Label;
    public menuItem4Label = glob.menuItem4Label;
    public menuItem5Label = glob.menuItem5Label;
    public menuItem10Label = glob.menuItem10Label;
    public menuItem6SubItem2Label  =glob.menuItem6SubItem2Label;
    public menuItem6SubItem3Label  =glob.menuItem6SubItem3Label;
    public menuItem6SubItem4Label  =glob.menuItem6SubItem4Label;
    public valueAddredReportLabel  =glob.valueAddredReportLabel;
    public iranLabel = glob.iranLabel;
    public backLabel = glob.backLabel;
    public NewWorkStation = glob.NewWorkStation;
    public createNewWorkStation = glob.createNewWorkStation;
    public saveLabel = glob.saveLabelFa;
    public workStationLabelFa = glob.workStationLabelFa;
    public workTypeLabelFa = glob.workTypeLabelFa;
    public firstNameLabel = glob.firstNameLabel;
    public lastNameLabel = glob.lastNameLabel;
    public genderLabel = glob.genderLabel;
    public nationalCodeLabel = glob.nationalCodeLabel;
    public companyDataLabel = glob.companyDataLabel;
    public storeDataLabel = glob.storeDataLabel;
    public businessDataLabel = glob.businessDataLabel;
    public personalWorkerDataLabel = glob.personalWorkerDataLabel;
    public registerDataLabel = glob.registerDataLabel;
    public verifyDataLabel = glob.verifyDataLabel;
    public officeNameLabel = glob.officeNameLabel;
    public officeRegisterCodeLabel = glob.officeRegisterCodeLabel;
    public storeNameLabel = glob.storeNameLabel;
    public storeLicenseLabel = glob.storeLicenseLabel;
    public totalNumberLabel = glob.totalNumberLabel;
    public totalFilteredNumber = glob.totalFilteredNumber;
    public showFilter = glob.showFilter;
    public userMgmLabel = glob.userMgmLabel;
    public contactDataLabel = glob.contactDataLabel;
    public locationDataLabel = glob.locationDataLabel;
    public wlocationDataLabel = glob.wlocationDataLabel;
    public registerStateLabel = glob.registerStateLabel;
    public locationOnMap = glob.locationOnMap;
    public jobDataLabel = glob.jobDataLabel;
    public chooseWorkTypeLabel = glob.chooseWorkTypeLabel;
    public phoneLabel = glob.phoneLabel;
    public faxLabel = glob.faxLabel;
    public mobileLabel = glob.mobileLabel;
    public appMobileLabel = glob.appMobileLabel;
    public phoneLabel2 = glob.phoneLabel2;
    public faxLabel2 = glob.faxLabel2;
    public mobileLabel2 = glob.mobileLabel2;
    public webLabel = glob.webLabel;
    public instagramLabel = glob.instagramLabel;
    public telegramLabel = glob.telegramLabel;
    public emailLabel = glob.emailLabel;
    public closeLabel = glob.closeLabel;
    public job_Category1Label = glob.job_Category1Label;
    public job_Category2Label = glob.job_Category2Label;
    public job_Category3Label = glob.job_Category3Label;
    public provinceLabel = glob.provinceLabel;
    public townshipLabel = glob.townshipLabel;
    public changeLabel = glob.changeLabel;
    public detailLabel = glob.detailLabel;
    public cityLabel = glob.cityLabel;
    public regionLabel = glob.regionLabel;
    public areaLabel = glob.areaLabel;
    public addressLabel = glob.addressLabel;
    public addLabel = glob.addLabel;
    public postalCodeLabel = glob.postalCodeLabel;
    public allRegionLabel = glob.allRegionLabel;
    public allRegisterStateLabel = glob.allRegisterState;
    public allClientsLabel = glob.allClientsLabel;
    public chooseAreaMsg = glob.chooseAreaMsg;
    public showContactInfo = glob.showContactInfo;
    public showLocationInfo = glob.showLocationInfo;
    public aboutJobLabel = glob.aboutJobLabel;
    public delLabelFa = glob.delLabelFa;
    public editLabelFa = glob.editLabelFa;
    public actionLabel = glob.actionLabel;
    public showLabel = glob.showLabel;
    public editPanelLabel = glob.editPanelLabel;
    public confirmHeader = glob.confirmHeader;
    public yesLabel = glob.yesLabel;
    public noLabel = glob.noLabel;
    public refreshLabel = glob.refreshLabel;
    public errorLabel = glob.errorLabel;
    public warningLabel = glob.warningLabel;
    public requiredMsg = glob.requiredMsg;
    public minLengthValidatorNameMsg = glob.minLengthValidatorNameMsg;
    public maxLengthValidatorNameMsg = glob.maxLengthValidatorNameMsg;
    public charLabel = glob.charLabel;
    public allJC3Label = glob.allJC3Label;
    public chooseJC1Msg = glob.chooseJC1Msg;
    public chooseJC2Msg = glob.chooseJC2Msg;
    public chooseJC3Msg = glob.chooseJC3Msg;
    public imageCatalogLabel = glob.imageCatalogLabel;
    public uploadSuccessMsg = glob.uploadSuccessMsg;
    public invalidFileSize = glob.invalidFileSize;
    public invalidLoginRole = glob.invalidLoginRole;
    public invalidLoginMsg = glob.invalidLoginMsg;
    public oldPasswordInvalid = glob.oldPasswordInvalid;
    public badRequestMsg = glob.badRequestMsg;
    public unableToConnectBackEnd = glob.unableToConnectBackEnd; 
    public byteLabel = glob.byteLabel;
    public invalidFileSizeMessageDetail = glob.invalidFileSizeMessageDetail;
    public chooseFileLabel = glob.chooseFileLabel;
    public uploadLabel = glob.uploadLabel;
    public cancelLabel = glob.cancelLabel;
    public manLabel = glob.manLabel;
    public womanLabel = glob.womanLabel;
    public showBzLabel = glob.showBzLabel;
    public showBzStatLabel = glob.showBzStatLabel;
    public officeNationalCodeLabel = glob.officeNationalCodeLabel;
    public officeRegisterDateLabel = glob.officeRegisterDateLabel;
    public storeRegisterDateLabel = glob.storeRegisterDateLabel;
    public numberLabel = glob.numberLabel;
    public typeLabel = glob.typeLabel;
    public emptyPhoneListMsg = glob.emptyPhoneListMsg;
    public registeredPhoneNumberList = glob.registeredPhoneNumberList;
    public registerResourseLabel = glob.registerResourseLabel;
    public registeredWorkJobList = glob.registeredWorkJobList;
    public emptyWorkJobListMsg = glob.emptyWorkJobListMsg;
    public invalidPhoneMsg = glob.invalidPhoneMsg;
    public repeatedPhoneNumberMsg = glob.repeatedPhoneNumberMsg;
    public invalidMobileMsg = glob.invalidMobileMsg;
    public invalidFaxMsg = glob.invalidFaxMsg;
    public invalidNumberMsg = glob.invalidNumberMsg;
    public invalidJobDataMsg = glob.invalidJobDataMsg;
    public invalidWebURLMsg = glob.invalidWebURLMsg;
    public invalidEmailMsg = glob.invalidEmailMsg;
    public invalidNationalCodeMsg = glob.invalidNationalCodeMsg;
    public registerTimeLabel = glob.registerTimeLabel;
    public updateTimeLabel = glob.updateTimeLabel;
    public nameStoreOrCompanyLabel = glob.nameStoreOrCompanyLabel;
    public registerBizLabel = glob.registerBizLabel;
    public showJobInfo = glob.showJobInfo;
    public showBizInfo = glob.showBizInfo;
    public emptyListMsg = glob.emptyListMsg;
    public showDetialLabel = glob.showDetialLabel;
    public positionLabel = glob.positionLabel;
    public InnerCode_InvalidTimeMsg = glob.InnerCode_InvalidTimeMsg;
    public InnerCode_InvalidAreaMsg = glob.InnerCode_InvalidAreaMsg;
    public InnerCode_InvalidTitleMsg = glob.InnerCode_InvalidTitleMsg;
    public InnerCode_EmptyPhoneListMsg = glob.InnerCode_EmptyPhoneListMsg;
    public InnerCode_InvalidJobcat1Msg = glob.InnerCode_InvalidJobcat1Msg;
    public InnerCode_InvalidJobcat2Msg = glob.InnerCode_InvalidJobcat2Msg;
    public InnerCode_InvalidJobcat3Msg = glob.InnerCode_InvalidJobcat3Msg;
    public InnerCode_InvalidLastNameMsg = glob.InnerCode_InvalidLastNameMsg;
    public InnerCode_InvalidNameMsg = glob.InnerCode_InvalidNameMsg;
    public InnerCode_InvalidFirstNameMsg = glob.InnerCode_InvalidFirstNameMsg;
    public InnerCode_InvalidFilterStartDateMsg = glob.InnerCode_InvalidFilterStartDateMsg;
    public InnerCode_InvalidFilterStopDateMsg = glob.InnerCode_InvalidFilterStopDateMsg;
    public InnerCode_InvalidRegisterStateMsg = glob.InnerCode_InvalidRegisterStateMsg;
    public InnerCode_InvalidRequestStateMsg = glob.InnerCode_InvalidRequestStateMsg;
    public InnerCode_RequestCancelNotPermitedMsg = glob.InnerCode_RequestCancelNotPermitedMsg;
    public InnerCode_InvalidDiscountPercentMsg = glob.InnerCode_InvalidDiscountPercentMsg;
    public InnerCode_InvalidDiscountMaxCreditMsg = glob.InnerCode_InvalidDiscountMaxCreditMsg;
    public InnerCode_InvalidDiscountTotalCntMsg = glob.InnerCode_InvalidDiscountTotalCntMsg;
    public InnerCode_InvalidDiscountDescriptionMsg = glob.InnerCode_InvalidDiscountDescriptionMsg;
    public InnerCode_InvalidCommissionOnIvoiceItemsMsg = glob.InnerCode_InvalidCommissionOnIvoiceItemsMsg;
    public InnerCode_InvalidCommissionOnTransferMsg = glob.InnerCode_InvalidCommissionOnTransferMsg;
    public InnerCode_InvalidCommissionOnWageMsg = glob.InnerCode_InvalidCommissionOnWageMsg;
    public InnerCode_InvalidAccountantNumberMsg = glob.InnerCode_InvalidAccountantNumberMsg;
    public editModeLabel = glob.editModeLabel;
    public activeModeLabel = glob.activeLabel;
    public inactiveModeLabel = glob.inactiveLabel;
    public relaxLabel = glob.relaxLabel;
    public workstationTitleDuplicatedMsg = glob.workstationTitleDuplicatedMsg;
    public InnerCode_InvalidOfficeNationalCodeMsg = glob.InnerCode_InvalidOfficeNationalCodeMsg;
    public uploadImageLabel = glob.uploadImageLabel;
    public successFullChangeMsg = glob.successFullChangeMsg;
    public jobCategoryEditMsg = glob.jobCategoryEditMsg;
    public repeatedWorkerJobMsg = glob.repeatedWorkerJobMsg;
    public personalWorkerDataSumLabel = glob.personalWorkerDataSumLabel;
    public locationDataSumLabel = glob.locationDataSumLabel;
    public InnerCode_InvalidInstagramMsg = glob.InnerCode_InvalidInstagramMsg;
    public InnerCode_DuplicateDocumentTypeMsg = glob.InnerCode_DuplicateDocumentTypeMsg;
    public showPersonalInfo = glob.showPersonalInfo;
    public allLabel = glob.allLabel;
    public BizInfo = glob.BizInfo;
    public operatorLabel = glob.operatorLabel;
    public phoneEditMsg = glob.phoneEditMsg;
    public InnerCode_EmptyJobsListMsg = glob.InnerCode_EmptyJobsListMsg;
    public nameLabel = glob.nameLabel;
    public fnameLabel = glob.fnameLabel;
    public latinNameLabel = glob.latinNameLabel;
    public registerUserLabel = glob.registerUserLabel;
    public InnerCode_InvalidTelegramMsg = glob.InnerCode_InvalidTelegramMsg;
    public showOnMap = glob.showOnMap;
    public workerDataLabel = glob.workerDataLabel;
    public phoneRegisteredBeforeMsg = glob.phoneRegisteredBeforeMsg;
    public specifyLocOnMap = glob.specifyLocOnMap;
    public chooseProvinceMsg = glob.chooseProvinceMsg;
    public chooseUserMsg = glob.chooseUserMsg;
    public bizCodeLabel = glob.bizCodeLabel;
    public bizNameLabel = glob.bizNameLabel;
    public telLabel = glob.telLabel;
    public registerWsUserName = glob.registerWsUserName;
    public verifierWsUserName = glob.verifierWsUserName;
    public state = glob.state;
    public confirmText = glob.confirmText;
    public clickToEdit = glob.clickToEdit;
    public selectToEdit = glob.selectToEdit;
    public registerNewWorkerLabel = glob.registerNewWorkerLabel;
    public noWorkerInWorkStation = glob.noWorkerInWorkStation;
    public profileImageLabel = glob.profileImageLabel;
    public registerLabel = glob.registerLabel;
    public editWorkerLabel = glob.editWorkerLabel;
    public ownerLabel = glob.ownerLabel;
    public otherLabel = glob.otherLabel;
    public userNameLabel = glob.userNameLabelFa;
    public passwordLabel = glob.passwordLabel;
    public passwordLabelFa = glob.passwordLabelFa;
    public oldPWDLabelFa = glob.oldPWDLabelFa;
    public loginBtnLabel = glob.loginBtnLabel;
    public loginHeader = glob.loginHeader; 
    public pwdLabelFa = glob.pwdLabelFa;
    public roleLabel = glob.roleLabelFa;
    public createNewUser = glob.createNewUser;
    public userNameValidMsg: string = glob.userNameValidMsg;
    public passValidMsg: string = glob.passValidMsg;
    public userNameInvalidMsg: string = glob.userNameInvalidMsg;
    public passwordInvalidMsg = glob.passwordInvalidMsg;
    public userNameDuplicatedMsg = glob.userNameDuplicatedMsg;
    public systemUsersLabel = glob.systemUsersLabel;
    public passwordPolicyHint = glob.passwordPolicyHint;
    public userNamePolicyMsg = glob.userNamePolicyMsg;
    public registerStatePhase1 = glob.registerStatePhase1;
    public registerStatePhase2 = glob.registerStatePhase2;
    public registerStatePhase3 = glob.registerStatePhase3;
    public birthYearLabel = glob.birthYearLabel;
    public userAccountLabel = glob.userAccountLabel;
    public rePWDLabelFa = glob.rePWDLabelFa;
    public passNotTheSame = glob.passNotTheSame;
    public ChangePassPanelLabel = glob.ChangePassPanelLabel;
    public newPWDLabelFa = glob.newPWDLabelFa;
    public addNewUserLabel = glob.addNewUserLabel;
    public chooseBirthYearLabel = glob.chooseBirthYearLabel;
    public changeWorkStationOwnerLabel = glob.changeWorkStationOwnerLabel;
    public manageWorkerLabel = glob.manageWorkerLabel;
    public wrPaymentReport = glob.wrPaymentReport;
    public workerCodeLabel = glob.workerCodeLabel;
    public showWorkerListLabel = glob.showWorkerListLabel;
    public expertsLabel = glob.expertsLabel;
    public coverageAreaLabel = glob.coverageAreaLabel;
    public documentLabel = glob.documentLabel;
    public workingHoursLabel = glob.workingHoursLabel;
    public removeAddWorkerJobMap = glob.removeAddWorkerJobMap;
    public experienceStartLabel = glob.experienceStartLabel;
    public chooseExperienceStartYearLabel = glob.chooseExperienceStartYearLabel;
    public workersLabel = glob.workersLabel;
    public clientsLabel = glob.clientsLabel;
    public showPhotoLabel = glob.showPhotoLabel;
    public tempUsers = glob.tempUsers;
    public msgNeedToCheck = glob.msgNeedToCheck;
    public totalJobRegistered = glob.totalJobRegistered;
    public totalRequestedLabel = glob.totalRequestedLabel;
    public totalUsers = glob.totalUsers;
    public activeWorkerLabel = glob.activeWorkerLabel;
    public verifiedWorkerLabel = glob.verifiedWorkerLabel;
    public activeClientLabel = glob.activeClientLabel;
    public menuItem1Label = glob.menuItem1Label;
    public addProvinceLabel = glob.addProvinceLabel;
    public editProvinceLabel = glob.editProvinceLabel;
    public deleteProvinceLabel = glob.deleteProvinceLabel;
    public addTownshipLabel = glob.addTownshipLabel;
    public editTownshipLabel = glob.editTownshipLabel;
    public deleteTownshipLabel = glob.deleteTownshipLabel;
    public addCityLabel = glob.addCityLabel;
    public editCityLabel = glob.editCityLabel;
    public deleteCityLabel = glob.deleteCityLabel;
    public addRegionLabel = glob.addRegionLabel;
    public editRegionLabel = glob.editRegionLabel;
    public deleteRegionLabel = glob.deleteRegionLabel;
    public addAreaLabel = glob.addAreaLabel;
    public editAreaLabel = glob.editAreaLabel;
    public deleteAreaLabel = glob.deleteAreaLabel;
    public listProvinceLabel = glob.listProvinceLabel;
    public listTownshipLabel = glob.listTownshipLabel;
    public listCityLabel = glob.listCityLabel;
    public listRegionLabel = glob.listRegionLabel;
    public listAreaLabel = glob.listAreaLabel;
    public emptyRegionListMsg = glob.emptyRegionListMsg;
    public emptyCityListMsg = glob.emptyCityListMsg;
    public emptyTownshipListMsg = glob.emptyTownshipListMsg;
    public emptyProvinceListMsg = glob.emptyProvinceListMsg;
    public emptyAreaListMsg = glob.emptyAreaListMsg;
    public addNewProvinceMsg = glob.addNewProvinceMsg;
    public addNewTownshipMsg = glob.addNewTownshipMsg;
    public addNewCityMsg = glob.addNewCityMsg;
    public addNewRegionMsg = glob.addNewRegionMsg;
    public addNewAreaMsg = glob.addNewAreaMsg;
    public removeProvinceMsg = glob.removeProvinceMsg;
    public removeTownshipMsg = glob.removeTownshipMsg;
    public removeCityMsg = glob.removeCityMsg;
    public removeRegionMsg = glob.removeRegionMsg;
    public removeAreaMsg = glob.removeAreaMsg;
    public createNewWorkType = glob.createNewWorkType;
    public listJC1Label = glob.listJC1Label;
    public listJC2Label = glob.listJC2Label;
    public listJC3Label = glob.listJC3Label;
    public addJC1Label = glob.addJC1Label;
    public addJC2Label = glob.addJC2Label;
    public addJC3Label = glob.addJC3Label;
    public editJC1Label = glob.editJC1Label;
    public editJC2Label = glob.editJC2Label;
    public editJC3Label = glob.editJC3Label;
    public deleteJC1Label = glob.removeJC1Label;
    public deleteJC2Label = glob.removeJC2Label;
    public deleteJC3Label = glob.removeJC3Label;
    public addNewJC1Msg = glob.addNewJC1Msg;
    public addNewJC2Msg = glob.addNewJC2Msg;
    public addNewJC3Msg = glob.addNewJC3Msg;
    public removeJC1Msg = glob.removeJC1Msg;
    public removeJC2Msg = glob.removeJC2Msg;
    public removeJC3Msg = glob.removeJC3Msg;
    public emptyJC1ListMsg = glob.emptyJC1ListMsg;
    public emptyJC2ListMsg = glob.emptyJC2ListMsg;
    public emptyJC3ListMsg = glob.emptyJC3ListMsg;
    public docTypeLabelFa = glob.docTypeLabelFa;
    public requiredForStoreLabel = glob.requiredForStoreLabel;
    public requiredForLegalLabel = glob.requiredForLegalLabel;
    public requiredForRealLabel = glob.requiredForRealLabel;
    public requiredForWorkerLabel = glob.requiredForWorkerLabel;
    public createNewDocType = glob.createNewDocType;
    public subTypeLabelFa = glob.subTypeLabelFa;
    public jobPricePercentLabel = glob.jobPricePercentLabel;
    public notificationPercentLabel = glob.notificationPercentLabel;
    public notificationPriceLabel = glob.notificationPriceLabel;
    public servicePriceLabel = glob.servicePriceLabel;
    public createNewSubType = glob.createNewSubType;
    public percentPatternMsg = glob.percentPatternMsg;
    public moneyPatternMsg = glob.moneyPatternMsg;
    public rialLabel = glob.rialLabel;
    public verifiedLabel = glob.verifiedLabel;
    public unverifiedLabel = glob.unverifiedLabel;
    public titleLabel = glob.titleLabel;
    public contentLabel = glob.contentLabel;
    public vibrateLabel = glob.vibrateLabel;
    public soundLabel = glob.soundLabel;
    public ledLabel = glob.ledLabel;
    public isBigLabel = glob.isBigLabel;
    public relatedCat = glob.relatedCat;
    public imageLabel = glob.imageLabel;
    public registeredBizCounter = glob.registeredBizCounter;
    public allJC2Label = glob.allJC2Label;
    public geoReportLabel = glob.geoReportLabel;
    public doFilterLabel = glob.doFilterLabel;
    public showLocationOnMap = glob.showLocationOnMap;
    public resourseLabel = glob.resourseLabel;
    public descLabel = glob.descLabel;
    public usedInApp = glob.usedInApp;
    public otherPhoneNumber = glob.otherPhoneNumber;
    public documentsLabel = glob.documentsLabel;
    public registeredDocumentListLabel = glob.registeredDocumentListLabel;
    public registerNewDoc = glob.registerNewDoc;
    public registerActiveCity = glob.registerActiveCity
    public docListLabel = glob.docListLabel;
    public docValidMsg = glob.docValidMsg;
    public noImageForDoc = glob.noImageForDoc;
    public chooseDocMsg = glob.chooseDocMsg;
    public chooseStateMsg = glob.chooseStateMsg;
    public repeatedAreaMsg = glob.repeatedAreaMsg;
    public repeatedRegionMsg = glob.repeatedRegionMsg;
    public numberOfSelectedRegions = glob.numberOfSelectedRegions;
    public registerNewAreas = glob.registerNewAreas;
    public serviceAreaList = glob.serviceAreaList;
    public chooseServiceAreaMap = glob.chooseServiceAreaMap;
    public docinValidMsg = glob.docinValidMsg;
    public saturdayLabel = glob.saturdayLabel;
    public sundayLabel = glob.sundayLabel;
    public mondayLabel = glob.mondayLabel;
    public tuesdayLabel = glob.tuesdayLabel;
    public wednesdayLabel = glob.wednesdayLabel;
    public thursdayLabel = glob.thursdayLabel;
    public fridayLabel = glob.fridayLabel;
    public startWorkingHourLabel = glob.startWorkingHourLabel;
    public stopWorkingHourLabel = glob.stopWorkingHourLabel;
    public workingDayLabel = glob.workingDayLabel;
    public workerViewLabel = glob.workerViewLabel;
    public clientViewLabel = glob.clientViewLabel;
    public activeLabel = glob.activeLabel;
    public inactiveLabel = glob.inactiveLabel;
    public serviceState = glob.serviceState;
    public wsDocument = glob.wsDocument;
    public wrDocument = glob.wrDocument;
    public wsNew = glob.wsNew;
    public ws4Doc = glob.ws4Doc;
    public ws4Area = glob.ws4Area;
    public wr4Doc = glob.wr4Doc;
    public wrNew = glob.wrNew;
    public wsFinal = glob.wsFinal;
    public wrFinal = glob.wrFinal;
    public itemsNeedToCheck = glob.itemsNeedToCheck;
    public wrProfileImage = glob.wrProfileImage;
    public wsLogo = glob.wsLogo;
    public wsCatalog = glob.wsCatalog;
    public showCartablDashboard = glob.showCartablDashboard;
    public showCartableWorkStationDashboard = glob.showCartableWorkStationDashboard;
    public showCartableWorkerDashboard = glob.showCartableWorkerDashboard;
    public wrCartableLabel = glob.wrCartableLabel;
    public tomanLabel = glob.tomanLabel;
    public nwrCartableLabel = glob.nwrCartableLabel;
    public fwsCartableLabel = glob.fwsCartableLabel;
    public fwrCartableLabel = glob.fwrCartableLabel;
    public wsCartableLabel = glob.wsCartableLabel;
    public nwsCartableLabel = glob.nwsCartableLabel;
    public nwsw4DocCartableLabel = glob.nwsw4DocCartableLabel;
    public nwsw4AreaCartableLabel = glob.nwsw4AreaCartableLabel;
    public wsDocumentCartablLabel = glob.wsDocumentCartablLabel;
    public nwsDocumentCartablLabel = glob.nwsDocumentCartablLabel;
    public wrDocumentCartablLabel = glob.wrDocumentCartablLabel;
    public nwrDocumentCartablLabel = glob.nwrDocumentCartablLabel;
    public nwr4DocCartableLabel = glob.nwr4DocCartableLabel;
    public wrUsersProfileCartablLabel = glob.wrUsersProfileCartablLabel;
    public wrNewUsersProfileCartablLabel = glob.wrNewUsersProfileCartablLabel;
    public wsLogosCartablLabel = glob.wsLogosCartablLabel;
    public wsNewLogosCartablLabel = glob.wsNewLogosCartablLabel;
    public wsCatalogsCartablLabel = glob.wsCatalogsCartablLabel;
    public expiredRequestCartableLabel = glob.expiredRequestCartableLabel;
    public wsNewCatalogsCartablLabel = glob.wsNewCatalogsCartablLabel;
    public confirmationLabel = glob.confirmationLabel;
    public acceptLabel = glob.acceptLabel;
    public rejectLabel = glob.rejectLabel;
    public waitToVerifyLabel = glob.waitToVerifyLabel;
    public historyLabel = glob.historyLabel;
    public startTimeIsRequired = glob.startTimeIsRequired;
    public stopTimeIsRequired = glob.stopTimeIsRequired;
    public clearFilterLabel = glob.clearFilterLabel;
    public longtitudeLabel = glob.longtitudeLabel;
    public latitudeLabel = glob.latitudeLabel;
    public invalidLatMsg = glob.invalidLatMsg;
    public invalidLongMsg = glob.invalidLongMsg;
    public periodTimeLabel = glob.periodTimeLabel;
    public periodTimeLabelx = glob.periodTimeLabelx;
    // public minLatitude = glob.minLatitude;
    // public maxLatitude = glob.maxLatitude;
    // public minLongtitude = glob.minLongtitude;
    // public maxLongtitude = glob.maxLongtitude;
    public priorityLabel = glob.priorityLabel;
    public requestCodeLabel = glob.requestCodeLabel;
    public suggestionLabel = glob.suggestionLabel;
    public requestStateHisoryLabel = glob.requestStateHisoryLabel;
    public acceptedSuggestionLabel = glob.acceptedSuggestionLabel;
    public performaInvoiceLabel = glob.performaInvoiceLabel;
    public surveyFactorLabel = glob.surveyFactorLabel;
    public operationalViewLabel = glob.operationalViewLabel;
    public allCurrentRequest = glob.allCurrentRequest;
    public allFinishedRequest = glob.allFinishedRequest;
    public allRequests = glob.allRequests;
    public finalFactorLabel = glob.finalFactorLabel;
    public fullNameLabel = glob.fullNameLabel;
    public contactNumberLabel = glob.contactNumberLabel;
    public rcvTimeLabel = glob.rcvTimeLabel;
    public offerTimeLabel = glob.offerTimeLabel;
    public showRequestListLabel = glob.showRequestListLabel;
    public clientReviewPoints_PriceLabel = glob.clientReviewPoints_PriceLabel;
    public clientReviewPoints_TimeLabel = glob.clientReviewPoints_TimeLabel;
    public clientReviewPoints_WorkLabel = glob.clientReviewPoints_WorkLabel;
    public paymentTypeLabel = glob.paymentTypeLabel;
    public totalPriceLabel = glob.totalPriceLabel;
    public noSelectedSuggestionForRequestMsg = glob.noSelectedSuggestionForRequestMsg;
    public cacheLabel = glob.cacheLabel;
    public creditLabel = glob.creditLabel;
    public registerPeriodTimeLabel = glob.registerPeriodTimeLabel;
    public updatePeriodTimeLabel = glob.updatePeriodTimeLabel;
    public requestViewLabel = glob.requestViewLabel;
    public requestLocationViewLabel = glob.requestLocationViewLabel;
    public requestPricePeriodLabel = glob.requestPricePeriodLabel;
    public chooseTownshipMsg = glob.chooseTownshipMsg;
    public chooseCityMsg = glob.chooseCityMsg;
    public applyFilterLabel = glob.applyFilterLabel;
    public notApplyFilterLabel = glob.notApplyFilterLabel;
    public clientLabel = glob.clientLabel;
    public factorDetailLabel = glob.factorDetailLabel;
    public priceLabel = glob.priceLabel;
    public jobOfferListLabel = glob.jobOfferListLabel;
    public backToRequestList = glob.backToRequestList;
    public startTimeLabel = glob.startTimeLabel;
    public endTimeLabel = glob.endTimeLabel;
    public emergancyLabel = glob.emergancyLabel;
    public transferLabel = glob.transferLabel;
    public wageLabel = glob.wageLabel;
    public imagesLabel = glob.imagesLabel;
    public snoozeLabel = glob.snoozeLabel;
    public transactionLabel = glob.transactionLabel;
    public amountLabel = glob.amountLabel;
    public rcvPaymentTypeLabel = glob.rcvPaymentTypeLabel;
    public sentPaymentTypeLabel = glob.sentPaymentTypeLabel;
    public paymentMethodLabel = glob.paymentMethodLabel;
    public withCreditLabel = glob.withCreditLabel;
    public trackingCodeLabel = glob.trackingCodeLabel;
    public showTransactionListLabel = glob.showTransactionListLabel;
    public transactionAmountLabel = glob.transactionAmountLabel;
    public transactionViewLabel = glob.transactionViewLabel;
    public accountNumberlabel = glob.accountNumberlabel;
    public showTransactionList = glob.showTransactionList;
    public registerFinancialDoc = glob.registerFinancialDoc;
    public trackingCodeRequiredMsg = glob.trackingCodeRequiredMsg;
    public amountRequired = glob.amountRequired;
    public minAmount = glob.minAmount;
    public maxAmount = glob.maxAmount;
    public footerText = glob.footerText;
    public geReportMsg = glob.geReportMsg;
    public waitMsg = glob.waitMsg;
    public searchLabel = glob.searchLabel;
    public totalRegisteredLabel = glob.totalRegisteredLabel;
    public sendSMSPanel = glob.sendSMSPanel;
    public sendNotificationPanel = glob.sendNotificationPanel;
    public sendLabel = glob.sendLabel;
    public requiedFieldLabel = glob.requiedFieldLabel;
    public maxCharLabel = glob.maxCharLabel;
    public smsSendMsg = glob.smsSendMsg;
    public clientApp = glob.clientApp;
    public workerApp = glob.workerApp;
    public releaseTimeLabel = glob.releaseTimeLabel;
    public registerNewClientAppVersion = glob.registerNewClientAppVersion;
    public registerNewWorkerAppVersion = glob.registerNewWorkerAppVersion;
    public duplicatedAllowed = glob.duplicatedAllowed;
    public reportedErrorCounter = glob.reportedErrorCounter;
    public required = glob.required;
    public show2Client = glob.show2Client;
    public reqWait4Suggest = glob.reqWait4Suggest;
    public reqWait4Survey = glob.reqWait4Survey;
    public reqWait4SurveyAck = glob.reqWait4SurveyAck;
    public reqWait4Do = glob.reqWait4Do;
    public reqWait4DoAck = glob.reqWait4DoAck;
    public reqInProgress = glob.reqInProgress;
    public reqFinished = glob.reqFinished;
    public reqCancelByC = glob.reqCancelByC;
    public reqCancelByW = glob.reqCancelByW;
    public reqCancelByO = glob.reqCancelByO;
    public registerPartLabel = glob.registerPartLabel;
    public workStationTitleLabel = glob.workStationTitleLabel;
    //public defaultCityID = glob.defaultCityID;
    public statJobCategory = glob.statJobCategory;
    public bizLabel = glob.bizLabel;
    public cartableDashboard = glob.cartableDashboard;
    public currentRequestsLabel = glob.currentRequestsLabel;
    public finishedRequestsLabel = glob.finishedRequestsLabel;
    public reqWait4Payment = glob.reqWait4Payment;
    public reqWait4Nazarsanji = glob.reqWait4Nazarsanji;
    public reqSuggestFinished = glob.reqSuggestFinished;
    public waitTConfirm = glob.waitTConfirm;
    public noneLabel = glob.noneLabel;
    public expiredLabel = glob.expiredLabel;
    public settingLabel = glob.settingLabel;
    public svalueLabel = glob.svalueLabel;
    public fvalueLabel = glob.fvalueLabel;
    public unitLabel = glob.unitLabel;
    public suggestionStateLabel = glob.suggestionStateLabel;
    public offerStateLabel = glob.offerStateLabel;
    public valueLabel = glob.valueLabel;
    public invalidInputMsg = glob.invalidInputMsg;
    public restrictedAccess = glob.restrictedAccess;
    public totalLabel = glob.totalLabel;
    public workerLabel = glob.workerLabel;
    public totalFactorLabel = glob.totalFactorLabel;
    public rlocationDataLabel = glob.rlocationDataLabel;
    public editDocMsg = glob.editDocMsg;
    public editCommisionOffsetMsg = glob.editCommisionOffsetMsg;
    public noChangeMsg = glob.noChangeMsg;
    public todayLabel = glob.todayLabel;
    public fromLabel = glob.fromLabel;
    public depositTimeLabel = glob.depositTimeLabel;
    public taLabel = glob.taLabel;
    public cancelReqLabel = glob.cancelReqLabel;
    public closeReqLabel = glob.closeReqLabel;
    public controlLabel = glob.controlLabel;
    public appClientUsersLabel = glob.appClientUsersLabel;
    public panelOperatorLabel = glob.panelOperatorLabel;
    public appWorkertUsersLabel = glob.appWorkertUsersLabel;
    public lastPaymentTimeLabel = glob.lastPaymentTimeLabel;
    public payableAmountLabel = glob.payableAmountLabel;
    public reportTimeLabel = glob.reportTimeLabel;
    public getReportLabel = glob.getReportLabel;
    public finalOK = glob.finalOK;
    public sumReqPriceCash = glob.sumReqPriceCash;
    public sumReqPriceCredit = glob.sumReqPriceCredit;
    public sumBonous = glob.sumBonous;
    public sumCommission = glob.sumCommission;
    public afterPaymentCredit = glob.afterPaymentCredit;
    public filteredExcelViewLabel = glob.filteredExcelViewLabel;
    public reminingCharsLabel = glob.reminingCharsLabel;
    public creditAfterPayment = glob.creditAfterPayment;
    public registerTodayLabel = glob.registerTodayLabel;
    public rollBackLabel = glob.rollBackLabel;
    public pollTimeLabel = glob.pollTimeLabel;
    public sumCreditIncrementLabel = glob.sumCreditIncrementLabel;
    public sumCreditIncomeLabel = glob.sumCreditIncomeLabel;
    public sumCreditOutcomeLabel = glob.sumCreditOutcomeLabel;
    public sumCashIncomeLabel = glob.sumCashIncomeLabel;
    public sumCashOutcomeLabel = glob.sumCashOutcomeLabel;
    public sumRollbackIncomeLabel = glob.sumRollbackIncomeLabel;
    public sumRollbackOutcomeLabel = glob.sumRollbackOutcomeLabel;
    public sumPaymentLabel = glob.sumPaymentLabel;
    public appVersionLabel = glob.appVersionLabel;
    public discountCodeMGMLabel = glob.discountCodeMGMLabel;
    public festivalMGMLabel = glob.festivalMGMLabel;
    public codeLabel = glob.codeLabel;
    public discountPercent = glob.discountPercent;
    public maxCreditLabel = glob.maxCreditLabel;
    public totalCounterLabel = glob.totalCounterLabel;
    public usedCounterLabel = glob.usedCounterLabel;
    public registerDiscount = glob.registerDiscount;
    public editDiscount = glob.editDiscount;
    public multiUseLabel = glob.multiUseLabel;
    public requiredMsgLabel = glob.requiredMsgLabel;
    public percentValidMsg = glob.percentValidMsg;
    public discountViewLabel = glob.discountViewLabel;
    public endTimePeriodLabel = glob.endTimePeriodLabel;
    public discountPercentPeriodLabel = glob.discountPercentPeriodLabel;
    public maxCreditPeriodLabel = glob.maxCreditPeriodLabel;
    public totalCounterPeriodLabel = glob.totalCounterPeriodLabel;
    public usedCounterPeriodLabel = glob.usedCounterPeriodLabel;
    public jobCat1OnlySelectedMsg = glob.jobCat1OnlySelectedMsg;
    public commissionOnIvoiceItemsLabel = glob.commissionOnIvoiceItemsLabel;
    public commissionOnWageLabel = glob.commissionOnWageLabel;
    public commissionOnTransferLabel = glob.commissionOnTransferLabel;
    public editCommissionLabel = glob.editCommissionLabel;
    public editPriceLabel = glob.editPriceLabel;
    public editActiveCityLabel = glob.editActiveCityLabel;
    public userLabel = glob.userLabel;
    public singleLabel = glob.singleLabel;
    public groupLabel = glob.groupLabel;
    public groupDiscountError = glob.groupDiscountError;
    public inActiveVerLabel = glob.inActiveVerLabel;
    public activeVerLabel = glob.activeVerLabel;
    public registerUserStatLabel = glob.registerUserStatLabel;
    public cancelFinishLabel = glob.cancelFinishLabel;
    public candidateWorkerList = glob.candidateWorkerList;
    public creditnLabel = glob.creditnLabel;
    public referenceLabel = glob.referenceLabel;
    public totalSuccessfullRequest = glob.totalSuccessfullRequest;
    public totalFailSuccessfullRequest = glob.totalFailSuccessfullRequest;
    public requestLabel = glob.requestLabel;
    public selectNewCat3 = glob.selectNewCat3;
    public currentCat3 = glob.currentCat3
    public newCat3 = glob.newCat3;
    public jc3Label = glob.jc3Label;
    public searchInJobCategory3 = glob.searchInJobCategory3;
    public imageNotSent = glob.imageNotSent;
    public notificationSentMsg = glob.notificationSentMsg;
    public totalRegisteredRequestLabel = glob.totalRegisteredRequestLabel;
    public totalCanceledRequestLabel = glob.totalCanceledRequestLabel;
    public followupLabel = glob.followupLabel;
    public followUp = glob.followUp;
    public newFollowUp = glob.newFollowUp;
    public pointLabel = glob.pointLabel;
    public deviceTypeLabel = glob.deviceTypeLabel;
    public discountUsageLabel = glob.discountUsageLabel;
    public discountAmountLabel = glob.discountAmountLabel;
    public sendTimeLabel = glob.sendTimeLabel;
    public notificationReportLabel = glob.notificationReportLabel;
    public resultLabel = glob.resultLabel;
    public notificationsLabel = glob.notificationsLabel;
    public wait4Init = glob.wait4Init;
    public wait4Doc = glob.wait4Doc;
    public wait4Docx = glob.wait4Docx
    public wait4Final = glob.wait4Final;
    public wait4PreFinal = glob.wait4PreFinal;
    public nwsw4DocAreaCartableLabel = glob.nwsw4DocAreaCartableLabel;
    public netbarg = glob.netbarg;
    public questionScoreLabel = glob.questionScoreLabel;
    public invitationScoreLabel = glob.invitationScoreLabel;
    public requestScoreLabel = glob.requestScoreLabel;
    public totalScoreLabel = glob.totalScoreLabel;
    public gradeLabel = glob.gradeLabel;
    public lastConfirmTimeLabel = glob.lastConfirmTimeLabel;
    public todayInviteCntLabel = glob.todayInviteCntLabel;
    public emergencyEnableLabel = glob.emergencyEnableLabel;
    public nowToStartPeriodLabel = glob.nowToStartPeriodLabel;
    public invoiceRequiredLabel = glob.invoiceRequiredLabel;
    public destinationAddressRequiredLabel = glob.destinationAddressRequiredLabel;
    public availableLabel = glob.availableLabel;
    public timeLabel = glob.timeLabel;
    public docLabel = glob.docLabel;
    public doc1Label = glob.doc1Label;
    public doc2Label = glob.doc2Label;
    public doc3Label = glob.doc3Label;
    public docNumberLabel = glob.docNumberLabel;
    public userCreditLabel = glob.userCreditLabel;
    public discountCodeLabel = glob.discountCodeLabel;
    public commisionLabel = glob.commisionLabel;
    public expertShareLabel = glob.expertShareLabel;
    public incCreditValueLabel = glob.incCreditValueLabel;
    public reckoningValueLabel = glob.reckoningValueLabel;
    public transactionListLabel = glob.transactionListLabel;
    public minCharMaxCharLabel = glob.minCharMaxCharLabel;
    public cancelCauseLabel = glob.cancelCauseLabel;
    public discountSource = glob.discountSource;
    public discountType = glob.discountType;
    public tempCode = glob.tempCode;
    public loginCode = glob.loginCode;
    public clientNameLabel = glob.clientNameLabel;
    public expertNameLabel = glob.expertNameLabel;
    public requestTypeLabel = glob.requestTypeLabel;
    public factorPriceLabel = glob.factorPriceLabel;
    public showBillLabel = glob.showBillLabel;
    public sellerInfoLabel = glob.sellerInfoLabel;
    public buyerInfoLabel = glob.buyerInfoLabel;
    public productInfoLabel = glob.productInfoLabel;
    public billInfoLabel = glob.billInfoLabel;
    public indexLabel = glob.indexLabel;
    public serviceTypeLabel = glob.serviceTypeLabel;
    public orderLabel = glob.orderLabel;
    public valueAddedLabel = glob.valueAddedLabel;
    public totalLabel2 = glob.totalLabel2;
    public totalTaxValueAdded = glob.totalTaxValueAdded;
    public totalx = glob.totalx;
    public bondLabel = glob.bondLabel;
    public offerBlockLabel = glob.offerBlockLabel;
    public offerSendLabel = glob.offerSendLabel;
}