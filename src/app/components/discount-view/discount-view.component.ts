import { Component, Input, Output, OnInit, OnChanges, EventEmitter, ChangeDetectorRef } from '@angular/core'
import { SharedValues } from '../../services/shared-values.service'
import { DiscountV } from '../../pEntites/discountV.class';
import { environment } from 'environments/environment';

@Component({
  moduleId: module.id,
  selector: 'app-discount-view',
  templateUrl: './discount-view.component.html',
  styleUrls: ['./discount-view.component.css']

})
export class DiscountViewComponent implements OnInit {

  @Input() discount: DiscountV = null;
  @Input() loading: boolean;
  @Output() onShowImage = new EventEmitter<string>();
  baseImagePath = environment.fileServerUrl;
  constructor(
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngOnInit() {

  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();

  }
  showProfileImage() {
    this.onShowImage.emit(this.baseImagePath + "/" + this.discount.detail.image);
  }
}
