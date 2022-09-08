import { WorkerP } from './workP.class';
import { UserP } from './userP.class';
import { LastCreditSearch } from './lastCreditSearch.class';

export class WFinancialFilterSearchResult {
        lastCreditSearch: LastCreditSearch;
        workers: WorkerP[];
        users: UserP[];
        totalSize:number = 0;
        selectedTransactionAmountStart: number = 0;
        selectedTransactionAmountStop: number = 0;
        selectedUpdateStartDate: string = null;
        selectedUpdateStopDate: string = null;
        selectedFirstName: string = null;
        selectedLastName: string = null;
        selectedCode: string = null;
}