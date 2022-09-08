import { RequestView } from './requestView.class';
import { BackendMessage } from './Msg.class';

export class RequestSearchResult{
        error:BackendMessage;	
        totalSize:number;
        firstRow:number;
        pageSize:number;
        requestList:RequestView[] = [];
}