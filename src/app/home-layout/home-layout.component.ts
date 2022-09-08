import { SharedValues } from 'app/services/shared-values.service';
import { PrintService } from './../services/print.service';
import { Component, OnInit } from '@angular/core';
import { Message, MessageService } from 'primeng/api';
import { PortalNotification } from 'app/pEntites/portalNotification.class';

@Component({
  selector: 'app-home-layout',
  templateUrl: './home-layout.component.html',
  styleUrls: ['./home-layout.component.css'],
  providers:[MessageService]
})
export class HomeLayoutComponent implements OnInit {

  globalMsgs: Message[] = [];
  constructor(public printService: PrintService,
    private shared:SharedValues,
    private messageService: MessageService) { }

  ngOnInit() {
    this.shared.smsSubject.subscribe(data=>{
      let mData = <PortalNotification>data;
        this.messageService.add({severity:'error', summary:'درخواست ارسال پیامک', detail:` ${mData.smsCode} --------> ${mData.mobileNumber}`});
    });
  }

}
