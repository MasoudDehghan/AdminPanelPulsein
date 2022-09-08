import { Component, Input, Output, OnInit, OnChanges, EventEmitter,ChangeDetectorRef} from '@angular/core'
import { TransactionP } from './../../pEntites/transactionP.class';
import { SharedValues } from '../../services/shared-values.service'

@Component({
  moduleId: module.id,  
  selector: 'app-transaction-view',
  templateUrl: './transaction-view.component.html',
  styleUrls: ['./transaction-view.component.css']
  
})
export class TransactionViewComponent implements OnInit {

  @Input() transactionp: TransactionP = null;
  @Input() loading: boolean;
  

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

}
