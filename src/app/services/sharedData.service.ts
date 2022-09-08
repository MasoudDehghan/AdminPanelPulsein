import { ValueAddedAggregatedInfo } from './../entities/valueAddedAggregatedInfo.class';
import { TransactionV } from './../entities/transactionV.class';
import { WorkerP } from './../pEntites/workP.class';
import { Injectable } from '@angular/core';
import { ValueAddedInfo } from 'app/entities/valueAddedInfo.class';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  public worker:WorkerP;
  public selectedTransactionTotalRecords:number;

  selectedTransactionList: TransactionV[] = [];
  transactionListHeader:string = null;

  valueAddedInfo: ValueAddedInfo = null;
  aggregatedValueAddedInfo: ValueAddedAggregatedInfo = null;

  constructor() { }

  
}
