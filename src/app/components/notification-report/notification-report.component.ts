import { Component, OnInit, ViewChild } from '@angular/core';
import { GrowlMessage } from 'app/entities/growlMessage.class';
import { SharedValues } from 'app/services/shared-values.service';
import { HandleErrorMsg } from 'app/shared/handleError.class';
import { environment } from 'environments/environment';
import { DataTable, SelectItem } from 'primeng/primeng';
import { CommercialNoteV } from './../../entities/commercialNoteV.class';
import { AdminService } from './../../services/admin.service';
import { ExcelService } from './../../services/excel.service';

@Component({
  selector: 'app-notification-report',
  templateUrl: './notification-report.component.html',
  styleUrls: ['../../../assets/css/dashboard.css','./notification-report.component.css'],
  providers: [AdminService, ExcelService]
})
export class NotificationReportComponent implements OnInit {
  activeLabel: string = this.shared.notificationReportLabel;
  notificationList: CommercialNoteV[] = [];
  selectedNotification: CommercialNoteV;
  @ViewChild('dt') public dataTable: DataTable;
  loading = false;
  errorCntrler: HandleErrorMsg;
  gMessage: GrowlMessage[] = [];
  displayNotificationDetail = false;
  baseImagePath = environment.fileServerUrl;
  displayImageDialog = false;
  selectedImagePath:string;
  typeList : SelectItem[];
  resultList : SelectItem[];
  resultListAndroid: SelectItem[];
  resultListIOS: SelectItem[];
  resultListWeb: SelectItem[];
  notificationLength = 0;
  constructor(private adminService: AdminService,
    public shared: SharedValues,
    private excelService: ExcelService) { }

  ngOnInit() {
    this.typeList = [
      { label: 'Andoid', value: 1 },
      { label: 'IOS', value: 2 },
      { label: 'WEB', value: 0 }
    ];
    this.resultListWeb = [
      { label: '----', value: 0 },
      { label: 'موفق', value: 1 },
      { label: 'ناموفق', value: 2 }
    ];
    this.resultListIOS = [
      { label: '----', value: 0 },
      { label: 'موفق', value: 1 },
      { label: 'ناموفق', value: 2 }
    ];
    this.resultListAndroid = [
      { label: '----', value: 0 },
      { label: 'موفق', value: 1 },
      { label: 'ناموفق', value: 2 }
    ];
    this.refresh();
  }
  refresh() {
    this.loading = true;
    this.adminService.getAllNotifications()
      .subscribe(response => {
        this.notificationList = <CommercialNoteV[]>response;
        this.loading = false;
      }
        , error => {
          console.log(error);
          this.gMessage = [];
          this.errorCntrler.gMessage = [];
          this.errorCntrler.handleErrorMethod(error.status, error);
          this.loading = false;
        }
      );
  }
  exportExcel() {
    let filteredList: CommercialNoteV[] = [];
    if (this.dataTable.filteredValue != undefined) {
      this.dataTable.filteredValue.forEach(user => {
        let entity = <CommercialNoteV>user;
        filteredList.push(entity);
      });
    }
    else {
      this.notificationList.forEach(usr => {
        let entity = <CommercialNoteV>usr;
        filteredList.push(entity);
      });
    }

    this.excelService.exportAsExcelFile(filteredList, 'filteredList');
  }
  showViewDialog(notification: CommercialNoteV) {
    let id = notification.id;
    this.loading = true;
    this.adminService.getNotification(id)
      .subscribe(response => {
        console.log(response);
        this.selectedNotification = <CommercialNoteV>response;
        this.notificationLength = this.selectedNotification.items.length; 
        this.displayNotificationDetail = true;
        this.loading = false;
      }
        , error => {
          console.log(error);
          this.gMessage = [];
          this.errorCntrler.gMessage = [];
          this.errorCntrler.handleErrorMethod(error.status, error);
        }
      );
  }
  selectImage(notification: CommercialNoteV) {
    this.selectedImagePath = this.baseImagePath + "/" + notification.imageUrl;
    this.displayImageDialog = true;
  }
  onFilter(e) {
    let list = e.filteredValue;
    this.notificationLength = list.length;
}
}
