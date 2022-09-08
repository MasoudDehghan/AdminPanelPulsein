import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { ValueAddedInfo } from 'app/entities/valueAddedInfo.class';
import { SharedValues } from '../../services/shared-values.service';
import { ProductInfoView } from '../valueAdded-report/valueAddred-report.component';
import { ValueAddedAggregatedInfo } from './../../entities/valueAddedAggregatedInfo.class';

@Component({
  moduleId: module.id,
  selector: 'app-valueAddedExtended-view',
  templateUrl: './valueAddedExtended-view.component.html',
  styleUrls: ['./valueAddedExtended-view.component.css']

})
export class ValueAddedExtendedViewComponent implements OnInit {

  @Input() selectedData: ValueAddedInfo = null;
  @Input() selectedAggregatedData: ValueAddedAggregatedInfo = null;
  selectedProductViewList: ProductInfoView[] = [];
  dataTableLoading = false;
  workerName: string;
  nationalCode: string;
  province: string;
  postalCode: string;
  address: string;
  mobileNumber: string;
  commision;
  valueAdded;
  totalCommision;
  constructor(
    public shared: SharedValues,
    private cdRef: ChangeDetectorRef
  ) {

  }
  ngOnInit() {
    let registered = false;
    if (this.selectedData) {
      registered = this.selectedData.registered;
      this.workerName = this.selectedData.workerName;
      this.nationalCode = this.selectedData.nationalCode;
      this.province = this.selectedData.province;
      this.postalCode = this.selectedData.postalCode;
      this.address = this.selectedData.address;
      this.mobileNumber = this.selectedData.mobileNumber;
      this.commision = this.selectedData.commision;
      this.valueAdded = this.selectedData.valueAdded;
      this.totalCommision = this.selectedData.totalCommision;
      let productView = new ProductInfoView();
      productView.index = 1;
      productView.name = this.selectedData.cat3;
      productView.user = this.selectedData.clientFirstName + " " + this.selectedData.clientLastName;
      productView.code = this.selectedData.code;
      productView.count = 1;
      productView.unit = this.shared.orderLabel;
      productView.commision = this.selectedData.commision;
      productView.tax = this.selectedData.valueAdded;
      productView.total = this.selectedData.totalCommision;
      productView.accountantNumber = this.selectedData.accountantNumber;
      if (!registered) {
        productView.noAccountNumber = false;
      }
      else {
        if (!this.selectedData.accountantNumber) {
          productView.noAccountNumber = true;
        }
        else
          productView.noAccountNumber = false;
      }

      this.selectedProductViewList = [];
      this.selectedProductViewList.push(productView);
    }
    else if (this.selectedAggregatedData) {
      registered = this.selectedAggregatedData.registered;
      this.workerName = this.selectedAggregatedData.workerFirstName + " " + this.selectedAggregatedData.workerLastName;
      this.nationalCode = this.selectedAggregatedData.nationalCode;
      this.province = this.selectedAggregatedData.province;
      this.postalCode = this.selectedAggregatedData.postalCode;
      this.address = this.selectedAggregatedData.address;
      this.mobileNumber = this.selectedAggregatedData.mobileNumber;
      this.commision = this.selectedAggregatedData.sum.commision;
      this.valueAdded = this.selectedAggregatedData.sum.valueAdded;
      this.totalCommision = this.selectedAggregatedData.sum.totalCommision;

      this.selectedProductViewList = [];
      let index = 1;
      this.selectedAggregatedData.items.forEach(item => {
        let productView = new ProductInfoView();
        productView.index = index;
        productView.name = item.cat3;
        productView.user = item.clientFirstName + " " + item.clientLastName;
        productView.code = item.code;
        productView.count = 1;
        productView.unit = this.shared.orderLabel;
        productView.commision = item.commision;
        productView.tax = item.valueAdded;
        productView.total = item.totalCommision;
        productView.accountantNumber = item.accountantNumber;
        if (!registered) {
          productView.noAccountNumber = false;
        }
        else {
          if (!item.accountantNumber) {
            productView.noAccountNumber = true;
          }
          else
            productView.noAccountNumber = false;
        }

        this.selectedProductViewList.push(productView);
        index++;
      });

    }
  }

  ngAfterViewInit() {
    this.cdRef.detectChanges();

  }

}
