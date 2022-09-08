import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { BasicData } from 'app/entities/basicData.class';
import { City } from 'app/entities/city.class';
import { DiscountFilterSearchResult } from 'app/entities/discountSearchResult.class';
import { JobCategory1 } from 'app/entities/JobCategory1.class';
import { JobCategory2 } from 'app/entities/JobCategory2.class';
import { JobCategory3 } from 'app/entities/JobCategory3.class';
import { TownShip } from 'app/entities/township.class';
import { DiscountV } from 'app/pEntites/discountV.class';
import { GeoService } from 'app/services/geo.service';
import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';
import { SelectItem } from 'primeng/primeng';
import { GrowlMessage } from '../../entities/growlMessage.class';
import { BackendMessage } from '../../entities/Msg.class';
import { SharedValues } from '../../services/shared-values.service';
import { HandleErrorMsg } from '../../shared/handleError.class';
import { DiscountType } from './../../enums/discountType.enum';
import { DiscountSearch } from './../../pEntites/discountSearch.class';
import { DiscountService } from './../../services/discount.service';
import { JobCateogryService } from './../../services/jobCategory.service';

@Component({
  selector: 'app-discount-filter',
  templateUrl: './discount-filter.component.html',
  styleUrls: ['./discount-filter.component.css'],
  providers:[JobCateogryService,DiscountService,GeoService]
})
export class DiscountFilterComponent implements OnInit {
  filterForm: FormGroup;
  selectedFilter: DiscountSearch = new DiscountSearch();
  loading = false;
  hmsgs: GrowlMessage[] = [];

  @Input() selectedCode: string = null;
  @Input() selectedType: number = null;
  @Input() selectedActive: boolean = undefined;
  @Input() selectedMultyUse: boolean = undefined;
  @Input() selectedEndTimeStart: string = null;
  @Input() selectedEndTimeEnd: string = null;
  @Input() selectedPercentRange: number[] = [];
  @Input() selectedMaxCreditRange: number[] = [];
  @Input() selectedTotalCntRange: number[] = [];
  @Input() selectedUsedCntRange: number[] = [];
  @Input() selectedCat2Id: number = null;
  @Input() selectedCat3Id: number = null;
  @Input() selectedProvinceId: number = null;
  
  selectedTownshipID: number = null;
  @Input() selectedCityId: number = null;
  selectedCity: City = null;
  @Input() selectedDescription: string = null;
  @Input() selectedRegisterTimeStart: string = null;
  @Input() selectedRegisterTimeEnd: string = null;
  @Input() selectedRegisterBy: number = null;


  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSearch = new EventEmitter<DiscountFilterSearchResult>();

  errorCntrler: HandleErrorMsg;
  msgs: GrowlMessage[] = [];
  discountTypeList: SelectItem[] = [];
  selectedJobCategory1: JobCategory1 = null;
  selectedJobCategory2: JobCategory2 = null;
  selectedJobCategory3: JobCategory3 = null;

  jobCategory2List: SelectItem[] = [];
  jobCategory3List: SelectItem[] = [];
  jobCategory2Map: Map<number, JobCategory2> = new Map<number, JobCategory2>();
  jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();
  basicData: BasicData;
  datePickerConfig = {
    drops: 'down',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo: 'body'
  };
  _registerStartDate: Moment;
  _registerStopDate: Moment;

  _endStartDate: Moment;
  _endStopDate: Moment;

  townshipList: SelectItem[] = [];
  cityList: SelectItem[] = [];

  constructor(private _router: Router, private _fb: FormBuilder,
    public discountMgmService: DiscountService,
    private _jService: JobCateogryService,
    private _geoService: GeoService,
    public shared: SharedValues) { }

  ngOnInit() {
    this.basicData = JSON.parse(localStorage.getItem('basicData'));

    this.discountTypeList = [];
    this.discountTypeList.push({ label: 'لطفا نوع کد تخفیف را تعیین کنید', value: null });
    this.discountTypeList.push({ label: 'نرمال', value: DiscountType.Normal });
    this.discountTypeList.push({ label: 'عمومی', value: DiscountType.General });
    this.discountTypeList.push({ label: 'اولین درخواست کاربر', value: DiscountType.FirstUse });

    this.filterForm = this._fb.group({
      code: [''],
      type:[],
      active: [],
      multyUse: [],
      endTimeStart: [],
      endTimeEnd: [],
      percentState: [],
      percentRange: [],
      maxCreditState: [],
      maxCreditRange: [],
      totalCntState: [],
      totalCntRange: [],
      usedCntState: [],
      usedCntRange: [],
      cat1Id: [],
      cat2Id: [],
      cat3Id: [],
      province: [],
      township:[],
      city: [],
      description: [],
      registerTimeStart: [],
      registerTimeEnd: [],
      registerBy: []
    });

    this.errorCntrler = new HandleErrorMsg(this._router);
    if(this.selectedPercentRange = []){
      this.selectedPercentRange[0] = 0;
      this.selectedPercentRange[1] = 100;      
    }
    if(this.selectedMaxCreditRange = []){
      this.selectedMaxCreditRange[0] = 0;
      this.selectedMaxCreditRange[1] = 1000000;      
    }
    if(this.selectedTotalCntRange = []){
      this.selectedTotalCntRange[0] = 0;
      this.selectedTotalCntRange[1] = 100000;      
    }
    if(this.selectedUsedCntRange = []){
      this.selectedUsedCntRange[0] = 0;
      this.selectedUsedCntRange[1] = 100000;      
    }
  }

  ngAfterViewInit() {

  }
  onJobCategory1Change(event: any) {
    this.selectedJobCategory1 = event.value;
    this.selectedJobCategory2 = new JobCategory2();
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory2List();
    this.initJobCategory3List();
  }
  onJobCategory2Change(event: any) {
    this.selectedJobCategory2 = event.value;
    this.selectedCat2Id = this.selectedJobCategory2.id;
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory3List();
  }
  onJobCategory3Change(event:  any){
    this.selectedJobCategory3 = event.value;
    this.selectedCat3Id = this.selectedJobCategory3.id;
  }
  onSubmitFilterform() {
    try {
      if(this.selectedJobCategory2!=null && this.selectedJobCategory2!=undefined)
        this.selectedCat2Id = this.selectedJobCategory2.id;
      if(this.selectedJobCategory3!=null && this.selectedJobCategory3!=undefined)
        this.selectedCat3Id = this.selectedJobCategory3.id;

      if(this.selectedJobCategory1!=null && (this.selectedCat2Id == null || this.selectedCat2Id == 0 || this.selectedCat2Id == undefined))
      {
        this.hmsgs = [];
        this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.jobCat1OnlySelectedMsg });
        return;
      }

      if (this._registerStartDate != undefined)
        this.selectedRegisterTimeStart = moment(this._registerStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if (this._registerStopDate != undefined)
        this.selectedRegisterTimeEnd = moment(this._registerStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

      if (this._endStartDate != undefined)
        this.selectedEndTimeStart = moment(this._endStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if (this._endStopDate != undefined)
        this.selectedEndTimeEnd = moment(this._endStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');

      if(this.selectedType != null){
        this.selectedFilter.type = this.selectedType;
        this.selectedFilter.f_type = true;
      }

      if (this.selectedCode != null) {
        if (this.selectedCode != '') {
          this.selectedFilter.code = this.selectedCode.replace(' ', '');
          this.selectedFilter.code = this.selectedFilter.code.trim();
          this.selectedFilter.f_code = true;
        }
      }
      if (this.selectedDescription != null) {
        if (this.selectedDescription != '') {
          this.selectedFilter.description = this.selectedDescription;
          this.selectedFilter.f_description = true;
        }
      }

      if (this.selectedRegisterTimeStart != null && this.selectedRegisterTimeEnd != null) {
        if (this.selectedRegisterTimeStart != "" && this.selectedRegisterTimeEnd != "") {
          this.selectedFilter.registerTimeStart = this.selectedRegisterTimeStart;
          this.selectedFilter.registerTimeEnd = this.selectedRegisterTimeEnd;
          this.selectedFilter.f_registerTime = true;
        }
      }

      if (this.selectedEndTimeStart != null && this.selectedEndTimeEnd != null) {
        if (this.selectedEndTimeStart != "" && this.selectedEndTimeEnd != "") {
          this.selectedFilter.endTimeStart = this.selectedEndTimeStart;
          this.selectedFilter.endTimeEnd = this.selectedEndTimeEnd;
          this.selectedFilter.f_endTime = true;
        }
      }

      if (this.selectedRegisterBy != null) {
        if (this.selectedRegisterBy != undefined) {
          this.selectedFilter.registerBy = this.selectedRegisterBy;
          this.selectedFilter.f_registerBy = true;
        }
      }

      if (this.selectedActive != null) {
        if (this.selectedActive != undefined) {
          this.selectedFilter.active = this.selectedActive;
          this.selectedFilter.f_active = true;
        }
      }
      if (this.selectedMultyUse != null) {
        if (this.selectedMultyUse != undefined) {
          this.selectedFilter.multyUse = this.selectedMultyUse;
          this.selectedFilter.f_multyUse = true;
        }
      }

      if (this.selectedFilter.f_percent) {
        if (this.selectedPercentRange.length == 2) {
          this.selectedFilter.percentMin = this.selectedPercentRange[0];
          this.selectedFilter.percentMax = this.selectedPercentRange[1];
        }
      }
      if (this.selectedFilter.f_maxCredit) {
        if (this.selectedMaxCreditRange.length == 2) {
          this.selectedFilter.maxCreditMin = this.selectedMaxCreditRange[0];
          this.selectedFilter.maxCreditMax = this.selectedMaxCreditRange[1];
        }
      }
      if (this.selectedFilter.f_totalCnt) {
        if (this.selectedTotalCntRange.length == 2) {
          this.selectedFilter.totalCntMin = this.selectedTotalCntRange[0];
          this.selectedFilter.totalCntMax = this.selectedTotalCntRange[1];
        }
      }

      if (this.selectedFilter.f_usedCnt) {
        if (this.selectedUsedCntRange.length == 2) {
          this.selectedFilter.usedCntMin = this.selectedUsedCntRange[0];
          this.selectedFilter.usedCntMax = this.selectedUsedCntRange[1];
        }
      }

      if (this.selectedCat2Id != null) {
        if (this.selectedCat2Id != undefined) {
          this.selectedFilter.cat2Id = this.selectedCat2Id;
          this.selectedFilter.f_cat2Id = true;
        }
      }

      if (this.selectedCat3Id != null) {
        if (this.selectedCat3Id != undefined) {
          this.selectedFilter.cat3Id = this.selectedCat3Id;
          this.selectedFilter.f_cat3Id = true;
        }
      }

      if (this.selectedProvinceId != null) {
        if (this.selectedProvinceId != undefined) {
          this.selectedFilter.provinceId = this.selectedProvinceId;
          this.selectedFilter.f_provinceId = true;
        }
      }

      if (this.selectedCityId != null) {
        if (this.selectedCityId != undefined) {
          this.selectedFilter.cityId = this.selectedCityId;
          this.selectedFilter.f_cityId = true;
        }
      }
      this.loading = true;
      this.discountMgmService.search(this.selectedFilter).subscribe(response => {

        let out: DiscountFilterSearchResult = new DiscountFilterSearchResult();

        let discountSeacrhResult: DiscountV[] = <DiscountV[]>response;
        out.discounts = discountSeacrhResult;
        out.totalSize = discountSeacrhResult.length;
        out.discountSearch = this.selectedFilter;
        out.selectedCode = this.selectedCode;
        out.selectedType = this.selectedType;
        out.selectedActive = this.selectedActive;
        out.selectedMultyUse = this.selectedMultyUse;
        out.selectedEndTimeStart = this.selectedEndTimeStart;
        out.selectedEndTimeEnd = this.selectedEndTimeEnd;
        out.selectedCat2Id = this.selectedCat2Id;
        if(this.selectedJobCategory2!=null && this.selectedJobCategory2!=undefined)
          out.selectedCat2Name = this.selectedJobCategory2.name;

        out.selectedCat3Id = this.selectedCat3Id;
        if(this.selectedJobCategory3!=null && this.selectedJobCategory3!=undefined)
          out.selectedCat3Name = this.selectedJobCategory3.name;

        out.selectedDescription = this.selectedDescription;        
        out.selectedMaxCreditMax = this.selectedFilter.maxCreditMax;
        out.selectedMaxCreditMin = this.selectedFilter.maxCreditMin;
        out.selectedMaxCreditRange = this.selectedMaxCreditRange;
        out.selectedPercentMax = this.selectedFilter.percentMax;
        out.selectedPercentMin = this.selectedFilter.percentMin;
        out.selectedPercentRange = this.selectedPercentRange;
        out.selectedProvinceId = this.selectedProvinceId;
        out.selectedCityId = this.selectedCityId;
        out.selectedRegisterBy = this.selectedRegisterBy;
        out.selectedRegisterTimeStart = this.selectedRegisterTimeStart;
        out.selectedRegisterTimeEnd = this.selectedRegisterTimeEnd;
        out.selectedTotalCntMax = this.selectedFilter.totalCntMax;
        out.selectedTotalCntMin = this.selectedFilter.totalCntMin;
        out.selectedTotalCntRange = this.selectedTotalCntRange;
        out.selectedUsedCntMax = this.selectedFilter.usedCntMax;
        out.selectedUsedCntMin = this.selectedFilter.usedCntMin;
        out.selectedUsedCntRange = this.selectedUsedCntRange;
        this.onSearch.emit(out);
        this.loading = false;
      }, error => {
        console.log(error);
        let err: BackendMessage = error.error;
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(error.status, err);
        let errorMessages = this.errorCntrler.gMessage;
        this.hmsgs = errorMessages;
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
  }

  initJobCategory2List() {
    this.jobCategory2List = [];
    this.jobCategory2Map.clear();
    this.jobCategory2List.push({ label: this.shared.chooseJC2Msg, value: 0 });
    if (this.selectedJobCategory1 != null) {
      if (this.selectedJobCategory1.id != undefined) {
        if (this.selectedJobCategory1.id != 0) {
          this._jService.geJobCategory2List(this.selectedJobCategory1.id)
            .subscribe(response => {
              let list: JobCategory2[] = <JobCategory2[]>response;
              list.forEach(element => {
                this.jobCategory2Map.set(element.id, element);
                this.jobCategory2List.push({ label: element.name, value: element });

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
    }
  }

  initJobCategory3List() {
    this.jobCategory3List = [];
    this.jobCategory3Map.clear();
    this.jobCategory3List.push({ label: this.shared.allJC3Label, value: null });
    if (this.selectedJobCategory2 != null) {
      if (this.selectedJobCategory2.id != undefined) {
        if (this.selectedJobCategory2.id != 0) {

          this._jService.geJobCategory3List(this.selectedJobCategory2.id)
            .subscribe(response => {
              let list: JobCategory3[] = <JobCategory3[]>response;
              list.forEach(element => {
                this.jobCategory3Map.set(element.id, element);
                this.jobCategory3List.push({ label: element.name, value: element });
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
    }
  }
  onProvinceChange(event: any) {
    this.selectedProvinceId = event.value;
    this.selectedTownshipID = 0;
    this.townshipList = [];
    this._geoService.geTownshipList(this.selectedProvinceId)
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
    this.selectedCityId = this.selectedCity.id;

  }
  initCityList() {
    this.cityList = [];
    this.cityList.push({ label: this.shared.chooseCityMsg, value: 0 });
    if (this.selectedTownshipID != 0) {
      this._geoService.geCityList(this.selectedTownshipID)
        .subscribe(response => {
          let list: City[] = <City[]>response;
          list.forEach(element => {
            this.cityList.push({ label: element.name, value: element });
          });

        }
          , error => {
            let obj: City[] = error.error;
            let err: BackendMessage = obj[0].error;
            this.parseError(error.status, err);
          }
        );
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
