import { RequestMgmService } from './../../services/requestMgm.service';
import { RequestSearch } from './../../entities/requestSearch.class';
import { RequestSearchResult } from './../../entities/requestSearchResult.class';
import { Component, Input, Output, OnInit, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms'
import { Router } from '@angular/router';
import { JobCategory1 } from '../../entities/JobCategory1.class'
import { JobCategory2 } from '../../entities/JobCategory2.class'
import { JobCategory3 } from '../../entities/JobCategory3.class'
import { SelectItem } from 'primeng/primeng';
import { SharedValues } from '../../services/shared-values.service'
import { JobCateogryService } from '../../services/jobCategory.service'
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
import { RequestState } from '../../entities/requestState.class'
import { TownShip } from '../../entities/township.class'
import { City } from '../../entities/city.class'
import { Region } from '../../entities/region.class'
import { Area } from '../../entities/area.class'
import { GeoService } from '../../services/geo.service'
import { RequestFilterSearchResult } from 'app/entities/roSearchResult.class';

import * as moment from 'jalali-moment';
import { Moment } from 'jalali-moment';

@Component({
  selector: 'app-request-filter',
  templateUrl: './request-filter.component.html',
  styleUrls: ['./request-filter.component.css'],
  providers:[JobCateogryService,GeoService,RequestMgmService]
})
export class RequestFilterComponent implements OnInit {
  filterForm: FormGroup;
  selectedFilter: RequestSearch = new RequestSearch();
  loading = false;

  @Input() selectedTitle: string = null;
  @Input() selectedCode: string = null;
  @Input() selectedJobCategory1: JobCategory1 = null;
  @Input() selectedJobCategory2: JobCategory2 = null;
  @Input() selectedJobCategory3: JobCategory3 = null;
  @Input() jobCategory1List: SelectItem[] = [];
  @Input() selectedRequestStateList: RequestState[] = [];
  @Input() requestStateList: SelectItem[] = [];
  @Input() selectedTransactionAmountStart: number;
  @Input() selectedTransactionAmountStop: number;
  @Input() selectedRegisterStartDate: string = null;
  @Input() selectedRegisterStopDate: string = null;
  @Input() selectedUpdateStartDate: string = null;
  @Input() selectedUpdateStopDate: string = null;
  @Input() selectedClientFirstName: string = null;
  @Input() selectedClientLastName: string = null;
  @Input() selectedClientMobileNumber: string = null;
  @Input() selectedCity: City = new City();
  @Input() selectedRegion: Region = new Region();
  @Input() selectedArea: Area = new Area();
  @Input() provinceList: SelectItem[] = [];
  @Input() selectedWorkerCode: string = null;
  @Input() selectedWorkerFirstName: string = null;
  @Input() selectedWorkerLastName: string = null;
  @Input() showStateFilter : boolean = false;
  @Output() onClose = new EventEmitter<boolean>();
  @Output() onSearch = new EventEmitter<RequestFilterSearchResult>();

  selectedProvinceID: number = 0;
  selectedTownshipID: number = 0;
  selectedTownshipName: string = "";
  selectedCityID: number = 0;
  selectedRegionID: number = 0;
  selectedAreaID: number = 0;
  selectedRequestState:RequestState;
  areaName: string = "";
  townshipList: SelectItem[] = [];
  cityList: SelectItem[] = [];
  regionList: SelectItem[] = [];
  areaList: SelectItem[] = [];

  jobCategory2List: SelectItem[] = [];
  jobCategory3List: SelectItem[] = [];



  jobCategory2Map: Map<number, JobCategory2> = new Map<number, JobCategory2>();
  jobCategory3Map: Map<number, JobCategory3> = new Map<number, JobCategory3>();

  errorCntrler: HandleErrorMsg;
  msgs: GrowlMessage[] = [];
  datePickerConfig = {
    drops: 'up',
    format: 'YYYY/MM/DD HH:mm:ss',
    appendTo:'body'
};
datePickerConfig1 = {
  drops: 'up',
  format: 'YYYY/MM/DD HH:mm:ss',
  appendTo:'body'
};
datePickerConfig2 = {
  drops: 'up',
  format: 'YYYY/MM/DD HH:mm:ss',
  appendTo:'body'
};
datePickerConfig3 = {
  drops: 'up',
  format: 'YYYY/MM/DD HH:mm:ss',
  appendTo:'body'
};
datePickerConfig4 = {
  drops: 'up',
  format: 'YYYY/MM/DD HH:mm:ss',
  appendTo:'body'
};
  _registerStartDate : Moment;
  _registerStopDate : Moment;
  _updateStartDate : Moment;
  _updateStopDate : Moment;
  constructor(private _router: Router, private _fb: FormBuilder,
    private _jService: JobCateogryService,
    public requestMgmService: RequestMgmService,
    private _geoService: GeoService,
    public shared: SharedValues) { }

  ngOnInit() {
    this.filterForm = this._fb.group({
      title: [''],
      code: [''],
      jobCategory1FormCntrl: [''],
      jobCategory2FormCntrl: [''],
      jobCategory3FormCntrl: [''],
      requestStateFormCntrl: [''],
      transactionAmountStartFormCntrl: [''],
      transactionAmountStopFormCntrl: [''],
      registerStartDate: [''],
      registerStopDate: [''],
      updateStartDate: [''],
      updateStopDate: [''],
      location: new FormGroup({
        province: new FormControl(''),
        township: new FormControl(''),
        city: new FormControl(''),
        region: new FormControl(['']),
        area: new FormControl([''])
      }),
      personalData: new FormGroup({
        firstName: new FormControl(['']),
        lastName: new FormControl(['']),
        mobileNumber: new FormControl([''])
      }),
      workerCode: [''],
      workerFirstName: [''],
      workerLastName: ['']
    });

    this.errorCntrler = new HandleErrorMsg(this._router);
    this.initJobCategory2List();
    this.initJobCategory3List();
    this.initTownshipList();
    this.initCityList();
    this.initRegionList();
    this.initAreaList();
    
  }

  ngAfterViewInit() {
    
  }
 
  onSubmitFilterform() {
    try {

      if(this._registerStartDate!=undefined)
        this.selectedRegisterStartDate = moment(this._registerStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if(this._registerStopDate!=undefined)
          this.selectedRegisterStopDate = moment(this._registerStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if(this._updateStartDate!=undefined)    
        this.selectedUpdateStartDate = moment(this._updateStartDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if(this._updateStopDate!=undefined)
        this.selectedUpdateStopDate = moment(this._updateStopDate).locale('fa').format('YYYY/MM/DD HH:mm:ss');
      if (this.selectedTitle != null) {
        if (this.selectedTitle != '') {
          this.selectedFilter.title = this.selectedTitle;
          this.selectedFilter.f_title = true;
        }
      }
      if (this.selectedCode != null) {
        if (this.selectedCode != '') {
          this.selectedFilter.code = this.selectedCode.replace(' ', '');
          this.selectedFilter.code = this.selectedFilter.code.trim();
          this.selectedFilter.f_code = true;
        }
      }
      if (this.selectedJobCategory1 != null) {
        if (this.selectedJobCategory1.id != 0) {
          this.selectedFilter.jobCategory1Id = this.selectedJobCategory1.id;
          this.selectedFilter.f_jobCategory1Id = true;
        }
      }
      if (this.selectedJobCategory2 != null) {
        if (this.selectedJobCategory2.id != 0) {
          this.selectedFilter.jobCategory2Id = this.selectedJobCategory2.id;
          this.selectedFilter.f_jobCategory2Id = true;
        }
      }
      if (this.selectedJobCategory3 != null) {
        if (this.selectedJobCategory3.id != 0) {
          this.selectedFilter.jobCategory3Id = this.selectedJobCategory3.id;
          this.selectedFilter.f_jobCategory3Id = true;
        }
      }

      if (this.selectedCityID != 0) {
        this.selectedFilter.cityId = this.selectedCityID;
        this.selectedFilter.f_cityId = true;
      }

      if (this.selectedAreaID != 0) {
        this.selectedFilter.areaId = this.selectedAreaID;
        this.selectedFilter.f_areaId = true;
      }
      if (this.selectedRegionID != 0) {
        this.selectedFilter.regionId = this.selectedRegionID;
        this.selectedFilter.f_regionId = true;
      }
      if (this.selectedClientFirstName != null) {
        if (this.selectedClientFirstName != '') {
          this.selectedFilter.clientFirstName = this.selectedClientFirstName;
          this.selectedFilter.f_clientFirstName = true;
        }
      }
      if (this.selectedClientLastName != null) {
        if (this.selectedClientLastName != '') {

          this.selectedFilter.clientLastName = this.selectedClientLastName;
          this.selectedFilter.f_clientLastName = true;
        }
      }
      if (this.selectedClientMobileNumber != null) {
        if (this.selectedClientMobileNumber != '') {
          this.selectedFilter.clientMobileNumber = this.selectedClientMobileNumber;
          this.selectedFilter.f_clientMobileNumber = true;
        }
      }
      if(this.selectedRequestState){
        this.selectedRequestStateList = [];
        this.selectedRequestStateList.push(this.selectedRequestState)
      }
      
      if (this.selectedRequestStateList != null) {
        if (this.selectedRequestStateList.length > 0) {
          this.selectedRequestStateList.forEach(req=>{
            this.selectedFilter.stateIdList.push(req.id);
          });
          
          this.selectedFilter.f_stateId = true;
        }
      }
      if (this.selectedRegisterStartDate != null && this.selectedRegisterStopDate != null) {
        if (this.selectedRegisterStartDate != "" && this.selectedRegisterStopDate != "") {
          this.selectedFilter.registerTimeStart = this.selectedRegisterStartDate;
          this.selectedFilter.registerTimeEnd = this.selectedRegisterStopDate;
          this.selectedFilter.f_registerTime = true;
        }
      }
      if (this.selectedUpdateStartDate != null && this.selectedUpdateStopDate != null) {
        if (this.selectedUpdateStartDate != "" && this.selectedUpdateStopDate != "") {
          this.selectedFilter.updateTimeStart = this.selectedUpdateStartDate;
          this.selectedFilter.updateTimeEnd = this.selectedUpdateStopDate;
          this.selectedFilter.f_updateTime = true;
        }
      }
      if (this.selectedTransactionAmountStart != 0 && this.selectedTransactionAmountStop != 0) {
          this.selectedFilter.f_price = true;
          this.selectedFilter.priceMin = this.selectedTransactionAmountStart;
          this.selectedFilter.priceMax = this.selectedTransactionAmountStop;
      }

      if (this.selectedWorkerCode != null) {
        this.selectedFilter.selectedWorkerCode = this.selectedWorkerCode;
        this.selectedFilter.f_selectedWorkerCode = true;
      }
      if (this.selectedWorkerFirstName != null) {
        if (this.selectedWorkerFirstName != '') {
          this.selectedFilter.workerFirstName = this.selectedWorkerFirstName;
          this.selectedFilter.f_workerFirstName = true;
        }
      }
      if (this.selectedWorkerLastName != null) {
        if (this.selectedWorkerLastName != '') {
          this.selectedFilter.workerLastName = this.selectedWorkerLastName;
          this.selectedFilter.f_workerLastName = true;
        }
      }
      this.loading = true;
      this.requestMgmService.search(this.selectedFilter).subscribe(response => {
        console.log(response);
        let out: RequestFilterSearchResult = new RequestFilterSearchResult();

        let requestSeacrhResult: RequestSearchResult = <RequestSearchResult>response;
        out.requests = requestSeacrhResult.requestList;
        out.totalSize = requestSeacrhResult.totalSize;
        out.requestSearch = this.selectedFilter;
        out.selectedTitle = this.selectedTitle;
        out.selectedCode = this.selectedCode;
        out.selectedJobCategory1 = this.selectedJobCategory1;
        out.selectedJobCategory2 = this.selectedJobCategory2;
        out.selectedJobCategory3 = this.selectedJobCategory3;
        out.selectedClientMobileNumber = this.selectedClientMobileNumber;
        out.selectedClientFirstName = this.selectedClientFirstName;
        out.selectedClientLastName = this.selectedClientLastName;
        out.selectedCity = this.selectedCity;
        out.selectedRegion = this.selectedRegion;
        out.selectedArea = this.selectedArea;
        out.selectedRegisterStartDate = this.selectedRegisterStartDate;
        out.selectedRegisterStopDate = this.selectedRegisterStopDate;
        out.selectedRequestStateList = this.selectedRequestStateList;
        out.selectedUpdateStartDate = this.selectedUpdateStartDate;
        out.selectedUpdateStopDate = this.selectedUpdateStopDate;
        out.selectedRequestPriceStart = this.selectedTransactionAmountStart;
        out.selectedRequestPriceStop = this.selectedTransactionAmountStop;
        out.selectedWorkerCode = this.selectedWorkerCode;
        out.selectedWorkerFirstName = this.selectedWorkerFirstName;
        out.selectedWorkerLastName = this.selectedWorkerLastName;
        this.onSearch.emit(out);
        this.loading = false;
      }, error => {
        let obj: RequestSearchResult = error.error;
        let err: BackendMessage = obj.error;
        this.parseError(error.status, err);
        this.loading = false;
      });

    }
    catch (e) {
      console.log(e);
    }
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
    this.selectedJobCategory3 = new JobCategory3();
    this.initJobCategory3List();
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
    this.initRegionList();
    this.initAreaList();
  }
  onRegionChange(event: any) {
    this.selectedRegion = event.value;
    if (this.selectedRegion != null)
      this.selectedRegionID = this.selectedRegion.id;
    else
      this.selectedRegionID = 0;

    this.initAreaList();
  }

  onAreaChange(event: any) {
    if (this.selectedArea != null) {
      this.selectedAreaID = this.selectedArea.id;
      this.areaName = this.selectedArea.name;
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
  initRegionList() {
    this.regionList = [];
    this.regionList.push({ label: this.shared.allRegionLabel, value: null });
    if (this.selectedCityID != 0) {
      this._geoService.geRegionList(this.selectedCityID)
        .subscribe(response => {
          let list: Region[] = <Region[]>response;
          list.forEach(element => {
            this.regionList.push({ label: element.name, value: element });
          });

        }
        , error => {
          let obj: Region[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
        );
    }
  }
  initAreaList() {
    this.selectedArea = null;
    this.selectedAreaID = 0;
    this.loadAreaList();
  }
  loadAreaList() {
    this.areaList = [];
    this.areaList.push({ label: this.shared.chooseAreaMsg, value: 0 });
    if (this.selectedCityID !== 0 && this.selectedRegionID == 0) {
      this._geoService.geAreaListByCityID(this.selectedCityID)
        .subscribe(response => {
          let list: Area[] = <Area[]>response;
          list.forEach(element => {
            this.areaList.push({ label: element.region.name + " - " + element.name, value: element });
          });

        }
        , error => {
          let obj: Area[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
        );
    }

    else if (this.selectedCityID !== 0 && this.selectedRegionID != 0) {
      this._geoService.geAreaList(this.selectedRegionID)
        .subscribe(response => {
          let list: Area[] = <Area[]>response;
          list.forEach(element => {
            this.areaList.push({ label: element.name, value: element });
          });

        }
        , error => {
          let obj: Area[] = error.error;
          let err: BackendMessage = obj[0].error;
          this.parseError(error.status, err);
        }
        );
    }
    else if (this.selectedRegionID == 0) {
      this.areaList.push({ label: this.shared.chooseAreaMsg, value: 0 });
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
