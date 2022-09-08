import { environment } from './../../../environments/environment';
import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router';
import { BackendMessage } from '../../entities/Msg.class'
import { HandleErrorMsg } from '../../shared/handleError.class'
import { GrowlMessage } from '../../entities/growlMessage.class'
//  Import Services
import { JobCateogryService } from '../../services/jobCategory.service'
import { SharedValues } from '../../services/shared-values.service'

//  Import Entities
import { WorkStation } from '../../entities/workStation.class'
import { JobCategory1 } from '../../entities/JobCategory1.class'


@Component({
    moduleId: module.id,
    selector: 'workStationDashboardComponent',
    templateUrl: './workStationDashboard.template.html',
    providers: [JobCateogryService],
    styleUrls: ['../../../assets/css/dashboard.css']
})

export class WorkStationDashboardComponent implements OnInit {
    activeLabel = this.shared.menuItem4Label;
    baseImagePath = environment.fileServerUrl;
    workstationHeader = this.shared.showBizInfo;

    workStations: WorkStation[] = [];
    workStation: WorkStation = new WorkStation();
    showWorkStationStat = false;
    errorCntrler: HandleErrorMsg;


    errorMsg: string[] = [];
    hmsgs: GrowlMessage[] = [];

    loading = false;

    jobCategory1Stat: JobCategory1[] = [];


    constructor(private _router: Router,
        private _jService: JobCateogryService,
        public shared: SharedValues) {
        this.errorCntrler = new HandleErrorMsg(_router)

    }



    ngOnInit() {
        this.activeLabel = this.shared.statJobCategory;
        this.showWorkStationStat = false;
        this.workStations = [];
        this.hmsgs = [];
        this.baseImagePath = environment.fileServerUrl;
        this.refreshStat();
    }

    refreshStat() {
        this.loading = true;
        this.jobCategory1Stat = [];
        this._jService.geJobCategory1ListCount().subscribe(result => {
            let jc1StatList: JobCategory1[] = <JobCategory1[]>result;

            jc1StatList.forEach(jc => {
                this.jobCategory1Stat.push(jc);
            });
            this.loading = false;

        }, error => {
            this.hmsgs.push({ severity: 'error', summary: '', detail: this.shared.basicDataErrMsg });
            this.loading = false;
            return;
        });

    }

    onFilterJobCategory1(event) {
        let jc1: JobCategory1 = event;
        this._router.navigate(['/workerStationMgmComponent', { jc1: jc1.id }]);
    }

    parseError(status: any, err: any) {
        this.errorCntrler.gMessage = [];
        this.hmsgs = [];
        let errMessage: BackendMessage = this.errorCntrler.handleErrorMethod(status, err);
        let errorMessages = this.errorCntrler.gMessage;
        errorMessages.forEach(element => {
            this.hmsgs.push(element);
        });
    }


}


