import { WorkerDocument } from './workerDocument.class';
import { BackendMessage } from '../entities/Msg.class'
import { WorkerStationDocument } from 'app/entities/workerStationDocument.class';
export class DocumentType {
    id: number;
    name: string = "";

    related2RealWs:boolean;
    related2LegalWs:boolean;
    related2StoreWs:boolean;
    related2Wr:boolean;
    show2Client:boolean;
    duplicateAllowed:boolean;
    required:boolean;
    workerDocuments:WorkerDocument[];
    workStationDocuments:WorkerStationDocument[];
    
    error:BackendMessage;
    public DocumentType() {
    }
}