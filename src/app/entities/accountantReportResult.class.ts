import { AccountantReport } from './accountantReport.class';
import { ArWorkerInfo } from './arWorkerInfo.class';
import { BackendMessage } from './Msg.class';
export class AccountantReportResult{
    workers:ArWorkerInfo[] = [];
    dataList:AccountantReport[] =[];
    error:BackendMessage;
}