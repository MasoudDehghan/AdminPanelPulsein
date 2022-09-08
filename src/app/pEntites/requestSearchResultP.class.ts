import { BackendMessage } from "../entities/Msg.class";
import { RequestP } from "./requestP.class"
export class RequestSearchResultP{
    error:BackendMessage;
    totalSize:number;
    firstRow:number;
    pageSize:number;
    requestList:RequestP[];
}