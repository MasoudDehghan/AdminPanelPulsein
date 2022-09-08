import { TransactionType } from './transactionType.class';
import { User } from './user.class';
import { TransactionSearch } from './../pEntites/transactionSearch.class';
import { TransactionP } from 'app/pEntites/transactionP.class';

export class TransactionFilterSearchResult {
        transactionSearch: TransactionSearch;
        transactions: TransactionP[];
        totalSize:number = 0;
        selectedAmountMin:number = 0;
        selectedAmountMax:number = 0;
        selectedPaymentMethod:number = 0;
        selectedTrackingCode:string = "";
        selectedPaymentType:TransactionType = null;
        selectedReferenceUser:User = null;
        selectedFirstName:string = "";
        selectedLastName:string = "";

        selectedRegisterStartDate: string = "";
        selectedRegisterStopDate: string = "";
        selectedTransactionAmountRange:number[] = [];
}