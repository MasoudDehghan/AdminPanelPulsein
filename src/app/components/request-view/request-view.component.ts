import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { RequestPhotoP } from './../../pEntites/requestPhotoP.class';
import { RequestP } from './../../pEntites/requestP.class';
import { SharedValues } from '../../services/shared-values.service'
import { environment } from 'environments/environment';

@Component({
  moduleId: module.id,
  selector: 'app-request-view',
  templateUrl: './request-view.component.html',
  styleUrls: ['./request-view.component.css']

})
export class RequestViewComponent implements OnInit {

  @Input() requestp: RequestP = null;
  @Input() loading: boolean;

  @Output() onShowImage = new EventEmitter<string>();

  selectedRequestImgs: any[];
  selectedRequestImage: RequestPhotoP;
  displayCatalogImageDialog: boolean = false;
  baseImagePath = environment.fileServerUrl;

  requestpStartDate: string;
  requestpStopDate: string;

  requestpStartTime: string;
  requestpStopTime: string;

  constructor(
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngOnInit() {

  }
  ngOnChanges(){

    if (this.requestp != undefined && this.requestp != null) {
      if (this.requestp.extra != undefined && this.requestp.extra != null) {
        this.requestpStartDate = this.requestp.extra.startTime.substr(0, 11).trim();
        this.requestpStartTime = this.requestp.extra.startTime.substr(11).trim();
        this.requestpStopDate = this.requestp.extra.endTime.substr(0, 11).trim();
        this.requestpStopTime = this.requestp.extra.endTime.substr(11).trim();
      }
    }
  }
  ngAfterViewInit() {


    this.cdRef.detectChanges();

  }
  selectImage(requestPhoto: RequestPhotoP) {
    this.onShowImage.emit(this.baseImagePath + "/" + requestPhoto.photo)
  }

}
