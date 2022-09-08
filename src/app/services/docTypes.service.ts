import { Injectable } from '@angular/core'
import { HttpClient,HttpHeaders } from '@angular/common/http';
import { DocumentType } from '../entities/DocumentType.class'
import { environment } from '../../environments/environment';

@Injectable()
export class DocumentTypeService {

  baseURL = environment.apiUrl;
  token = sessionStorage.getItem('token');

  docTypesListUrl = this.baseURL + "/documenttype/all/" + this.token;
  addDocTypeUrl = this.baseURL + "/documenttype/add/" + this.token;
  updateDocTypeUrl = this.baseURL + "/documenttype/edit/" + this.token;
  delDocTypeUrl = this.baseURL + "/documenttype/delete/" + this.token;
  httpOptions = {
       headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  constructor(private _http: HttpClient) {

  }

  getDocumentTypesList() {
    return this._http
      .get(this.docTypesListUrl,this.httpOptions);
  }

  addDocumentType(docType: DocumentType) {
    return this._http
      .post(this.addDocTypeUrl, JSON.stringify(docType),this.httpOptions);
  }
  updateDocumentType(docType: DocumentType) {
    return this._http
      .post(this.updateDocTypeUrl, JSON.stringify(docType),this.httpOptions);
  }
  deleteDocumentType(docType: DocumentType) {
    return this._http
      .post(this.delDocTypeUrl, JSON.stringify(docType),this.httpOptions);
  }


}