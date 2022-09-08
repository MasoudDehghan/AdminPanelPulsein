import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { DiscountUsage } from 'app/pEntites/discountUsage.class';
import { RequestP } from 'app/pEntites/requestP.class';
import { ExcelService } from 'app/services/excel.service';
import { environment } from 'environments/environment';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { ConfirmationService } from 'primeng/api';
import { DataTable, SelectItem } from 'primeng/primeng';
import { BasicData } from '../../entities/basicData.class';
import { City } from '../../entities/city.class';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { JobCategory1 } from '../../entities/JobCategory1.class';
import { JobCategory2 } from '../../entities/JobCategory2.class';
import { JobCategory3 } from '../../entities/JobCategory3.class';
import { BackendMessage } from '../../entities/Msg.class';
import { TownShip } from '../../entities/township.class';
import { DiscountDetail } from '../../pEntites/discountDetail.class';
import { DiscountV } from '../../pEntites/discountV.class';
import { DiscountService } from '../../services/discount.service';
import { GeoService } from '../../services/geo.service';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { DiscountFilterSearchResult } from './../../entities/discountSearchResult.class';
import { DiscountSource } from './../../enums/discountSource.enum';
import { DiscountType } from './../../enums/discountType.enum';
import { UserRoleEnum } from './../../enums/userRole.enum';
import { DiscountSearch } from './../../pEntites/discountSearch.class';
import { JobCateogryService } from './../../services/jobCategory.service';
import { RequestMgmService } from './../../services/requestMgm.service';
import { Constant } from './../../shared/constants.class';

@Component({
  selector: 'app-discount-code-mgm',
  templateUrl: './discount-code-mgm.component.html',
  styleUrls: ['./discount-code-mgm.component.css', '../../../assets/css/dashboard.css'],
  providers: [DiscountService, RequestMgmService, ExcelService, JobCateogryService, GeoService]
})
export class DiscountCodeMgmComponent implements OnInit {
  form: FormGroup;
  editForm: FormGroup;
  hmsgs: GrowlMessage[] = [];
  loading: boolean = false;
  activeLabel: string = this.shared.discountCodeMGMLabel;
  errorCntrler: HandleErrorMsg;
  discountItems: DiscountV[] = [];
  discountDataLoadedMap: Map<number, boolean> = new Map<number, boolean>();
  showDiscountList: boolean = false;
  discountItemsLength: number = 0;
  showErrorMsg: boolean = false;
  displayRegisterDialog: boolean = false;
  newDiscount: DiscountV = new DiscountV();
  basicData: BasicData;
  jobCategory2List: SelectItem[] = [];
  editJobCategory2List: SelectItem[] = [];
  jobCategory3List: SelectItem[] = [];
  editJobCategory3List: SelectItem[] = [];
  discountSourceList: SelectItem[] = [];
  discountTypeList: SelectItem[] = [];
  displayDiscountView: boolean = false;
  displayRequestView = false;
  displayDiscountUsage = false;
  displayDiscountEdit: boolean = false;
  displayDisountFilter: boolean = false;
  displayImageDialog = false;
  selectedImagePath: string;
  selectedDiscount: DiscountV = new DiscountV();
  selectedRequestCode: string;
  selectedRequestP: RequestP;
  selectedDiscountUsage: DiscountUsage[] = [];
  jobCategory2Map: Map<number, JobCategory2> = new Map<number, JobCategory2>();
  jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();

  selectedClientMobileNumber: string = null;
  selectedJobCategory1: JobCategory1 = null;
  selectedJobCategory1ID: number = null;
  selectedJobCategory2: JobCategory2 = null;
  selectedJobCategory2ID: number = null;
  selectedJobCategory3: JobCategory3 = null;
  selectedJobCategory3ID: number = null;

  townshipList: SelectItem[] = [];
  cityList: SelectItem[] = [];
  editCityList: SelectItem[] = [];
  selectedProvinceID: number = Constant.defaultProvinceID;
  selectedTownshipID: number = Constant.defaultTownshipID;
  selectedCityID: number = Constant.tehranCityID;
  selectedCity: City = new City();

  datePickerConfig = {
    drops: 'up',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo: 'body'
  };
  datePickerConfig2 = {
    drops: 'up',
    format: 'YYYY-MM-DD HH:mm:ss',
    appendTo: 'body'
  };
  endTime: Moment;
  endTimeStr: string;
  endTimeError: boolean = false;
  loadingDialog: boolean = false;

  filteredCode: string;
  filteredDiscountType: number;
  filteredActive: boolean;
  filteredMultyUse: boolean;
  filteredEndTimeStart: string;
  filteredEndTimeEnd: string;
  filteredPercentRange: number[] = [];
  filteredMaxCreditRange: number[] = [];
  filteredTotalCntRange: number[] = [];
  filteredUsedCntRange: number[] = [];
  filteredCat2Id: number;
  filteredCat2Name: string;
  filteredCat3Id: number;
  filteredCat3Name: string;
  filteredProvinceId: number;
  filteredCityId: number;
  filteredDiscription: string;
  filteredRegisterTimeStart: string;
  filteredRegisterTimeEnd: string;
  selectedFilter: DiscountSearch;
  discountSearch: DiscountSearch = new DiscountSearch();

  chipsFilterValues: string[] = [];
  chipsFilterMap: Map<string, string> = new Map<string, string>();
  @ViewChild('dt') public dataTable: DataTable;

  discountItemType: string = "single";
  numberOfMultipleDiscountItem: number = 2;
  editCapable: boolean = false;
  discountSource = DiscountSource;
  discountType = DiscountType;
  selectedDiscountType: DiscountType = DiscountType.Normal;

  uploadURL: string;
  uploadedImageName: string = "";
  uploadedFiles: any[] = [];
  baseImagePath = environment.fileServerUrl;
  selectedUserImagePath: string = "";
  displayProfileImageDialog: boolean = false;

  constructor(private _router: Router,
    public shared: SharedValues,
    private _fb: FormBuilder,
    private excelService: ExcelService,
    private _geoService: GeoService,
    private confirmationService: ConfirmationService,
    private _jService: JobCateogryService,
    public discountService: DiscountService,
    private requestMgmService: RequestMgmService) {
    this.errorCntrler = new HandleErrorMsg(_router)

  }

  ngOnInit() {
    this.basicData = JSON.parse(localStorage.getItem('basicData'));
    let token: String = sessionStorage.getItem('token');
    this.uploadURL = environment.apiUrl + "/upload/img/" + token;
    this.selectedUserImagePath = "";

    this.newDiscount = new DiscountV();
    this.newDiscount.detail = new DiscountDetail();

    this.initJobCategory2List();
    this.initJobCategory3List();
    this.initTownshipList();
    this.initCityList();


    this.discountSourceList = [];
    this.discountSourceList.push({ label: 'Pulsein', value: this.discountSource.Pulsein });
    this.discountSourceList.push({ label: 'Netbarg', value: this.discountSource.Netbarg });
    this.discountSourceList.push({ label: 'Takhfifan', value: this.discountSource.Takhfifan });
    this.discountSourceList.push({ label: 'Mopon', value: this.discountSource.Mopon });
    this.discountSourceList.push({ label: 'TopCoppon', value: this.discountSource.TopCoppon });
    this.discountSourceList.push({ label: 'OffChannel', value: this.discountSource.OffChannel });

    this.discountTypeList = [];
    this.discountTypeList.push({ label: 'نرمال', value: this.discountType.Normal });
    this.discountTypeList.push({ label: 'عمومی', value: this.discountType.General });
    this.discountTypeList.push({ label: 'اولین درخواست کاربر', value: this.discountType.FirstUse });


    this.form = this._fb.group({
      discountType: [''],
      type: [''],
      code: [''],
      discountItemCnt: [''],
      jobCategory1FormCntrl: [''],
      jobCategory2FormCntrl: [''],
      jobCategory3FormCntrl: [''],
      clientUserListFormCntrl: [''],
      percent: ['', Validators.compose([Validators.required, Validators.pattern(Constant.percentRegx)])],
      maxCredit: ['', Validators.required],
      totalCnt: [''],
      province: [''],
      township: [''],
      city: [''],
      description: ['', Validators.required],
      multiUse: [''],
      active: ['', Validators.required],
      endTime: [''],
      discountSource: [0]
    });

    this.editForm = this._fb.group({
      discountType: [''],
      jobCategory1FormCntrl: [''],
      jobCategory2FormCntrl: [''],
      jobCategory3FormCntrl: [''],
      clientUserListFormCntrl: [''],
      percent: [''],
      maxCredit: [''],
      totalCnt: [''],
      province: new FormControl(''),
      township: new FormControl(''),
      city: new FormControl(''),
      description: [''],
      multiUse: [''],
      active: [''],
      endTime: [''],
      discountSource: ['']
    });

    let loggedInRole = Number(sessionStorage.getItem("roleId"));
    this.editCapable = false;
    if (loggedInRole == UserRoleEnum.SysAdmin
      || loggedInRole == UserRoleEnum.Operator_H)
      this.editCapable = true;
    this.rtvList();
  }

  onSubmitRegisterform() {
    try {
      if (!this.form.valid) {
        this.validateAllFormFields(this.form);
        return;
      }
      if (this.selectedDiscountType == DiscountType.Normal) {
        if (this.endTime) {
          try {
            this.newDiscount.endTime = moment(this.endTime).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            this.endTimeError = false;
          }
          catch (ex) {
            this.endTimeError = true;

          }
        }
        else
          this.endTimeError = true;

      }

      if (this.selectedDiscountType == DiscountType.General || this.selectedDiscountType == DiscountType.FirstUse) {
        if (this.selectedJobCategory1) {
          if (!this.selectedJobCategory2) {
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidJobcat2Msg });
            return;
          }
        }
        else {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidJobcat1Msg });
          return;
        }
        if (!this.uploadedImageName) {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.imageNotSent });
          return;
        }
        else {
          this.newDiscount.detail.image = this.uploadedImageName;
        }
      }

      if (this.selectedJobCategory1)
        this.newDiscount.detail.cat1Id = this.selectedJobCategory1.id;
      if (this.selectedJobCategory2)
        this.newDiscount.detail.cat2Id = this.selectedJobCategory2.id;
      if (this.selectedJobCategory3)
        this.newDiscount.detail.cat3Id = this.selectedJobCategory3.id;




      if (this.selectedProvinceID != 0)
        this.newDiscount.detail.provinceId = this.selectedProvinceID;
      if (this.selectedCityID != 0) {
        this.selectedCityID = this.selectedCity.id;
        this.newDiscount.detail.cityId = this.selectedCityID;
      }
      if (this.selectedDiscountType == DiscountType.General) {
        if (this.selectedClientMobileNumber) {
          this.newDiscount.detail.userMobileNumber = this.selectedClientMobileNumber;
        }

      }


      let __discountItems = [...this.discountItems];

      this.loading = true;
      if (this.discountItemType == 'single') {
        this.discountService.register(this.newDiscount).subscribe(response => {
          let discount = <DiscountV>response;
          __discountItems.push(discount);
          this.discountItems = __discountItems;
          this.discountItemsLength = this.discountItems.length;

          this.loading = false;
          this.displayRegisterDialog = false;
        }, error => {
          console.log(error);
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
          this.loading = false;
        });
      }
      else {
        if (this.numberOfMultipleDiscountItem <= 1) {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.groupDiscountError });
          return;
        }
        this.discountService.registerMultiple(this.newDiscount, this.numberOfMultipleDiscountItem).subscribe(response => {
          this.loading = false;
          this.displayRegisterDialog = false;
          this.rtvList();
        }, error => {
          console.log(error);
          let err: BackendMessage = error.error;
          this.parseError(error.status, err);
          this.loading = false;
        });
      }

    }
    catch (e) {
      console.log(e);
    }
  }

  onSubmitEditform() {
    try {
      this.hmsgs = [];
      if (!this.editForm.valid) {
        this.validateAllFormFields(this.editForm);
        return;
      }

      if (this.selectedDiscountType == DiscountType.Normal) {
        if (this.endTime) {
          try {
            this.selectedDiscount.endTime = moment(this.endTime).locale('fa').format('YYYY/MM/DD HH:mm:ss');
            this.endTimeError = false;
          }
          catch (ex) {
            this.endTimeError = true;

          }
        }
        else
          this.endTimeError = true;

      }

      if (this.selectedDiscountType == DiscountType.FirstUse ||
        this.selectedDiscountType == DiscountType.General) {

        if (this.selectedDiscount.detail.image == null) {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.imageNotSent });
          return;
        }
        if (this.selectedDiscount.detail.image == '') {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.imageNotSent });
          return;
        }
        if (this.uploadedImageName != null) {
          if (this.uploadedImageName != '')
            this.selectedDiscount.detail.image = this.uploadedImageName;
        }
        if (this.selectedJobCategory1ID) {
          if (!this.selectedJobCategory2ID) {
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidJobcat2Msg });
            return;
          }
        }
        else {
          this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.InnerCode_InvalidJobcat1Msg });
          return;
        }
      }


      if (this.selectedJobCategory1ID)
        this.selectedDiscount.detail.cat1Id = this.selectedJobCategory1ID;

      if (this.selectedJobCategory2ID)
        this.selectedDiscount.detail.cat2Id = this.selectedJobCategory2ID;

      if (this.selectedJobCategory3ID)
        this.selectedDiscount.detail.cat3Id = this.selectedJobCategory3ID;

      if (this.selectedDiscountType == DiscountType.General && this.selectedClientMobileNumber)
        this.selectedDiscount.detail.userMobileNumber = this.selectedClientMobileNumber;




      let discountItems = [...this.discountItems];

      this.loading = true;
      this.discountService.edit(this.selectedDiscount).subscribe(response => {
        let discount = <DiscountV>response;
        discountItems[this.findDiscountIndex(this.selectedDiscount)] = discount;
        this.discountItems = discountItems;
        this.loading = false;
        this.displayDiscountEdit = false;
      }, error => {
        console.log(error);
        let err: BackendMessage = error.error;
        this.parseError(error.status, err);
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
  }
  onDiscountTypeChange(event) {
    console.log(event.value);
    this.selectedDiscountType = event.value;
  }
  onJobCategory1Change(event: any) {
    this.selectedJobCategory1 = event.value;
    // this.selectedJobCategory2 = new JobCategory2();
    // this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory2List();
    this.initJobCategory3List();
  }
  onJobCategory1EditChange(event: any) {
    this.selectedJobCategory1ID = event.value;
    this.selectedJobCategory2 = new JobCategory2();
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory2List();
    this.initJobCategory3List();
  }
  onJobCategory2Change(event: any) {
    this.selectedJobCategory2 = event.value;
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory3List();
  }
  onJobCategory2EditChange(event: any) {
    this.selectedJobCategory2ID = event.value;
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory3List();
  }
  initJobCategory2List() {
    this.jobCategory2List = [];
    this.editJobCategory2List = [];
    this.jobCategory2Map.clear();
    this.jobCategory2List.push({ label: this.shared.chooseJC2Msg, value: null });
    this.editJobCategory2List.push({ label: this.shared.chooseJC2Msg, value: null });
    let jc1ID = this.selectedJobCategory1ID;
    if (this.selectedJobCategory1 != null) {
      if (this.selectedJobCategory1.id != undefined) {
        if (this.selectedJobCategory1.id != 0) {
          jc1ID = this.selectedJobCategory1.id
        }
      }
    }

    if (jc1ID != 0 && jc1ID != null) {

      this._jService.geJobCategory2List(jc1ID)
        .subscribe(response => {
          let list: JobCategory2[] = <JobCategory2[]>response;
          list.forEach(element => {
            this.jobCategory2Map.set(element.id, element);
            this.jobCategory2List.push({ label: element.name, value: element });
            this.editJobCategory2List.push({ label: element.name, value: element.id });

          });

        }
          , error => {
            let obj: JobCategory2[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
          }
        );
    }

  }


  initJobCategory2ListX(_id: number) {
    this.editJobCategory2List = [];
    this.editJobCategory2List.push({ label: this.shared.chooseJC2Msg, value: null });
    let jc1ID = this.selectedJobCategory1ID;


    this._jService.geJobCategory2List(jc1ID)
      .subscribe(response => {
        let list: JobCategory2[] = <JobCategory2[]>response;
        list.forEach(element => {
          this.editJobCategory2List.push({ label: element.name, value: element.id });

        });
        this.selectedJobCategory2ID = _id;

      }
        , error => {
          let obj: JobCategory2[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
      );

  }


  initJobCategory3List() {
    this.jobCategory3List = [];
    this.editJobCategory3List = [];
    this.jobCategory3Map.clear();
    this.jobCategory3List.push({ label: this.shared.allJC3Label, value: null });
    this.editJobCategory3List.push({ label: this.shared.chooseJC2Msg, value: 0 });
    let jc2ID = this.selectedJobCategory2ID;
    if (this.selectedJobCategory2 != null) {
      if (this.selectedJobCategory2.id != undefined) {
        if (this.selectedJobCategory2.id != 0) {
          jc2ID = this.selectedJobCategory2.id
        }
      }
    }
    if (jc2ID != 0 && jc2ID != null) {
      this._jService.geJobCategory3List(jc2ID)
        .subscribe(response => {
          let list: JobCategory3[] = <JobCategory3[]>response;
          list.forEach(element => {
            this.jobCategory3Map.set(element.id, element);
            this.jobCategory3List.push({ label: element.name, value: element });
            this.editJobCategory3List.push({ label: element.name, value: element.id });
          });

        }
          , error => {
            let obj: JobCategory3[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
          }
        );
    }

  }
  initJobCategory3ListX(_jc2: number, _id: number) {
    this.editJobCategory3List = [];
    this.editJobCategory3List.push({ label: this.shared.chooseJC3Msg, value: 0 });

    this._jService.geJobCategory3List(_jc2)
      .subscribe(response => {
        let list: JobCategory3[] = <JobCategory3[]>response;
        list.forEach(element => {
          this.editJobCategory3List.push({ label: element.name, value: element.id });
        });
        this.selectedJobCategory3ID = _id;

      }
        , error => {
          let obj: JobCategory3[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
      );

  }
  initTownshipList() {
    this.townshipList = [];
    this.townshipList.push({ label: this.shared.chooseTownshipMsg, value: 0 });
    if (this.selectedProvinceID != 0) {
      this._geoService.geTownshipList(this.selectedProvinceID)
        .subscribe(response => {
          let list: TownShip[] = <TownShip[]>response;
          list.forEach(element => {
            this.townshipList.push({ label: element.name, value: element.id });
          });
        }
          , error => {
            let obj: TownShip[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
          }
        );
    }
  }

  initCityList() {
    this.cityList = [];
    this.editCityList = [];
    this.cityList.push({ label: this.shared.chooseCityMsg, value: 0 });
    this.editCityList.push({ label: this.shared.chooseCityMsg, value: 0 });
    if (this.selectedTownshipID != 0) {
      this._geoService.geCityList(this.selectedTownshipID)
        .subscribe(response => {
          let list: City[] = <City[]>response;
          list.forEach(element => {
            this.cityList.push({ label: element.name, value: element });
            this.editCityList.push({ label: element.name, value: element.id });
          });
          this.selectedCity = list[0];

        }
          , error => {
            let obj: City[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
          }
        );
    }
  }
  onProvinceChange(event: any) {
    this.selectedProvinceID = event.value;
    this.selectedTownshipID = 0;
    this.townshipList = [];
    this._geoService.geTownshipList(this.selectedProvinceID)
      .subscribe(response => {
        let list: TownShip[] = <TownShip[]>response;
        list.forEach(element => {
          this.townshipList.push({ label: element.name, value: element.id });
        });
        this.selectedTownshipID = this.townshipList[0].value;
        this.initCityList();

      }
        , error => {
          let obj: TownShip[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
      );
  }
  onTownshipChange(event: any) {
    try {
      this.selectedTownshipID = event.value;
      this.initCityList();
    }
    catch (e) {
      console.log(e);
    }
  }
  onCityChange(event: any) {
    this.selectedCity = event.value;
    this.selectedCityID = this.selectedCity.id;

  }
  onEditCityChange(event: any) {
    this.selectedCityID = event.value;
  }
  showDialogToAdd() {
    this.form.clearValidators();
    this.form.markAsUntouched();
    this.form.clearAsyncValidators();
    this.form.reset();
    this.selectedClientMobileNumber = null;
    this.selectedJobCategory1 = null;
    this.selectedJobCategory1ID = null;
    this.selectedJobCategory2 = null;
    this.selectedJobCategory2ID = null;
    this.selectedJobCategory3 = null;
    this.selectedProvinceID = Constant.defaultProvinceID;
    this.selectedTownshipID = Constant.defaultTownshipID;
    this.selectedCityID = Constant.tehranCityID;
    this.endTime = undefined;
    this.discountItemType = "single";
    this.newDiscount = new DiscountV();
    this.newDiscount.detail = new DiscountDetail();
    this.displayRegisterDialog = true;
    this.endTimeError = false;
    this.uploadedImageName = null;
    this.uploadedFiles = [];
    this.selectedDiscountType = DiscountType.Normal;
    this.initTownshipList();
    this.initCityList();
  }
  showDialogToEdit(discount: DiscountV) {
    this.selectedJobCategory1ID = null;
    this.selectedJobCategory2ID = null;
    this.selectedJobCategory3ID = null;
    this.selectedClientMobileNumber = null;
    this.uploadedImageName = null;
    this.uploadedFiles = [];
    let id = discount.id;
    this.discountService.lookupByID(id).subscribe(result => {

      this.loadingDialog = true;
      this.selectedDiscount = <DiscountV>result;

      if (this.selectedDiscount.endTime != null && this.selectedDiscount.endTime != undefined) {
        this.endTime = moment(this.selectedDiscount.endTime, 'jYYYY-jMM-jDD HH:mm:ss');
      }
      if (this.selectedDiscount.detail.userMobileNumber)
        this.selectedClientMobileNumber = this.selectedDiscount.detail.userMobileNumber;
      this.editJobCategory2List = [];
      this.editJobCategory3List = [];

      if (this.selectedDiscount.detail.cat1Id) {
        this.selectedJobCategory1ID = this.selectedDiscount.detail.cat1Id;
        if (this.selectedDiscount.detail.cat2Id) {
          this.initJobCategory2ListX(this.selectedDiscount.detail.cat2Id);
          if (this.selectedDiscount.detail.cat3Id) {
            this.initJobCategory3ListX(this.selectedDiscount.detail.cat2Id, this.selectedDiscount.detail.cat3Id);
          }
        }
      }
      if (this.selectedDiscount.detail.provinceId) {
        this.initTownshipList();
        if (this.selectedDiscount.detail.townshipId)
          this.initCityList();
      }
      this.selectedDiscountType = this.selectedDiscount.detail.type;
      this.selectedUserImagePath = this.baseImagePath + "/" + this.selectedDiscount.detail.image;

      this.displayDiscountEdit = true;


    }, error => {
      this.displayDiscountEdit = false;
      this.loadingDialog = false;
      let err: BackendMessage = error.error;
      let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
      let errorMessages = this.errorCntrler.gMessage;
      this.hmsgs = errorMessages;
    });

  }
  onShowImageD(event) {
    this.displayProfileImageDialog = true;
    this.selectedUserImagePath = event;
  }
  showProfileImage() {
    this.displayProfileImageDialog = true;
  }
  deleteProfileImage() {
    this.selectedUserImagePath = "";
    if (this.selectedDiscount) {
      this.selectedDiscount.detail.image = null;
    }
  }
  showDiscountDetail(discount: DiscountV) {
    let id = discount.id;
    this.loadingDialog = true;
    this.displayDiscountView = true;
    this.discountService.lookupByID(id).subscribe(result => {
      this.selectedDiscount = <DiscountV>result;
      this.loadingDialog = false;
    }, error => {
      console.log(error);
      this.displayDiscountView = false;
      this.loadingDialog = false;
      let err: BackendMessage = error.error;
      let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
      let errorMessages = this.errorCntrler.gMessage;
      this.hmsgs = errorMessages;
    });
  }
  showDiscountUsage(discount: DiscountV) {
    this.selectedDiscountUsage = [];
    this.selectedDiscount = discount;
    let id = discount.id;
    this.loadingDialog = true;
    this.displayDiscountUsage = true;
    this.discountService.getUsageReport(id).subscribe(result => {
      console.log(result);
      this.selectedDiscountUsage = <DiscountUsage[]>result;
      this.loadingDialog = false;
    }, error => {
      this.displayDiscountUsage = false;
      this.loadingDialog = false;
      let err: BackendMessage = error.error;
      let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
      let errorMessages = this.errorCntrler.gMessage;
      this.hmsgs = errorMessages;
    });
  }

  showRequestDetail(requestID: number, requestCode: string) {
    let id = requestID;
    this.loadingDialog = true;
    this.displayRequestView = true;
    this.selectedRequestCode = requestCode;
    this.requestMgmService.lookupByIdP(id).subscribe(result => {
      this.selectedRequestP = <RequestP>result;
      this.loadingDialog = false;
    }, error => {
      this.displayRequestView = false;
      this.loadingDialog = false;

      let obj: RequestP = error.error;
      let err: BackendMessage = obj.error;
      this.parseError(error.status, err);
    });
  }

  onShowImage(event) {
    this.displayImageDialog = true;
    this.selectedImagePath = event;
  }

  parseError(status: any, err: any) {
    this.errorCntrler.gMessage = [];
    this.hmsgs = [];
    let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err.error);
    let errorMessages = this.errorCntrler.gMessage;
    errorMessages.forEach(element => {
      this.hmsgs.push(element);
    });
  }
  rtvList() {
    this.chipsFilterMap.clear();
    this.chipsFilterValues = [];
    let serachInput: DiscountSearch = new DiscountSearch();
    this.loading = true;
    this.discountService.search(serachInput)
      .subscribe(response => {
        this.showDiscountList = true;
        this.discountItems = <DiscountV[]>response;
        this.discountItemsLength = this.discountItems.length;
        this.loading = false;

      }
        , error => {
          console.log(error);
          this.showErrorMsg = true;
          this.showDiscountList = false;
          this.hmsgs = [];
          this.errorCntrler.gMessage = [];
          let err: BackendMessage = error.error;
          let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
          let errorMessages = this.errorCntrler.gMessage;
          this.hmsgs = errorMessages;
          this.loading = false;
        }
      );
  }
  delete(discount: DiscountV) {
    this.confirmationService.confirm({
      message: this.shared.confirmText,
      accept: () => {
        this.loading = true;
        this.discountService.delete(discount.id)
          .subscribe(response => {
            this.loading = false;
            let index = this.findDiscountIndex(discount);
            this.discountItems = this.discountItems.filter((val, i) => i != index);

            this.discountItemsLength = this.discountItems.length;

            this.hmsgs = [];
            this.hmsgs.push({ severity: 'info', summary: '', detail: this.shared.successFullChangeMsg });
          },
            error => {
              let err: BackendMessage = error.error;
              this.parseError(error.status, err);
              this.loading = false;
            });
      }
    });


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

  showFilterDialog() {
    this.displayDisountFilter = true;

  }
  onSearchFilterPanel(event) {
    try {
      this.displayDisountFilter = false;
      let data: DiscountFilterSearchResult = event;
      let __discountList = [...this.discountItems];

      __discountList = data.discounts;
      this.discountItems = __discountList;
      this.discountDataLoadedMap.clear();
      this.discountItems.forEach(element => {
        this.discountDataLoadedMap.set(element.id, true);
      });
      this.discountItemsLength = data.totalSize;
      this.selectedFilter = data.discountSearch;
      this.discountSearch = this.selectedFilter;
      this.filteredActive = data.selectedActive;
      this.filteredCat2Id = data.selectedCat2Id;
      this.filteredCat2Name = data.selectedCat2Name;
      this.filteredCat3Id = data.selectedCat3Id;
      this.filteredCat3Name = data.selectedCat3Name;
      this.filteredCityId = data.selectedCityId;
      this.filteredCode = data.selectedCode;
      this.filteredDiscountType = data.selectedType;
      this.filteredDiscription = data.selectedDescription;
      this.filteredEndTimeEnd = data.selectedEndTimeEnd;
      this.filteredEndTimeStart = data.selectedEndTimeEnd;
      this.filteredMaxCreditRange = data.selectedMaxCreditRange;
      this.filteredMultyUse = data.selectedMultyUse;
      this.filteredPercentRange = data.selectedPercentRange;
      this.filteredProvinceId = data.selectedProvinceId;
      this.filteredRegisterTimeEnd = data.selectedRegisterTimeEnd;
      this.filteredRegisterTimeStart = data.selectedRegisterTimeStart;
      this.filteredTotalCntRange = data.selectedTotalCntRange;
      this.filteredUsedCntRange = data.selectedUsedCntRange;

      this.displayDisountFilter = false;
      this.chipsFilterMap.clear();
      this.chipsFilterValues = [];

      if (this.selectedFilter.f_type) {
        let type: number = data.selectedType;
        this.chipsFilterMap.set(this.shared.discountType + " : " + type, "f_type");
        this.chipsFilterValues.push(this.shared.discountType + " : " + type);
      }

      if (this.selectedFilter.f_code) {
        let code: string = data.selectedCode;
        this.chipsFilterMap.set(this.shared.codeLabel + " : " + code, "f_code");
        this.chipsFilterValues.push(this.shared.codeLabel + " : " + code);
      }
      if (this.selectedFilter.f_description) {
        let description: string = data.selectedDescription;
        this.chipsFilterMap.set(this.shared.descLabel + " : " + description, "f_description");
        this.chipsFilterValues.push(this.shared.descLabel + " : " + description);
      }
      if (this.selectedFilter.f_percent) {
        let amount: string = data.selectedPercentRange[0] + "-" + data.selectedPercentRange[1];
        this.chipsFilterMap.set(this.shared.discountPercentPeriodLabel + " : " + amount, "f_percent");
        this.chipsFilterValues.push(this.shared.discountPercentPeriodLabel + " : " + amount);
      }
      if (this.selectedFilter.f_maxCredit) {
        let amount: string = data.selectedMaxCreditRange[0] + "-" + data.selectedMaxCreditRange[1];
        this.chipsFilterMap.set(this.shared.maxCreditPeriodLabel + " : " + amount, "f_maxCredit");
        this.chipsFilterValues.push(this.shared.maxCreditPeriodLabel + " : " + amount);
      }
      if (this.selectedFilter.f_totalCnt) {
        let amount: string = data.selectedTotalCntRange[0] + "-" + data.selectedTotalCntRange[1];
        this.chipsFilterMap.set(this.shared.totalCounterPeriodLabel + " : " + amount, "f_totalCnt");
        this.chipsFilterValues.push(this.shared.totalCounterPeriodLabel + " : " + amount);
      }
      if (this.selectedFilter.f_usedCnt) {
        let amount: string = data.selectedUsedCntRange[0] + "-" + data.selectedUsedCntRange[1];
        this.chipsFilterMap.set(this.shared.usedCounterPeriodLabel + " : " + amount, "f_usedCnt");
        this.chipsFilterValues.push(this.shared.usedCounterPeriodLabel + " : " + amount);
      }
      if (this.selectedFilter.f_active) {
        let active: boolean = data.selectedActive;
        this.chipsFilterMap.set(this.shared.activeLabel + " : " + active, "f_active");
        this.chipsFilterValues.push(this.shared.activeLabel + " : " + active);
      }
      if (this.selectedFilter.f_cat2Id) {
        //let cat2ID: number = data.selectedCat2Id;
        let cat2Name: string = data.selectedCat2Name;
        this.chipsFilterMap.set(this.shared.job_Category2Label + " : " + cat2Name, "f_cat2Id");
        this.chipsFilterValues.push(this.shared.job_Category2Label + " : " + cat2Name);
      }
      if (this.selectedFilter.f_cat3Id) {
        //let cat3ID: number = data.selectedCat3Id;
        let cat3Name: string = data.selectedCat3Name;
        this.chipsFilterMap.set(this.shared.job_Category3Label + " : " + cat3Name, "f_cat3Id");
        this.chipsFilterValues.push(this.shared.job_Category3Label + " : " + cat3Name);
      }
      if (this.selectedFilter.f_cityId) {
        let cityId: number = data.selectedCityId;
        this.chipsFilterMap.set(this.shared.cityLabel + " : " + cityId, "f_cityId");
        this.chipsFilterValues.push(this.shared.cityLabel + " : " + cityId);
      }
      if (this.selectedFilter.f_provinceId) {
        let provinceID: number = data.selectedProvinceId;
        this.chipsFilterMap.set(this.shared.provinceLabel + " : " + provinceID, "f_provinceId");
        this.chipsFilterValues.push(this.shared.provinceLabel + " : " + provinceID);
      }
      if (this.selectedFilter.f_registerTime) {
        let registerTime: string = data.selectedRegisterTimeStart + "--------------------" + data.selectedRegisterTimeEnd;
        this.chipsFilterMap.set(this.shared.registerPeriodTimeLabel + " : " + registerTime, "f_registerTime");
        this.chipsFilterValues.push(this.shared.registerPeriodTimeLabel + " : " + registerTime);
      }
      if (this.selectedFilter.f_endTime) {
        let endTime: string = data.selectedEndTimeStart + "--------------------" + data.selectedEndTimeEnd;
        this.chipsFilterMap.set(this.shared.endTimePeriodLabel + " : " + endTime, "f_endTime");
        this.chipsFilterValues.push(this.shared.endTimePeriodLabel + " : " + endTime);
      }

    }
    catch (e) {
      console.log(e);
    }

  }
  onRemoveChip(event) {
    let selectedChipFilter: string = this.chipsFilterValues[event];
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_type') {
      this.selectedFilter.f_type = false;
      this.selectedFilter.type = null;
      this.filteredDiscountType = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_code') {
      this.selectedFilter.f_code = false;
      this.selectedFilter.code = null;
      this.filteredCode = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_description') {
      this.selectedFilter.f_description = false;
      this.selectedFilter.description = null;
      this.filteredDiscription = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_percent') {
      this.selectedFilter.f_percent = false;
      this.filteredPercentRange = [];
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_maxCredit') {
      this.selectedFilter.f_maxCredit = false;
      this.filteredMaxCreditRange = [];
    }

    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_totalCnt') {
      this.selectedFilter.f_totalCnt = false;
      this.filteredTotalCntRange = [];
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_usedCnt') {
      this.selectedFilter.f_usedCnt = false;
      this.filteredUsedCntRange = [];

    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_active') {
      this.selectedFilter.f_active = false;
      this.filteredActive = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cat2Id') {
      this.selectedFilter.f_cat2Id = false;
      this.filteredCat2Id = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cat3Id') {
      this.selectedFilter.f_cat3Id = false;
      this.filteredCat3Id = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_cityId') {
      this.selectedFilter.f_cityId = false;
      this.filteredCityId = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_provinceId') {
      this.selectedFilter.f_provinceId = false;
      this.filteredProvinceId = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_registerTime') {
      this.selectedFilter.f_registerTime = false;
      this.filteredRegisterTimeStart = null;
      this.filteredRegisterTimeEnd = null;
    }
    if (this.chipsFilterMap.get(selectedChipFilter) == 'f_endTime') {
      this.selectedFilter.f_endTime = false;
      this.filteredEndTimeStart = null;
      this.filteredEndTimeStart = null;
    }
    this.loading = true;
    this.discountDataLoadedMap.clear();
    this.discountItems = [];
    let __discounts = [...this.discountItems];
    this.discountSearch = this.selectedFilter;

    this.discountService.search(this.selectedFilter).subscribe(response => {
      this.discountItems = [];
      let discounts = <DiscountV[]>response;
      discounts.forEach(element => {
        __discounts.push(element);
        this.discountDataLoadedMap.set(element.id, true);
      });
      this.discountItemsLength = discounts.length;
      this.displayDisountFilter = false;
      this.chipsFilterValues.splice(event, 1);
      this.chipsFilterMap.delete(selectedChipFilter);
      this.discountItems = __discounts;
      this.loading = false;
    }, error => {
      let err: BackendMessage = error.error;
      let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
      let errorMessages = this.errorCntrler.gMessage;
      this.hmsgs = errorMessages;
      this.loading = false;
    });
  }

  exportExcel() {
    let filtered_discounts_json = [];
    if (this.dataTable.filteredValue != undefined) {
      this.dataTable.filteredValue.forEach(discount => {
        let entity = <DiscountV>discount;
        filtered_discounts_json.push(entity);
      });
    }
    else {
      this.discountItems.forEach(dsc => {
        let entity = <DiscountV>dsc;
        filtered_discounts_json.push(entity);
      });
    }
    this.excelService.exportAsExcelFile(filtered_discounts_json, 'filtered_discounts_json');



  }

  findDiscountIndex(discount: DiscountV): number {
    for (let i = 0; i < this.discountItems.length; i++) {
      if (discount.id == this.discountItems[i].id)
        return i;
    }
    return -1;
  }

  onUpload(event: any) {
    let responseMsg: BackendMessage = JSON.parse(event.xhr.responseText);
    this.uploadedImageName = responseMsg.msg[0].msg;
    this.selectedUserImagePath = this.baseImagePath + "/" + this.uploadedImageName;
    for (let file of event.files) {
      this.uploadedFiles.push(file);
    }

  }
}
