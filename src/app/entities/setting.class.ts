import { BackendMessage } from "./Msg.class";

export class Setting{
    public id:number;
    public name:string;
    public typeString:boolean;
    public fvalue:number;
    public svalue:string;
    public unit:string;
    public error:BackendMessage;
}